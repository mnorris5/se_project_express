const { hash } = require("bcrypt");
const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    res.status(11000).send({ message: "duplicate key" });
    return;
  }
  bcrypt
    .hash(req.body.password)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === `ValidationError`) {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "error from createUser" });
      }
    });
};
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: "Invalid ID" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from getUser" });
      }
    });
};
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: "Error from getUsers" });
    });
};

module.exports = { createUser, getUser, getUsers };
