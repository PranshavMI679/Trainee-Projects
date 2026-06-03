const Joi = require('joi');
const ErrorMessages = require('../utils/errorMessages');

const ALLOWED_REACTIONS = ['heart', 'thumbs_up', 'smile', 'clap', 'party'];

const reactionSchema = Joi.object({
  reaction_type: Joi.string()
    .trim()
    .required()
    .valid(...ALLOWED_REACTIONS)
    .messages({
      'any.required': ErrorMessages.VALIDATION.REACTION_TYPE_REQUIRED,
      'string.empty': ErrorMessages.VALIDATION.REACTION_TYPE_REQUIRED,
      'any.only': `${ErrorMessages.STATE.INVALID_REACTION_TYPE}${ALLOWED_REACTIONS.join(', ')}.`
    })
});

module.exports = { reactionSchema };
