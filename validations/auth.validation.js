const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .max(255)
    .required()
    .lowercase()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

    password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),

    role: Joi.string()
    .valid('user', 'admin') 
    .default('user') 
    .optional()
});

module.exports = { userSchema };