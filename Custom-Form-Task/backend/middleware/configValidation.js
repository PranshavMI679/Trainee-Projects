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
      if (!targetClient) {
        return next(new AppError("Client configuration not found.", 404));
      }

      const layoutTemplates = await FormConfig.findAll({ 
        where: { client_id: targetClient.client_id } 
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

    if (!config_code && employee_code) {
      const employeeRecord = await Form.findOne({ where: { employee_code } });
      if (!employeeRecord) {
        return next(new AppError("The targeted employee submission record does not exist.", 404));
      }

      const layoutTemplates = await FormConfig.findAll({ 
        where: { client_id: employeeRecord.client_id } 
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

    if (!config_code && req.body.config_code) {
      config_code = req.body.config_code;
    }

    if (!config_code) {
      return next(new AppError("Configuration template code is required to enforce field rules.", 400));
    }

    const allRules = await FormConfig.findAll({ where: { config_code } });

    const rules = [];
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
      
      const isDeleted = currentOpts.is_deleted_field === true || 
                        currentOpts.is_deleted_field === 'true' ||
                        currentOpts.is_delete === true || 
                        currentOpts.is_delete === 'true';

      if (!isDeleted) {
        rules.push(currentRule);
      }
    }

    if (rules.length === 0) {
      return next(new AppError("The provided form configuration layout code does not exist or has no active fields.", 404));
    }

    const dynamicJoiRules = {};

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
            'string.pattern.base': `Custom field '${rule.label}' must be a valid email structure containing an '@' and a '.' symbol.`
          });
          break;

        case 'dropdown':
        case 'radio':
        case 'radioselection':
        case 'checkbox':
          if (!parsedOptions || !Array.isArray(parsedOptions.value)) {
            return next(new AppError(`Configuration exception: Options values collection list is missing for field '${rule.label}'.`, 500));
          }
          
          const allowedList = parsedOptions.value;

          if (parsedOptions.is_multiple === true || parsedOptions.is_multiple === 'true') {
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
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.EXACT_DATE).messages({
            'string.pattern.base': `Custom field '${rule.label}' layout error. Must be a valid date formatted strictly as yyyy-mm-dd (mm: 01-12, dd: 01-31).`
          });
          break;

        case 'datetime':
          joiFieldSchema = Joi.string().trim().regex(REGEX_PATTERNS.EXACT_DATETIME).messages({
            'string.pattern.base': `Custom field '${rule.label}' layout error. Must be a valid date/time formatted strictly as yyyy-mm-dd hh:mm:ss (hh: 00-24, mm/ss: 00-59).`
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
    const errorMessagesArray = [];
    for (let j = 0; j < error.details.length; j++) {
      errorMessagesArray.push(error.details[j].message);
    }
    const consolidatedMessages = errorMessagesArray.join(' ');
    return next(new AppError(consolidatedMessages, 400));
  }

  req.body.custom_values = value;
  next();
} catch (error) {
  next(error);
}
};

module.exports = configValidation;
