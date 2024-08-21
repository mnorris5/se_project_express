const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");
const jwt = require("jsonwebtoken");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "email or password is incorrect" });
  }
  return bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === `ValidationError`) {
        return res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        return res
          .status(DEFAULT_ERROR)
          .send({ message: "error from createUser" });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).send({ mesage: "email is required" });
  }
  if (!password) {
    return res.status(400).send({ mesage: "password is required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: "invalid email or password" });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(INVALID_DATA_ERROR).send({ mesage: err.message });
    });
};
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: "Invalid ID" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from getUser" });
      }
    });
};
const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, avatar });

  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: "Error from getUsers" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
