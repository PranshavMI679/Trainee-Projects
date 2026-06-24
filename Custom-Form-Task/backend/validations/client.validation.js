const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const clientValidationSchemas = {
  createClient: Joi.object({
    client_name: Joi.string()
      .trim()
      .max(100)
      .required()
      .messages({
        'string.base': ErrorMessages.CLIENT.NAME_REQUIRED,
        'string.empty': ErrorMessages.CLIENT.NAME_REQUIRED,
        'string.max': ErrorMessages.VALIDATION.CLIENT_NAME_TOO_LONG,
        'any.required': ErrorMessages.CLIENT.NAME_REQUIRED
      })
  }),

  updateClient: Joi.object({
    client_name: Joi.string()
      .trim()
      .max(100)
      .required()
      .messages({
        'string.base': ErrorMessages.CLIENT.NAME_REQUIRED,
        'string.empty': ErrorMessages.CLIENT.NAME_REQUIRED,
        'string.max': ErrorMessages.VALIDATION.CLIENT_NAME_TOO_LONG,
        'any.required': ErrorMessages.CLIENT.NAME_REQUIRED
      })
  }),

  validateParams: Joi.object({
    client_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
        'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
      })
  })
};

module.exports = clientValidationSchemas;
