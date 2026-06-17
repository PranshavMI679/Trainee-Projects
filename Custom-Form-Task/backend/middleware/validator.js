const AppError = require('../utils/appError');

const validator = (schema) => {
  return (req, res, next) => {
    if (!schema || typeof schema.validate !== 'function') {
      return next();
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false, 
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(' ');
      return next(new AppError(errorMessages, 400));
    }

    req.body = value;
    return next();
  };
};

module.exports = validator;

/*
const AppError = require('../utils/appError');

const validator = (schema) => {
  return (req, res, next) => {
    try {
      if (!schema || typeof schema.validate !== 'function') {
        return next();
      }

      const { error, value } = schema.validate(req.body, {
        abortEarly: false, 
        stripUnknown: true
      });

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message).join(' ');
        
        return res.status(400).json({
          success: false,
          message: errorMessages
        });
      }

      req.body = value;
      return next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "An internal parsing error occurred during request body validation."
      });
    }
  };
};

module.exports = validator;
*/
