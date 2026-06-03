const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const categoryItemSchema = Joi.object({
  name: Joi.string().trim().optional(),
  category_name: Joi.string().trim().optional()
}).xor('name', 'category_name')
  .messages({
    'object.missingFields': ErrorMessages.VALIDATION.CATEGORY_INPUT_REQUIRED,
    'object.xor': ErrorMessages.VALIDATION.CATEGORY_INPUT_REQUIRED
  });

const categorySchema = Joi.alternatives().try(
  categoryItemSchema,
  Joi.object({
    categories: Joi.array().items(categoryItemSchema).min(1).required()
  })
).messages({
  'alternatives.types': ErrorMessages.VALIDATION.CATEGORY_INPUT_REQUIRED,
  'any.required': ErrorMessages.VALIDATION.CATEGORY_INPUT_REQUIRED
});

module.exports = { categorySchema };
