const express = require("express");
const app = express();
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

mongoose.connect('mongodb://localhost:27017/expressdb')