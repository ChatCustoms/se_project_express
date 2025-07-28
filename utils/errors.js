const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN_REQUEST,
  NOT_FOUND,
} = require("./statusCodes");

function handleError(err, req, res) {
  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST).send({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  if (err.statusCode && err.message) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  console.error("Unhandled Error:", err);
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An internal server error occurred" });
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = {
  handleError,
  NotFoundError,
};
