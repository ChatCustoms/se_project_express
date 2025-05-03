const handleError = (err, req, res) => {
  console.error(err);
  if (err.name === "CastError") {
    return res.status(400).send({ message: "Invalid ID format" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: "Invalid data provided" });
  }
  if (err.name === "DocumentNotFoundError" || err.statusCode === 404) {
    return res.status(404).send({ message: err.message || "Item not found" });
  }
  if (err.statusCode === 403) {
    return res.status(403).send({ message: err.message || "Forbidden" });
  }
  return res.status(500).send({ message: "Internal Server Error" });
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}

module.exports = {
  handleError,
  NotFoundError,
  ForbiddenError
};