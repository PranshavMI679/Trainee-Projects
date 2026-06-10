const Joi = require('joi');
const { FormConfig, Form } = require('../models');
const AppError = require('../utils/appError');

const REGEX_PATTERNS = {
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  PHONE: /^\+?[1-9]\d{1,14}$/
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
          joiFieldSchema = Joi.string().trim().email().messages({
            'string.email': `Custom field '${rule.label}' must be a valid email address.`
          });
          break;

        case 'dropdown':
        case 'radio':
        case 'radioselection':
          if (!rule.options || !Array.isArray(rule.options)) {
            return next(new AppError(`Configuration exception: Options are missing for choice list field '${rule.label}'.`, 500));
          }
          joiFieldSchema = Joi.any().valid(...rule.options).messages({
            'any.only': `The selected value for '${rule.label}' is invalid. Allowed options: [${rule.options.join(', ')}].`
          });
          break;

        case 'checkbox':
          joiFieldSchema = Joi.boolean().messages({
            'boolean.base': `Custom field '${rule.label}' must be a boolean (true/false) checkbox flag value.`
          });
          break;

        case 'date':
          joiFieldSchema = Joi.date().iso().messages({
            'date.format': `Custom field '${rule.label}' requires a standard calendar date format (YYYY-MM-DD).`
          });
          break;

        case 'datetime':
          joiFieldSchema = Joi.date().iso().messages({
            'date.base': `Custom field '${rule.label}' requires an exact ISO date-time tracker location timestamp.`
          });
          break;

        case 'number':
          joiFieldSchema = Joi.number().integer().messages({
            'number.base': `Custom field '${rule.label}' must be a valid numerical value.`,
            'number.integer': `Custom field '${rule.label}' cannot possess floating decimal numbers.`
          });
          break;

        case 'decimal':
        case 'percent':
        case 'currency':
          joiFieldSchema = Joi.number().messages({
            'number.base': `Custom field '${rule.label}' requires a valid numerical representation.`
          });
          break;

        case 'phone':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.PHONE).messages({
            'string.pattern.base': `Custom field '${rule.label}' must match an operational international telecommunication phone number structure.`
          });
          break;

        case 'url':
        case 'fileupload':
        case 'file':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.URL).messages({
            'string.pattern.base': `Custom field '${rule.label}' must map to a valid web URL link destination address.`
          });
          break;

        default:
          joiFieldSchema = Joi.any();
          break;
      }

      if (rule.is_required) {
        joiFieldSchema = joiFieldSchema.required().messages({
          'any.required': `The dynamic field '${rule.label}' is marked mandatory.`,
          'string.empty': `The dynamic field '${rule.label}' cannot be left empty.`
        });
      } else {
        joiFieldSchema = joiFieldSchema.optional().allow('', null);
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
