const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const singleFieldSchema = Joi.object({
  key: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9_]+$/)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.FIELD_KEY_REQUIRED,
      'any.required': ErrorMessages.VALIDATION.FIELD_KEY_REQUIRED,
      'string.pattern.base': ErrorMessages.VALIDATION.FIELD_KEY_INVALID,
      'string.max': ErrorMessages.VALIDATION.FIELD_KEY_TOO_LONG
    }),

  label: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.FIELD_LABEL_REQUIRED,
      'any.required': ErrorMessages.VALIDATION.FIELD_LABEL_REQUIRED,
      'string.max': ErrorMessages.VALIDATION.FIELD_LABEL_TOO_LONG
    }),

  type: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.FIELD_TYPE_REQUIRED,
      'any.required': ErrorMessages.VALIDATION.FIELD_TYPE_REQUIRED
    }),

  is_required: Joi.boolean()
    .default(false)
    .required()
    .messages({
      'boolean.base': ErrorMessages.VALIDATION.FIELD_REQUIRED_FLAG_INVALID,
      'any.required': ErrorMessages.VALIDATION.FIELD_REQUIRED_FLAG_INVALID
    }),

  length: Joi.number()
    .integer()
    .min(1)
    .positive()
    .allow(null)
    .optional()
    .messages({
      'number.base': ErrorMessages.VALIDATION.FIELD_LENGTH_BASE,
      'number.integer': ErrorMessages.VALIDATION.FIELD_LENGTH_INTEGER
    }),

  options: Joi.array()
    .items(Joi.string().trim().required())
    .optional()
    .allow(null)
    .messages({
      'array.base': 'Options must be a valid array list of strings.'
    })
});

const configSchema = Joi.object({
  client_name: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': ErrorMessages.VALIDATION.CLIENT_NAME_TOO_LONG
    }),

  fields: Joi.array()
    .items(singleFieldSchema)
    .min(1)
    .required()
    .messages({
      'array.base': ErrorMessages.VALIDATION.FIELD_ARRAY_BASE,
      'any.required': ErrorMessages.VALIDATION.FIELD_ARRAY_BASE,
      'array.min': ErrorMessages.VALIDATION.FIELD_ARRAY_MIN
    })
});

const editFieldSchema = Joi.object({
  key: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9_]+$/)
    .optional()
    .messages({
      'string.pattern.base': ErrorMessages.VALIDATION.FIELD_KEY_INVALID,
      'string.max': ErrorMessages.VALIDATION.FIELD_KEY_TOO_LONG
    }),

  label: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.max': ErrorMessages.VALIDATION.FIELD_LABEL_TOO_LONG
    }),

  type: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .optional(),

  is_required: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': ErrorMessages.VALIDATION.FIELD_REQUIRED_FLAG_INVALID
    }),

  length: Joi.number()
    .integer()
    .min(1)
    .positive()
    .allow(null)
    .optional()
    .messages({
      'number.base': ErrorMessages.VALIDATION.FIELD_LENGTH_BASE,
      'number.integer': ErrorMessages.VALIDATION.FIELD_LENGTH_INTEGER
    }),

  options: Joi.array()
    .items(Joi.string().trim().required())
    .optional()
    .allow(null)
}).min(1);

module.exports = { 
  configSchema,
  editFieldSchema
};
