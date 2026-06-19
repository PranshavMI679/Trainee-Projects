const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const REGEX_PATTERNS = {
  EMAIL_BASIC: /^[^@\s]+@[^@\s]+\.[^@\s]+$/
};

const formSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional() 
    .messages({
      'string.empty': ErrorMessages.VALIDATION.NAME_EMPTY,
      'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG
    }),

  email: Joi.string()
    .trim()
    .regex(REGEX_PATTERNS.EMAIL_BASIC)
    .max(255)
    .optional() 
    .messages({
      'string.empty': ErrorMessages.VALIDATION.EMAIL_REQUIRED,
      'string.pattern.base': ErrorMessages.VALIDATION.EMAIL_INVALID,
      'string.max': ErrorMessages.VALIDATION.EMAIL_TOO_LONG
    }),

    custom_values: Joi.any().optional().default({})
  // custom_values: Joi.object()
  //   .unknown(true)
  //   .optional()
  //   .default({})
  //   .messages({
  //     'object.base': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID
  //   })
});

module.exports = { formSchema };
