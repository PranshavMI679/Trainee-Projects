const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const moduleValidationSchemas = {
  createModule: Joi.object({
    client_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
        'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
      }),

    module_name: Joi.string()
      .trim()
      .max(100)
      .required()
      .messages({
        'string.base': ErrorMessages.VALIDATION.NAME_EMPTY,
        'string.empty': ErrorMessages.VALIDATION.NAME_EMPTY,
        'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG,
        'any.required': ErrorMessages.VALIDATION.NAME_EMPTY
      })
  }),

  updateModule: Joi.object({
    module_name: Joi.string()
      .trim()
      .max(100)
      .required()
      .messages({
        'string.base': ErrorMessages.VALIDATION.NAME_EMPTY,
        'string.empty': ErrorMessages.VALIDATION.NAME_EMPTY,
        'string.max': ErrorMessages.VALIDATION.NAME_TOO_LONG,
        'any.required': ErrorMessages.VALIDATION.NAME_EMPTY
      })
  }),

  validateParams: Joi.object({
    module_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.VALIDATION.UUID_INVALID,
        'any.required': ErrorMessages.VALIDATION.MODULE_CODE_REQUIRED
      })
  }),

  getModulesByClient: Joi.object({
    client_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
        'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
      })
  })
};

module.exports = moduleValidationSchemas;
