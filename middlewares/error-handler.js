const { INTERNAL_SERVER_ERROR } = require("../utils/statusCodes");

const errorHandler = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? "An internal server error occurred"
        : message,
  });
};

module.exports = errorHandler;
