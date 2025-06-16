const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { handleError } = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

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
  const hashedPassword = bcrypt.hashSync(password, 10);

  User.create({ name, avatar, email, password: hashedPassword })
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(409).send({ message: "Email already exists" });
      }
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      console.error("Create user error:", error);
      handleError(error, req, res);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Incorrect email or password" });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res
            .status(401)
            .send({ message: "Incorrect email or password" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        const userObj = user.toObject();
        delete userObj.password;
        res.send({ token, ...userObj });
      });
    })
    .catch((err) => {
      console.error("Login error:", err);
      handleError(err, req, res);
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

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      if (error.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID format" });
      }
      handleError(error, req, res);
    });
};

module.exports = {
  getUsers,
  createUser,
  login,
  getUser,
  getCurrentUser,
  updateUser,
};
