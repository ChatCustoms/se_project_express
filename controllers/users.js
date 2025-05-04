const User = require("../models/user");
const { handleError } = require("../utils/errors");

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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
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

module.exports = { getUsers, createUser, getUser };
