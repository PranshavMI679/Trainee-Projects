const Joi = require('joi');
const { FormConfig, Section, SectionArea, Field, FormDataSubmission, Client, Module } = require('../models');
const AppError = require('../utils/appError');

const REGEX_PATTERNS = {
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  EMAIL_BASIC: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  EXACT_DATE: /^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$/,
  EXACT_DATETIME: /^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d$/
};

const configValidation = async (req, res, next) => {
  try {
    // 1. Resolve client_code safely from request parameter boundaries
    const { client_code } = req.params; 
    let lookupIdentifier = client_code ? String(client_code).trim() : null;
    const { custom_values } = req.body;

    if (!lookupIdentifier) {
      return next(new AppError("A validation tracking identifier path parameter is strictly required.", 400));
    }

    let baseConfigs = [];
    
    // 2. Resolve Master Configuration contexts cleanly by parsing incoming identifiers
    if (lookupIdentifier.toUpperCase().startsWith('EMP')) {
      const employeeRecord = await FormDataSubmission.findOne({ where: { employee_code: lookupIdentifier } });
      if (employeeRecord) {
        baseConfigs = await FormConfig.findAll({ 
          where: { 
            client_code: employeeRecord.client_code,
            module_code: employeeRecord.module_code 
          }
        });
      }
    } else {
      const targetModule = await Module.findOne({ where: { module_code: lookupIdentifier } });

      if (targetModule) {
        baseConfigs = await FormConfig.findAll({ where: { module_code: targetModule.module_code } });
      } else {
        const targetClient = await Client.findOne({ where: { client_code: lookupIdentifier } });

        if (targetClient) {
          baseConfigs = await FormConfig.findAll({ where: { client_code: targetClient.client_code } });
        } else {
          baseConfigs = await FormConfig.findAll({ where: { config_code: lookupIdentifier } });
        }
      }
    }

    if (baseConfigs.length === 0 && req.body.config_code) {
      baseConfigs = await FormConfig.findAll({ where: { config_code: String(req.body.config_code).trim() } });
    }

    if (baseConfigs.length === 0) {
      return next(new AppError("Validation configuration block could not be resolved. Ensure the module code, client code, or config UUID is active and registered in your database.", 400));
    }

    // 3. Resolve the actual underlying field tree by utilizing cascade associations
    const configCodes = baseConfigs.map(c => c.config_code);
    const sections = await Section.findAll({
      where: { config_code: configCodes },
      order: [
        ['section_order', 'ASC'],
        [{ model: SectionArea, as: 'areas' }, 'area_order', 'ASC'],
        [{ model: SectionArea, as: 'areas' }, { model: Field, as: 'fields' }, 'field_order', 'ASC']
      ],
      include: [{
        model: SectionArea,
        as: 'areas',
        include: [{
          model: Field,
          as: 'fields'
        }]
      }]
    });

    // 4. Flatten and filter active fields out of cascading tree structures
    const rules = [];
    const observedKeys = new Set();

    for (const sec of sections) {
      if (sec.options?.is_delete === true) continue;
      
      for (const ar of sec.areas || []) {
        if (ar.options?.is_delete === true) continue;

        for (const f of ar.fields || []) {
          const opts = f.options || {};
          const isDeletedField = opts.is_deleted_field === true || 
                                 opts.is_deleted_field === 'true' ||
                                 opts.is_delete === true || 
                                 opts.is_delete === 'true' ||
                                 opts.is_field_deleted === true ||
                                 opts.is_field_deleted === 'true';
          
          if (!isDeletedField && f.key && !observedKeys.has(f.key)) {
            observedKeys.add(f.key);
            rules.push(f);
          }
        }
      }
    }

    if (rules.length === 0) {
      return next(new AppError("Validation layout rules could not be calculated. No active input structural fields exist within the targeted workspace.", 400));
    }

    // 5. Build Dynamic Joi Schema Configuration matrix
    const dynamicJoiRules = {};
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      let joiFieldSchema;
      const normalizedType = rule.type.toLowerCase().replace(/[^a-z0-9]/g, '');
      const parsedOptions = rule.options || {};

      switch (normalizedType) {
        case 'singleline':
        case 'textbox': 
        case 'multiline':
        case 'currency': 
        case 'phone':    
          joiFieldSchema = Joi.string().trim();
          if (rule.length) {
            joiFieldSchema = joiFieldSchema.max(rule.length).messages({
              'string.max': `Custom field '${rule.label}' exceeds maximum permitted length of ${rule.length} characters.`
            });
          }
          break;

        case 'email':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.EMAIL_BASIC).messages({
            'string.pattern.base': `Custom field '${rule.label}' must be a valid email structure.`
          });
          break;

        case 'dropdown':
        case 'radio':
        case 'radioselection':
        case 'checkbox': {
          let allowedList = [];
          if (Array.isArray(parsedOptions)) {
            allowedList = parsedOptions.map(o => String(o).trim());
          } else if (parsedOptions && Array.isArray(parsedOptions.value)) {
            allowedList = parsedOptions.value.map(o => String(o).trim());
          }

          if (allowedList.length === 0) {
            joiFieldSchema = Joi.any().forbidden().messages({
              'any.unknown': `Configuration error: Custom field '${rule.label}' has no valid choices configured.`
            });
          } else {
            const isMultipleMode = parsedOptions.is_multiple === true || parsedOptions.is_multiple === 'true';
            
            if (isMultipleMode) {
              joiFieldSchema = Joi.array().items(
                Joi.string().trim().valid(...allowedList).messages({
                  'any.only': `Selected option inside '${rule.label}' must match one of: [${allowedList.join(', ')}].`
                })
              ).min(1).messages({
                'array.min': `You must select at least one choice for '${rule.label}'.`
              });
            } else {
              joiFieldSchema = Joi.string().trim().valid(...allowedList).messages({
                'any.only': `Custom field '${rule.label}' must match one of your updated choices: [${allowedList.join(', ')}].`
              });
            }
          }
          break;
        }

        case 'date':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.EXACT_DATE).messages({
            'string.pattern.base': `Custom field '${rule.label}' must be a valid date in YYYY-MM-DD format.`
          });
          break;

        case 'datetime':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.EXACT_DATETIME).messages({
            'string.pattern.base': `Custom field '${rule.label}' must match format YYYY-MM-DD HH:mm:ss.`
          });
          break;

        case 'number':
        case 'decimal':
        case 'percent':
          joiFieldSchema = Joi.alternatives().try(
            Joi.number().min(0).messages({
              'number.base': `Custom field '${rule.label}' must be a numeric format.`,
              'number.min': `Custom field '${rule.label}' value cannot be negative.`
            }),
            Joi.string().valid('').empty('')
          );
          break;

        case 'url':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.URL).messages({
            'string.pattern.base': `Custom field '${rule.label}' must be a valid URL string.`
          });
          break;
        default:
          joiFieldSchema = Joi.any();
          break;
      }

      if (normalizedType !== 'fileupload' && normalizedType !== 'file') {
        if (rule.is_required) {
          joiFieldSchema = joiFieldSchema.required().messages({
            'any.required': `The dynamic field '${rule.label}' is marked mandatory.`,
            'string.empty': `The dynamic field '${rule.label}' cannot be left empty.`
          });
        } else {
          joiFieldSchema = joiFieldSchema.optional().allow('', null);
        }
      }
      dynamicJoiRules[rule.key] = joiFieldSchema;
    }

    const compiledSchema = Joi.object(dynamicJoiRules).unknown(true);
    const { error, value } = compiledSchema.validate(custom_values || {}, {
      abortEarly: false,
      stripUnknown: false  
    });

    if (error) {
      const errorMessagesArray = [];
      for (let j = 0; j < error.details.length; j++) {
        errorMessagesArray.push(error.details[j].message);
      }
      const completeErrorMessage = errorMessagesArray.join('; ');
      return next(new AppError(completeErrorMessage, 400));
    }
    req.body.custom_values = value;
    return next();
  } 
  catch (error) {
    return next(error);
  }
};

module.exports = configValidation;
