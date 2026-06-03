const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const createBlogSchema = Joi.object({
  category_name: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': ErrorMessages.VALIDATION.WRITE_FIELDS_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.WRITE_FIELDS_REQUIRED
    }),

  blog_title: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': ErrorMessages.VALIDATION.WRITE_FIELDS_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.WRITE_FIELDS_REQUIRED
    }),

  content: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': ErrorMessages.VALIDATION.WRITE_FIELDS_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.WRITE_FIELDS_REQUIRED
    }),

  blog_image: Joi.any().optional()
});

const editBlogSchema = Joi.object({
  category_name: Joi.string().trim().optional(),
  blog_title: Joi.string().trim().optional(),
  content: Joi.string().trim().optional(),
  blog_image: Joi.any().optional()
});

module.exports = { createBlogSchema, editBlogSchema };
