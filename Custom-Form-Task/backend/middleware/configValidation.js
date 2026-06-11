const Joi = require('joi');
const { FormConfig, Form, Client } = require('../models');
const AppError = require('../utils/appError');

const REGEX_PATTERNS = {
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  EMAIL_BASIC: /^[^@\s]+@[^@\s]+\.[^@\s]+$/
};

const configValidation = async (req, res, next) => {
  try {
    let { config_code, client_code } = req.params; 
    const { employee_code } = req.params;
    const { custom_values } = req.body;

    if (!config_code && client_code) {
      const targetClient = await Client.findOne({ where: { client_code } });
      if (!targetClient) {
        return next(new AppError("Client configuration not found.", 404));
      }

      const layoutTemplate = await FormConfig.findOne({ 
        where: { client_id: targetClient.client_id } 
      });
      
      if (layoutTemplate) {
        config_code = layoutTemplate.config_code; 
      }
    }

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
            'string.pattern.base': `Custom field '${rule.label}' must be a valid email structure containing an '@' and a '.' symbol.`
          });
          break;

        case 'dropdown':
        case 'radio':
        case 'radioselection':
        case 'checkbox':
          if (!rule.options || !Array.isArray(rule.options.value)) {
            return next(new AppError(`Configuration exception: Options values collection list is missing for field '${rule.label}'.`, 500));
          }
          
          const allowedList = rule.options.value;

          if (rule.options.is_multiple === true || rule.options.is_multiple === 'true') {
            joiFieldSchema = Joi.array().items(Joi.string().trim().valid(...allowedList)).min(1).messages({
              'any.only': `One or more selected values for '${rule.label}' are invalid. Allowed: [${allowedList.join(', ')}].`,
              'array.base': `Custom field '${rule.label}' must be an array list of string options.`
            });
          } else {
            joiFieldSchema = Joi.string().trim().valid(...allowedList).messages({
              'any.only': `The selected choice for '${rule.label}' is invalid. Allowed options: [${allowedList.join(', ')}].`,
              'string.base': `Custom field '${rule.label}' must be a single text option value.`
            });
          }
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

        case 'url':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.URL).messages({
            'string.pattern.base': `Custom field '${rule.label}' must map to a valid web URL link destination address.`
          });
          break;

        // case 'fileupload':
        // case 'file':
        //   joiFieldSchema = Joi.any().optional();
        //   break;

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
