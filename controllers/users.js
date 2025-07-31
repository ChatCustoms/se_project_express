const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const { OK, CREATED } = require("../utils/statusCodes");

const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
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
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError("Incorrect email or password");
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

const getCurrentUser = (req, res, next) =>
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.status(OK).send(user);
    })
    .catch(next);

const updateUser = (req, res, next) => {
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
