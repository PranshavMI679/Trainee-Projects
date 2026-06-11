const Joi = require('joi');
const { FormConfig, Form } = require('../models');
const AppError = require('../utils/appError');

const REGEX_PATTERNS = {
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  EMAIL_BASIC: /^[^@\s]+@[^@\s]+\.[^@\s]+$/
};

const configValidation = async (req, res, next) => {
  try {
    let { config_code } = req.params; 
    const { employee_code } = req.params;
    const { custom_values } = req.body;

    if (!config_code && employee_code) {
      const employeeRecord = await Form.findOne({ where: { employee_code } });
      if (!employeeRecord) {
        return next(new AppError("The targeted employee submission record does not exist.", 404));
      }

      const layoutTemplate = await FormConfig.findOne({ 
        where: { client_id: employeeRecord.client_id } 
      });
      
      if (layoutTemplate) {
        config_code = layoutTemplate.config_code; 
      }
    }

    if (!config_code && req.body.config_code) {
      config_code = req.body.config_code;
    }

    if (!config_code) {
      return next(new AppError("Configuration template code is required to enforce field rules.", 400));
    }

    const rules = await FormConfig.findAll({ where: { config_code } });

    if (!rules || rules.length === 0) {
      return next(new AppError("The provided form configuration layout code does not exist.", 404));
    }

    const dynamicJoiRules = {};

    for (const rule of rules) {
      let joiFieldSchema;
      const normalizedType = rule.type.toLowerCase().replace(/[^a-z0-9]/g, '');

      switch (normalizedType) {
        
        case 'singleline':
        case 'textbox': 
        case 'multiline':
          joiFieldSchema = Joi.string().trim();
          if (rule.length) {
            joiFieldSchema = joiFieldSchema.max(rule.length).messages({
              'string.max': `Custom field '${rule.label}' exceeds maximum permitted length of ${rule.length} characters.`
            });
          }
          break;

        case 'email':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.EMAIL_BASIC).messages({
            'string.pattern.base': `Custom field '${rule.label}' must be a valid structure containing an '@' and a '.' symbol.`
          });
          break;

        case 'dropdown':
        case 'radio':
        case 'radioselection':
          if (!rule.options || !Array.isArray(rule.options)) {
            return next(new AppError(`Configuration exception: Options are missing for choice list field '${rule.label}'.`, 500));
          }
          joiFieldSchema = Joi.alternatives().try(
            Joi.any().valid(...rule.options),
            Joi.array().items(Joi.any().valid(...rule.options)).min(1)
          ).messages({
            'any.only': `The selected value for '${rule.label}' is invalid. Allowed options: [${rule.options.join(', ')}].`,
            'array.base': `The selection choice for '${rule.label}' must be a string value or an array of strings.`
          });
          break;

        case 'checkbox':
          joiFieldSchema = Joi.alternatives().try(
            Joi.boolean(),
            Joi.array().items(Joi.string().trim())
          ).messages({
            'boolean.base': `Custom field '${rule.label}' must be a valid true/false flag or an option collection list.`
          });
          break;

        case 'date':
        case 'datetime':
          joiFieldSchema = Joi.date().messages({
            'date.base': `Custom field '${rule.label}' requires a valid date representation.`
          });
          break;

        case 'number':
          joiFieldSchema = Joi.number().integer().min(0).messages({
            'number.base': `Custom field '${rule.label}' must be a valid numerical value.`,
            'number.integer': `Custom field '${rule.label}' cannot possess floating decimal numbers.`,
            'number.min': `Custom field '${rule.label}' cannot contain negative signs.`
          });
          if (rule.length) {
            const maxVal = Math.pow(10, rule.length) - 1;
            joiFieldSchema = joiFieldSchema.max(maxVal).messages({
              'number.max': `Custom field '${rule.label}' exceeds the maximum allowed length of ${rule.length} digits.`
            });
          }
          break;

        case 'decimal':
          joiFieldSchema = Joi.number().min(0).messages({
            'number.base': `Custom field '${rule.label}' requires a valid decimal representation.`,
            'number.min': `Custom field '${rule.label}' cannot contain negative signs.`
          });
          if (rule.length) {
            joiFieldSchema = joiFieldSchema.precision(rule.length).messages({
              'number.precision': `Custom field '${rule.label}' cannot exceed ${rule.length} decimal places.`
            });
          }
          break;

        case 'percent':
          joiFieldSchema = Joi.number().min(0).max(100).messages({
            'number.base': `Custom field '${rule.label}' must be a valid percentage value.`,
            'number.min': `Percentage value for '${rule.label}' must be between 0 and 100.`,
            'number.max': `Percentage value for '${rule.label}' must be between 0 and 100.`
          });
          if (rule.length) {
            joiFieldSchema = joiFieldSchema.precision(rule.length).messages({
              'number.precision': `Percentage field '${rule.label}' cannot exceed ${rule.length} decimal places.`
            });
          }
          break;

        case 'currency':
          joiFieldSchema = Joi.object({
            symbol: Joi.string().trim().required().messages({
              'any.required': `Currency symbol is required for '${rule.label}'.`,
              'string.empty': `Currency symbol for '${rule.label}' cannot be left blank.`
            }),
            amount: Joi.number().min(0).required().messages({
              'any.required': `Monetary price amount is required for '${rule.label}'.`,
              'number.base': `Currency amount for '${rule.label}' must be numeric.`,
              'number.min': `Currency amount for '${rule.label}' cannot be negative.`
            })
          });
          if (rule.length) {
            joiFieldSchema = joiFieldSchema.append({
              amount: Joi.number().min(0).precision(rule.length).required().messages({
                'number.precision': `Currency amount for '${rule.label}' cannot exceed ${rule.length} decimal places.`
              })
            });
          }
          break;

        case 'phone':
          joiFieldSchema = Joi.object({
            country_code: Joi.string().trim().required().messages({
              'any.required': `Country dialing prefix code is required for '${rule.label}'.`,
              'string.empty': `Country code for '${rule.label}' cannot be left empty.`
            }),
            phone_number: Joi.number().integer().positive().required().messages({
              'any.required': `Subscriber phone line number is required for '${rule.label}'.`,
              'number.base': `Phone number value for '${rule.label}' must be exclusively comprised of whole digits.`,
              'number.positive': `Phone number value for '${rule.label}' cannot contain negative signs.`
            })
          });
          break;

        case 'url':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.URL).messages({
            'string.pattern.base': `Custom field '${rule.label}' must map to a valid web URL link destination address.`
          });
          break;

        case 'fileupload':
        case 'file':
          joiFieldSchema = Joi.any().optional();
          break;

        default:
          joiFieldSchema = Joi.any();
          break;
      }

      if (normalizedType !== 'fileupload' && normalizedType !== 'file') {
        if (rule.is_required) {
          joiFieldSchema = joiFieldSchema.required().messages({
            'any.required': `The dynamic field '${rule.label}' is marked mandatory.`,
            'string.empty': `The dynamic field '${rule.label}' cannot be left empty.`,
            'object.base': `The dynamic field '${rule.label}' must be fully populated with its component object fields.`
          });
        } else {
          joiFieldSchema = joiFieldSchema.optional().allow('', null);
        }
      }

      dynamicJoiRules[rule.key] = joiFieldSchema;
    }

    const compiledSchema = Joi.object(dynamicJoiRules).unknown(false);

    const { error, value } = compiledSchema.validate(custom_values || {}, {
      abortEarly: false,
      stripUnknown: true  
    });

    if (error) {
      const consolidatedMessages = error.details.map(d => d.message).join(' ');
      return next(new AppError(consolidatedMessages, 400));
    }

    req.body.custom_values = value;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = configValidation;
