const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const { logger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const { NotFoundError } = require("./utils/errors/NotFoundError");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);

app.use((req, res, next) => {
  next(new NotFoundError("Resource not found"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch(logger.error("Failed to connect to MongoDB:"));

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
