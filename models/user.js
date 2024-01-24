const mongoose = require("mongoose");
const validator = "require";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Link is not Valid ",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
