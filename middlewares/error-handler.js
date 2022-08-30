const { ERROR_SERVER, ERRMSG_SERVER } = require('../utils/constants');

// Обработка ошибок

module.exports.errorHandler = (err, req, res, next) => {
  console.log(`Error ${err.statusCode} - ${err.message}`);

  const {
    statusCode = ERROR_SERVER,
    message,
  } = err;

  const errorMessage = (statusCode === ERROR_SERVER)
    ? ERRMSG_SERVER : message;

  res.status(statusCode).send({ message: errorMessage });
  next();
};
