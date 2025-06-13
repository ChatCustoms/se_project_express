const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { handleError, NotFoundError } = require("./utils/errors");
const cors = require("cors");

const app = express();

const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);
app.use((req, res) => {
  handleError(new NotFoundError("Page not found"), req, res);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
