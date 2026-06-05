const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const clientSchema = Joi.object({
  client_name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.base': ErrorMessages.CLIENT.NAME_REQUIRED,
      'string.empty': ErrorMessages.CLIENT.NAME_REQUIRED,
      'string.max': ErrorMessages.VALIDATION.CLIENT_NAME_TOO_LONG,
      'any.required': ErrorMessages.CLIENT.NAME_REQUIRED
    }),

  show_EmployeeID: Joi.boolean()
    .default(false) 
    .messages({
      'boolean.base': ErrorMessages.VALIDATION.SHOW_EMPLOYEE_ID_INVALID
    }),

  show_Middlename: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': ErrorMessages.VALIDATION.SHOW_MIDDLE_NAME_INVALID
    })
});

module.exports = { clientSchema };
