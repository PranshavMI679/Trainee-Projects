const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const saveInterestsSchema = Joi.object({
  categoryNames: Joi.array()
    .items(Joi.string().trim().required())
    .min(1)
    .required()
    .messages({
      'array.min': ErrorMessages.VALIDATION.INTEREST_SELECTION_REQUIRED,
      'any.required': ErrorMessages.VALIDATION.INTEREST_SELECTION_REQUIRED,
      'array.base': ErrorMessages.VALIDATION.INTEREST_SELECTION_REQUIRED
    })
});

module.exports = { saveInterestsSchema };
