const AppError = require('../utils/appError');

const validator = (schema) => {
  return (req, res, next) => {
    const payloadToValidate = req.body || {};

    const { value, error } = schema.validate(payloadToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));

      const dynamicMainMessage = errors.map(e => e.message).join(' | ');
      
      const appError = new AppError(dynamicMainMessage, 400);
      appError.validationDetails = errors; 

      return next(appError);
    }
    
    req.body = value || {};
    next();
  };
};

module.exports = validator;
