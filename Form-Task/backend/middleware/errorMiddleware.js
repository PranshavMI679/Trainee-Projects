const ErrorMessages = require('../utils/errorMessages');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let responseMessage = err.message;

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    err.statusCode = 400;
    responseMessage = err.errors.map(e => e.message).join(' ');
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    err.statusCode = 400;
    responseMessage = ErrorMessages.CLIENT.NOT_FOUND;
  } else if (err.statusCode === 500) {
    console.error("PGADMIN / SEQUELIZE CRITICAL ERROR:", err.stack);
    responseMessage = ErrorMessages.SERVER.INTERNAL;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: responseMessage,
    ...(process.env.NODE_ENV === 'development' && { 
      internalDetails: err.message, 
      stack: err.stack 
    })
  });
};
