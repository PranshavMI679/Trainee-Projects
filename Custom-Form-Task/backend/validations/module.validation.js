const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const moduleCreateSchema = Joi.object({
  client_code: Joi.string()
    .trim()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.empty': ErrorMessages.CLIENT.CODE_REQUIRED,
      'any.required': ErrorMessages.CLIENT.CODE_REQUIRED,
      'string.guid': ErrorMessages.CLIENT.INVALID_UUID
    }),

  module_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.NAME_EMPTY,
      'any.required': ErrorMessages.VALIDATION.NAME_EMPTY,
      'string.min': ErrorMessages.VALIDATION.NAME_EMPTY, 
      'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG
    })
});

const moduleUpdateSchema = Joi.object({
  module_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.NAME_EMPTY,
      'any.required': ErrorMessages.VALIDATION.NAME_EMPTY,
      'string.min': ErrorMessages.VALIDATION.NAME_EMPTY,
      'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG
    })
});

module.exports = {
  moduleCreateSchema,
  moduleUpdateSchema
};
