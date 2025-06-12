const User = require("../models/user");
const { handleError } = require("../utils/errors");
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.create({ name, avatar, email, password })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error("User not found");
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
}

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
  User.findOne({ email })
    .select("+password") // Include password in the query result
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token: token });
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
};

module.exports = { getUsers, createUser, getUser, updateUser, login };
