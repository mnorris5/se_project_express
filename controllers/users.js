const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  CONFLICT_ERROR,
  AUTHORIZATION_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "email or password is incorrect" });
  }
  return bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res.send({ name: user.name, avatar: user.avatar, email: user.email }),
    )
    .catch((err) => {
      console.error(err);
      if (err.name === `ValidationError`) {
        return res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: "duplicate user" });
      } 
        return res
          .status(DEFAULT_ERROR)
          .send({ message: "error from createUser" });
      
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "email is required" });
  }
  if (!password) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "password is required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      // console.error(err);
      if (err.message === "Incorect email or password") {
        return res
          .status(AUTHORIZATION_ERROR)
          .send({ message: "Incorect email or password" });
      }

      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};
const getCurrentUser = (req, res) => {
  // const userId = req.user._id;
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const { _id, email, avatar, name } = user;
      res.status(200).send({
        _id,
        email,
        avatar,
        name,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }

      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  // const userId = req.user._id;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then(() => res.status(200).send({ name, avatar }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA_ERROR).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }

      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
