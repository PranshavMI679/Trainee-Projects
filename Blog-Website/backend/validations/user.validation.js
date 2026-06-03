const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const updateUserProfileSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Name cannot exceed 100 characters'
    }),

  email: Joi.string()
    .email()
    .max(255)
    .lowercase()
    .optional()
    .messages({
      'string.email': ErrorMessages.VALIDATION.EMAIL_INVALID
    }),

  oldPassword: Joi.string()
    .optional(),

  newPassword: Joi.string()
    .min(8)
    .optional()
    .messages({
      'string.min': ErrorMessages.VALIDATION.PASSWORD_SHORT
    }),

  role: Joi.string()
    .valid('user', 'admin')
    .optional()
    .messages({
      'any.only': ErrorMessages.VALIDATION.INVALID_ROLE
    })
}).and('newPassword', 'oldPassword')
  .messages({
    'object.and': ErrorMessages.VALIDATION.PASSWORD_REQUIRED
  });

module.exports = { updateUserProfileSchema };
