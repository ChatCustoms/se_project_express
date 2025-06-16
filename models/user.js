const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Exclude password from queries by default
    minlength: 8,
  },
});

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret._id = ret._id.toString(); // Convert ObjectId to string
    delete ret.password; // Exclude password from the response
    return ret;
  },
});

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 401;
    res.status(status).send({ message: err.message || "Unauthorized" });
  }
};

module.exports = mongoose.model("user", userSchema);
