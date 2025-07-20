const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { handleError } = require("../utils/errors");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors/customErrors");
const { OK, CREATED } = require("../utils/statusCodes");

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  return User.create({ name, avatar, email, password: hashedPassword })
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return res.status(CREATED).send(userWithoutPassword);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      if (error.name === "ValidationError") {
        return next(new BadRequestError(error.message));
      }
      console.error("Create user error:", error);
      return handleError(error, req, res);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res
            .status(UNAUTHORIZED)
            .send({ message: "Incorrect email or password" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        const userObj = user.toObject();
        delete userObj.password;
        return res.send({ token, ...userObj });
      });
    })
    .catch(next);
};

const getCurrentUser = (req, res) =>
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(FORBIDDEN_REQUEST)
          .send({ message: "User not found" });
      }
      return res.status(OK).send(user);
    })
    .catch(next);

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError(error.message));
      }
      if (error.name === "CastError") {
        return next(new NotFoundError("User not found"));
      }
      return next(error);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
