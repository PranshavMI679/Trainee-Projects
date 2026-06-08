const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const clientSchema = Joi.object({
  client_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': ErrorMessages.CLIENT.NAME_REQUIRED,
      'any.required': ErrorMessages.CLIENT.NAME_REQUIRED,
      'string.max': ErrorMessages.VALIDATION.CLIENT_NAME_TOO_LONG
    })
});

module.exports = { clientSchema };
