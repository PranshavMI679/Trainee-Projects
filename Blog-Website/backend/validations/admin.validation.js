const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const recheckSchema = Joi.object({
  feedback_content: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': ErrorMessages.VALIDATION.FEEDBACK_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.FEEDBACK_REQUIRED
    })
});

module.exports = { recheckSchema };
