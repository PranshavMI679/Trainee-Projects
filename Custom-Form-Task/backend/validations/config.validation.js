const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const VALID_TYPES = [
  'singleline', 'Single Line',
  'textbox', 'Textbox',
  'multiline', 'Multi-Line',
  'email', 'Email',
  'dropdown', 'Dropdown',
  'checkbox', 'Checkbox',
  'radio', 'Radio',
  'radioselection', 'Radio Selection',
  'date', 'Date',
  'datetime', 'Date/Time',
  'number', 'Number',
  'decimal', 'Decimal',
  'percent', 'Percent',
  'currency', 'Currency',
  'phone', 'Phone',
  'url', 'URL',
  'fileupload', 'File Upload',
  'file', 'File'
];

const optionsSchema = Joi.object({
  is_multiple: Joi.boolean().required().messages({
    'any.required': 'The is_multiple selection parameter flag is required.'
  }),
  value: Joi.array().items(Joi.string().trim().required()).min(1).optional().messages({
    'array.min': 'The options value configuration list requires at least one option item entry.'
  }),
  thousand_separator: Joi.string().trim().allow(',', '.', ' ', '').optional(),
  decimal_separator: Joi.string().trim().allow(',', '.', '').optional(),
});

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
    .valid(...VALID_TYPES)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.FIELD_TYPE_REQUIRED,
      'any.required': ErrorMessages.VALIDATION.FIELD_TYPE_REQUIRED,
      'any.only': 'Requested field type must match one of the approved UI datatypes.'
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

  options: optionsSchema
    .allow(null)
    .optional()
    .when('type', {
      is: Joi.string().valid('dropdown', 'Dropdown', 'radio', 'Radio', 'radioselection', 'Radio Selection', 'checkbox', 'Checkbox'),
      then: Joi.object({
        is_multiple: Joi.boolean().required(),
        value: Joi.array().items(Joi.string().trim().required()).min(1).required()
      }).required().messages({
        'any.required': 'Choice selectors Dropdown, Radio, and Checkbox require a populated options configurations object block containing a value list.'
      }),
      otherwise: Joi.object().optional()
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
    .valid(...VALID_TYPES)
    .optional()
    .messages({
      'any.only': 'Requested field type must match one of the approved UI datatypes.'
    }),

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

  options: optionsSchema
    .allow(null)
    .optional()
    .when('type', {
      is: Joi.string().valid('dropdown', 'Dropdown', 'radioselection', 'Radio Selection', 'radio', 'Radio', 'checkbox', 'Checkbox'),
      then: Joi.object({
        is_multiple: Joi.boolean().required(),
        value: Joi.array().items(Joi.string().trim().required()).min(1).required()
      }).required(),
      otherwise: Joi.object().optional()
    })
}).min(1);

module.exports = { 
  configSchema,
  editFieldSchema
};
