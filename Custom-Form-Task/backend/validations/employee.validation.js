const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const employeeValidationSchemas = {
  createEmployee: Joi.object({
    client_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
        'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
      })
  }),

  validateParams: Joi.object({
    employee_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.FORM.INVALID_UUID,
        'any.required': ErrorMessages.FORM.CODE_REQUIRED
      })
  }),

  getEmployeesByClient: Joi.object({
    client_code: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': ErrorMessages.CLIENT.INVALID_UUID,
        'any.required': ErrorMessages.CLIENT.CODE_REQUIRED
      })
  })
};

module.exports = employeeValidationSchemas;
