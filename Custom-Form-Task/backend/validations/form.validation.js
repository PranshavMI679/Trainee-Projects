const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const formSchema = Joi.object({
  client_code: Joi.string()
    .trim()
    .guid({ version: ['uuidv4'] })
    .optional() 
    .messages({
      'string.guid': ErrorMessages.CLIENT.INVALID_UUID
    }),

  module_code: Joi.string()
    .trim()
    .guid({ version: ['uuidv4'] })
    .optional() 
    .messages({
      'string.guid': 'Invalid dynamic module reference code format.'
    }),

  custom_values: Joi.object()
    .unknown(true)
    .required() 
    .messages({
      'object.base': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID,
      'any.required': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID
    })
});

module.exports = { formSchema };
