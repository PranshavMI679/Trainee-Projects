const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const blogCommentSchema = Joi.object({
  comment_content: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': ErrorMessages.VALIDATION.COMMENT_CONTENT_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.COMMENT_CONTENT_REQUIRED
    })
});

const commentReplySchema = Joi.object({
  comment_content: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': ErrorMessages.VALIDATION.REPLY_CONTENT_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.REPLY_CONTENT_REQUIRED
    })
});

module.exports = { blogCommentSchema, commentReplySchema };
