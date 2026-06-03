const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const userSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': ErrorMessages.VALIDATION.NAME_EMPTY,
      'string.empty': ErrorMessages.VALIDATION.NAME_EMPTY
    }),

  email: Joi.string()
    .email()
    .max(255)
    .required()
    .lowercase()
    .messages({
      'string.email': ErrorMessages.VALIDATION.EMAIL_INVALID,
      'any.required': ErrorMessages.VALIDATION.EMAIL_INVALID,
      'string.empty': ErrorMessages.VALIDATION.EMAIL_INVALID
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': ErrorMessages.VALIDATION.PASSWORD_SHORT,
      'any.required': ErrorMessages.VALIDATION.PASSWORD_SHORT,
      'string.empty': ErrorMessages.VALIDATION.PASSWORD_SHORT
    }),

  role: Joi.string()
    .valid('user', 'admin') 
    .default('user') 
    .optional()
    .messages({
      'any.only': ErrorMessages.VALIDATION.INVALID_ROLE
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'any.required': ErrorMessages.AUTH.INVALID_CREDENTIALS,
      'string.empty': ErrorMessages.AUTH.INVALID_CREDENTIALS,
      'string.email': ErrorMessages.AUTH.INVALID_CREDENTIALS
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': ErrorMessages.AUTH.INVALID_CREDENTIALS,
      'string.empty': ErrorMessages.AUTH.INVALID_CREDENTIALS
    })
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .messages({
      'any.required': ErrorMessages.VALIDATION.EMAIL_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.EMAIL_REQUIRED,
      'string.email': ErrorMessages.VALIDATION.EMAIL_INVALID
    })
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'any.required': ErrorMessages.VALIDATION.PASSWORD_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.PASSWORD_REQUIRED,
      'string.min': ErrorMessages.VALIDATION.PASSWORD_SHORT
    }),
    
  confirmPassword: Joi.any()
    .required()
    .valid(Joi.ref('password')) 
    .messages({
      'any.required': ErrorMessages.VALIDATION.CONFIRM_PASSWORD_REQUIRED,
      'any.only': ErrorMessages.VALIDATION.PASSWORD_MISMATCH
    })
});

module.exports = { 
  userSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
};
