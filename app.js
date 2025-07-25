const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const mainRouter = require("./routes/index");
const { handleError, NotFoundError } = require("./utils/errors");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use("/", mainRouter);

app.use(errorLogger);
app.use((req, res) => {
  handleError(new NotFoundError("Page not found"), req, res);
});
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
