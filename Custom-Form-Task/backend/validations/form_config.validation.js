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

const createBaseOptionsSchema = () => Joi.object({
  is_multiple: Joi.boolean().optional(),
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
    .strict() 
    .integer()
    .min(1)
    .positive()
    .allow(null)
    .optional()
    .messages({
      'number.base': ErrorMessages.VALIDATION.FIELD_LENGTH_BASE,
      'number.integer': ErrorMessages.VALIDATION.FIELD_LENGTH_INTEGER
    }),

  options: createBaseOptionsSchema()
    .allow(null)
    .optional()
    .when('type', {
      is: Joi.string().valid('dropdown', 'Dropdown', 'radio', 'Radio', 'radioselection', 'Radio Selection', 'checkbox', 'Checkbox'),
      then: Joi.object({
        is_multiple: Joi.boolean().required().messages({
          'any.required': 'The is_multiple selection parameter flag is required.'
        }),
        value: Joi.array().items(Joi.string().trim().required()).min(1).required().messages({
          'any.required': 'Choice selectors require a populated options list.'
        })
      }).required().messages({
        'any.required': 'Choice selectors Dropdown, Radio, and Checkbox require an options configuration object.'
      }),
      otherwise: Joi.object().optional()
    }),

  section_name: Joi.string().trim().max(100).optional(),
  section_order: Joi.number().strict().integer().min(1).optional(),
  area_name: Joi.string().trim().max(100).optional(),
  area_order: Joi.number().strict().integer().min(1).optional(),
  field_order: Joi.number().strict().integer().min(1).optional()
});

const configSchema = Joi.object({
  client_code: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
      'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
    }),

  module_code: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': ErrorMessages.VALIDATION.UUID_INVALID,
      'any.required': ErrorMessages.VALIDATION.MODULE_CODE_REQUIRED
    }),

  config_name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': ErrorMessages.VALIDATION.CONFIG_NAME_REQUIRED,
      'any.required': ErrorMessages.VALIDATION.CONFIG_NAME_REQUIRED,
      'string.max': ErrorMessages.VALIDATION.CLIENT_NAME_TOO_LONG
    }),

  fields: Joi.array()
    .items(singleFieldSchema)
    .min(1)
    .unique('key')
    .required()
    .messages({
      'array.base': ErrorMessages.VALIDATION.FIELD_ARRAY_BASE,
      'any.required': ErrorMessages.VALIDATION.FIELD_ARRAY_BASE,
      'array.min': ErrorMessages.VALIDATION.FIELD_ARRAY_MIN,
      'array.unique': 'Duplicate field key values are explicitly prohibited within the configuration array.'
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
    .strict()
    .integer()
    .min(1)
    .positive()
    .allow(null)
    .optional()
    .messages({
      'number.base': ErrorMessages.VALIDATION.FIELD_LENGTH_BASE,
      'number.integer': ErrorMessages.VALIDATION.FIELD_LENGTH_INTEGER
    }),

  options: createBaseOptionsSchema()
    .allow(null)
    .optional()
    .when('type', {
      is: Joi.string().valid('dropdown', 'Dropdown', 'radioselection', 'Radio Selection', 'radio', 'Radio', 'checkbox', 'Checkbox'),
      then: Joi.object({
        is_multiple: Joi.boolean().required(),
        value: Joi.array().items(Joi.string().trim().required()).min(1).required()
      }).required(),
      otherwise: Joi.object().optional()
    }),

  is_delete: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false')).optional(),

  section_name: Joi.string().trim().max(100).optional(),
  section_order: Joi.number().strict().integer().min(1).optional(),
  area_name: Joi.string().trim().max(100).optional(),
  area_order: Joi.number().strict().integer().min(1).optional(),
  field_order: Joi.number().strict().integer().min(1).optional()
}).min(1);

const structuralFieldSchema = Joi.object({
  key: Joi.string()
    .trim()
    .regex(/^[a-z0-9_]+$/)
    .required()
    .messages({
      'any.required': 'Field identifier key is required to alter positions.'
    }),
  section_name: Joi.string().trim().max(100).optional(),
  section_order: Joi.number().strict().integer().min(1).optional(), 
  area_name: Joi.string().trim().max(100).optional(),
  area_order: Joi.number().strict().integer().min(1).optional(), 
  field_order: Joi.number().strict().integer().min(1).optional()    
});

const layoutReorderSchema = Joi.object({
  fields: Joi.array()
    .items(structuralFieldSchema)
    .min(1)
    .unique('key') 
    .required()
    .messages({
      'array.base': 'Reordering data payload must be passed within an array list block.',
      'array.min': 'Provide at least one component coordinate set to execute changes.',
      'array.unique': 'Each field key layout configuration identifier can only exist once inside the reordering shifts.'
    })
});

const validateParams = Joi.object({
  config_code: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
      'any.required': ErrorMessages.VALIDATION.CONFIG_CODE_REQUIRED
    })
});

module.exports = { 
  configSchema,
  editFieldSchema,
  layoutReorderSchema,
  validateParams
};
