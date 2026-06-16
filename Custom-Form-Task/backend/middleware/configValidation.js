const Joi = require('joi');
const { FormConfig, Form, Client } = require('../models');
const AppError = require('../utils/appError');

const REGEX_PATTERNS = {
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  EMAIL_BASIC: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  EXACT_DATE: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|\d|3)$/,
  EXACT_DATETIME: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|\d|3) (0\d|1\d|2[0-4]):[0-5]\d:[0-5]\d$/
};

const configValidation = async (req, res, next) => {
  try {
    const { code } = req.params; 
    let { config_code, client_code } = req.params; 
    let { employee_code } = req.params;
    const { custom_values } = req.body;

    if (code) {
      if (code.includes('-') && code.length > 20) {
        config_code = code;
      } else if (code.toUpperCase().startsWith('EMP')) {
        employee_code = code;
      } else {
        client_code = code;
      }
    }

    if (!config_code && client_code) {
      const targetClient = await Client.findOne({ where: { client_code } });
      if (targetClient) {
        const layoutTemplates = await FormConfig.findAll({ 
          where: { client_id: targetClient.client_id },
          order: [
            ['section_order', 'ASC'],
            ['area_order', 'ASC'],
            ['field_order', 'ASC']
          ]
        });
        
        for (let i = 0; i < layoutTemplates.length; i++) {
          const item = layoutTemplates[i];
          let opts = {};

          if (item.options) {
            if (typeof item.options === 'string') {
              try { opts = JSON.parse(item.options); } catch (e) {}
            } else if (typeof item.options === 'object') {
              opts = item.options;
            }
          }

          const isDeleted = opts.is_deleted_field === true || 
                            opts.is_deleted_field === 'true' ||
                            opts.is_delete === true || 
                            opts.is_delete === 'true';

          if (!isDeleted) {
            config_code = item.config_code;
            break; 
          }
        }
      }
    }

    if (!config_code && employee_code) {
      const employeeRecord = await Form.findOne({ where: { employee_code } });
      if (employeeRecord) {
        const layoutTemplates = await FormConfig.findAll({ 
          where: { client_id: employeeRecord.client_id },
          order: [
            ['section_order', 'ASC'],
            ['area_order', 'ASC'],
            ['field_order', 'ASC']
          ]
        });
        
        for (let i = 0; i < layoutTemplates.length; i++) {
          const item = layoutTemplates[i];
          let opts = {};

          if (item.options) {
            if (typeof item.options === 'string') {
              try { opts = JSON.parse(item.options); } catch (e) {}
            } else if (typeof item.options === 'object') {
              opts = item.options;
            }
          }

          const isDeleted = opts.is_deleted_field === true || 
                            opts.is_deleted_field === 'true' ||
                            opts.is_delete === true || 
                            opts.is_delete === 'true';

          if (!isDeleted) {
            config_code = item.config_code;
            break; 
          }
        }
      }
    }

    if (!config_code && req.body.config_code) {
      config_code = req.body.config_code;
    }

    const rules = [];
    
    if (config_code) {
      const allRules = await FormConfig.findAll({ 
        where: { config_code },
        order: [
          ['section_order', 'ASC'],
          ['area_order', 'ASC'],
          ['field_order', 'ASC']
        ]
      });

      for (let i = 0; i < allRules.length; i++) {
        const currentRule = allRules[i];
        let currentOpts = {};

        if (currentRule.options) {
          if (typeof currentRule.options === 'string') {
            try {
              currentOpts = JSON.parse(currentRule.options);
            } catch (e) {
              currentOpts = {};
            }
          } else if (typeof currentRule.options === 'object') {
            currentOpts = currentRule.options;
          }
        }
        
        const isDeletedField = currentOpts.is_deleted_field === true || 
                               currentOpts.is_deleted_field === 'true' ||
                               currentOpts.is_delete === true || 
                               currentOpts.is_delete === 'true';

        if (!isDeletedField) {
          rules.push(currentRule);
        }
      }
    }

    const dynamicJoiRules = {};

    if (rules.length === 0 && custom_values && typeof custom_values === 'object') {
      const incomingKeys = Object.keys(custom_values);
      for (let k = 0; k < incomingKeys.length; k++) {
        dynamicJoiRules[incomingKeys[k]] = Joi.any().optional().allow('', null);
      }
    } else {
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        let joiFieldSchema;
        const normalizedType = rule.type.toLowerCase().replace(/[^a-z0-9]/g, '');

        let parsedOptions = {};
        if (rule.options) {
          if (typeof rule.options === 'string') {
            try { parsedOptions = JSON.parse(rule.options); } catch (e) {}
          } else if (typeof rule.options === 'object') {
            parsedOptions = rule.options;
          }
        }

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
          case 'checkbox':
            const allowedList = parsedOptions.value || [];
            if (parsedOptions.is_multiple === true || parsedOptions.is_multiple === 'true') {
              joiFieldSchema = Joi.array().items(Joi.string().trim().valid(...allowedList)).min(1);
            } else {
              joiFieldSchema = Joi.string().trim().valid(...allowedList);
            }
            break;

          case 'date':
            joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.EXACT_DATE);
            break;

          case 'datetime':
            joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.EXACT_DATETIME);
            break;

          case 'number':
          case 'decimal':
          case 'percent':
            joiFieldSchema = Joi.number().min(0);
            break;

          case 'url':
            joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.URL);
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
      return next(new AppError(errorMessagesArray.join(' '), 400));
    }

    req.body.custom_values = value;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = configValidation;
