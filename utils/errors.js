const STATUS_CODES = require("./statusCodes");

const handleError = (err, req, res) => {
  console.error(err);
  if (err.name === "CastError") {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "Invalid ID format" });
  }
  if (err.name === "ValidationError") {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "Invalid data provided" });
  }
  if (err.name === "DocumentNotFoundError" || err.statusCode === STATUS_CODES.FORBIDDEN_REQUEST) {
    return res.status(STATUS_CODES.FORBIDDEN_REQUEST).send({ message: err.message || "Item not found" });
  }
  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(STATUS_CODES.CONFLICT).send({ message: "Conflict: Duplicate key error" });
  }
  if (err.statusCode === STATUS_CODES.FORBIDDEN) {
    return res.status(STATUS_CODES.FORBIDDEN).send({ message: err.message || "Forbidden" });
  }
  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error" });
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODES.FORBIDDEN_REQUEST;
    this.name = "NotFoundError";
  }
}

module.exports = {
  handleError,
  NotFoundError,
};
