const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const formSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .max(50)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.FIRST_NAME_EMPTY,
      'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG,
      'any.required': ErrorMessages.VALIDATION.FIRST_NAME_EMPTY
    }),

  middle_name: Joi.string()
    .trim()
    .max(50)
    .allow(null, '')
    .default(null)
    .messages({
      'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG
    }),

  last_name: Joi.string()
    .trim()
    .max(50)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.LAST_NAME_EMPTY,
      'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG,
      'any.required': ErrorMessages.VALIDATION.LAST_NAME_EMPTY
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'Other')
    .required()
    .messages({
      'any.only': ErrorMessages.VALIDATION.GENDER_INVALID,
      'any.required': ErrorMessages.VALIDATION.GENDER_REQUIRED
    }),

  phone: Joi.string()
    .trim()
    .max(20)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.PHONE_EMPTY,
      'string.max': ErrorMessages.VALIDATION.PHONE_TOO_LONG,
      'any.required': ErrorMessages.VALIDATION.PHONE_EMPTY
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(255)
    .required()
    .messages({
      'string.email': ErrorMessages.VALIDATION.EMAIL_INVALID,
      'string.empty': ErrorMessages.VALIDATION.EMAIL_REQUIRED,
      'string.max': ErrorMessages.VALIDATION.EMAIL_TOO_LONG,
      'any.required': ErrorMessages.VALIDATION.EMAIL_REQUIRED
    })
});

module.exports = { formSchema };
