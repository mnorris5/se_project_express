const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  CONFLICT_ERROR,
  AUTHORIZATION_ERROR,
} = require("../utils/errors");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../utils/config")

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "email or password is incorrect" });
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
      } else if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: "duplicate user" });
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
    return res.status(400).send({ message: "email is required" });
  }
  if (!password) {
    return res.status(400).send({ message: "password is required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        // should be auth error
        return res.status(401).send({ message: "invalid email or password" });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      // should be auth error
      return res.status(AUTHORIZATION_ERROR).send({ message: err.message });
    });
};
const getCurrentUser = (req, res) => {
  // const userId = req.user._id;
  User.findById(req.user._id)
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
}
// const getCurrentUser = (req, res) => {
//   // const userId = req.user._id;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND_ERROR).send({ message: err.message });
//       } else if (err.name === "CastError") {
//         res.status(INVALID_DATA_ERROR).send({ message: "Invalid ID" });
//       } else {
//         res.status(DEFAULT_ERROR).send({ message: "Error from getUser" });
//       }
//     });
// };

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  // const userId = req.user._id;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
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
}

module.exports = { createUser, login, getCurrentUser, updateUser };
