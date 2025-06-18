function handleError(err, req, res) {
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  if (err.statusCode && err.message) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).send({ message: "An internal server error occurred" });
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  handleError,
  NotFoundError,
};
