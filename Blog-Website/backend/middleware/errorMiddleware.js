const ErrorMessages = require('../utils/errorMessages');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let responseMessage = err.message;

  if (err.statusCode === 500) {
    console.error("PGADMIN / SEQUELIZE CRITICAL ERROR:", err.stack);
    responseMessage = ErrorMessages.SERVER.INTERNAL;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: responseMessage,
    ...(err.validationDetails && { errors: err.validationDetails }),
    ...(process.env.NODE_ENV === 'development' && { 
      internalDetails: err.message, 
      stack: err.stack 
    })
  });
};
