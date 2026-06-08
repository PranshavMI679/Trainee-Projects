const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const formSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.NAME_EMPTY,
      'any.required': ErrorMessages.VALIDATION.NAME_EMPTY,
      'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(255)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.EMAIL_REQUIRED,
      'any.required': ErrorMessages.VALIDATION.EMAIL_REQUIRED,
      'string.email': ErrorMessages.VALIDATION.EMAIL_INVALID,
      'string.max': ErrorMessages.VALIDATION.EMAIL_TOO_LONG
    }),

  custom_values: Joi.object()
    .unknown(true)
    .optional()
    .default({})
    .messages({
      'object.base': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID
    })
});

module.exports = { formSchema };
