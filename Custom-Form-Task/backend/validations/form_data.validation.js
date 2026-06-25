const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const formDataValidationSchemas = {
  createSubmission: Joi.object({    
    employee_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .optional() 
      .allow('', null)
      .messages({
        'string.guid': ErrorMessages.FORM.INVALID_UUID
      }),

    custom_values: Joi.object()
      .unknown(true) 
      .required()
      .messages({
        'object.base': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID,
        'any.required': ErrorMessages.VALIDATION.CUSTOM_VALUES_INVALID
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
  }),

  validateQuery: Joi.object({
    client_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
        'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
      })
  })
};

module.exports = formDataValidationSchemas;
