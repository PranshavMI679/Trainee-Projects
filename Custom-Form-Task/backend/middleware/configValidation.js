const Joi = require('joi');
const { FormConfig, Form, Client } = require('../models');
const AppError = require('../utils/appError');

const REGEX_PATTERNS = {
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  EMAIL_BASIC: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  EXACT_DATE: /^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$/,
  EXACT_DATETIME: /^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d$/
};

const configValidation = async (req, res, next) => {
  try {
    const { code } = req.params; 
    let lookupIdentifier = code ? String(code).trim() : null;
    const { custom_values } = req.body;

    if (!lookupIdentifier) {
      return next(new AppError("A validation tracking identifier path parameter is strictly required.", 400));
    }

    let allRules = [];

    if (lookupIdentifier.toUpperCase().startsWith('EMP')) {
      const employeeRecord = await Form.findOne({ where: { employee_code: lookupIdentifier.toUpperCase() } });
      if (employeeRecord) {
        allRules = await FormConfig.findAll({ 
          where: { client_id: employeeRecord.client_id },
          order: [
            ['created_at', 'DESC'],
            ['section_order', 'ASC'],
            ['area_order', 'ASC'],
            ['field_order', 'ASC']
          ]
        });
      }
    } else {
      const targetClient = await Client.findOne({ where: { client_code: lookupIdentifier } });

      if (targetClient) {
        allRules = await FormConfig.findAll({ 
          where: { client_id: targetClient.client_id },
          order: [
            ['created_at', 'DESC'],
            ['section_order', 'ASC'],
            ['area_order', 'ASC'],
            ['field_order', 'ASC']
          ]
        });
      } else {
        allRules = await FormConfig.findAll({ 
          where: { config_code: lookupIdentifier },
          order: [
            ['created_at', 'DESC'],
            ['section_order', 'ASC'],
            ['area_order', 'ASC'],
            ['field_order', 'ASC']
          ]
        });
      }
    }

    if (allRules.length === 0 && req.body.config_code) {
      allRules = await FormConfig.findAll({ 
        where: { config_code: String(req.body.config_code).trim() },
        order: [
          ['created_at', 'DESC'],
          ['section_order', 'ASC'],
          ['area_order', 'ASC'],
          ['field_order', 'ASC']
          ]
      });
    }

    const rules = [];
    const observedKeys = new Set();

    for (let i = 0; i < allRules.length; i++) {
      const currentRule = allRules[i];
      if (!currentRule.key || observedKeys.has(currentRule.key)) continue;

      const opts = currentRule.options || {};
      
      const isDeletedField = opts.is_deleted_field === true || 
                             opts.is_deleted_field === 'true' ||
                             opts.is_delete === true || 
                             opts.is_delete === 'true';

      if (!isDeletedField) {
        observedKeys.add(currentRule.key);
        rules.push(currentRule);
      }
    }

    if (rules.length === 0) {
      return next(new AppError("Validation configuration block could not be resolved. Ensure the client code or layout config UUID is active and registered in your database.", 400));
    }

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
