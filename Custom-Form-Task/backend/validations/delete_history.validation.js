const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const deleteHistoryValidationSchemas = {
  logDeletion: Joi.object({
    client_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
        'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
      }),

    config_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .allow(null, '')
      .optional()
      .messages({
        'string.guid': ErrorMessages.VALIDATION.UUID_INVALID
      }),

    module_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .allow(null, '')
      .optional()
      .messages({
        'string.guid': ErrorMessages.VALIDATION.UUID_INVALID
      }),

    key: Joi.string()
      .trim()
      .max(100)
      .required()
      .messages({
        'string.base': ErrorMessages.VALIDATION.FIELD_KEY_REQUIRED,
        'string.empty': ErrorMessages.VALIDATION.FIELD_KEY_REQUIRED,
        'string.max': ErrorMessages.VALIDATION.FIELD_KEY_TOO_LONG,
        'any.required': ErrorMessages.VALIDATION.FIELD_KEY_REQUIRED
      }),

    archived_meta: Joi.object()
      .required()
      .messages({
        'object.base': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID,
        'any.required': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID
      }),

    archived_options: Joi.object()
      .allow(null)
      .optional()
      .messages({
        'object.base': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID
      }),

    action_type: Joi.string()
      .trim()
      .max(50)
      .required()
      .messages({
        'string.base': ErrorMessages.VALIDATION.NAME_EMPTY,
        'string.empty': ErrorMessages.VALIDATION.NAME_EMPTY,
        'any.required': ErrorMessages.VALIDATION.NAME_EMPTY
      })
  }),

  getLogsByContext: Joi.object({
    client_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
        'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
      }),
    module_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .optional()
      .messages({
        'string.guid': ErrorMessages.VALIDATION.UUID_INVALID
      })
  })
};

module.exports = deleteHistoryValidationSchemas;
