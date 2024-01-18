const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to db", r);
});
app.listen(PORT, () => {
  console.log("App listening at the port ${PORT}");
  console.log("this is working");
});
