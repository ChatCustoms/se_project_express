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

userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401; // Unauthorized
      throw error;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401; // Unauthorized
      throw error;
    }
    const sameEmail = await this.findOne({ email });
    if (sameEmail) {
      const error = new Error("Email already exists");
      error.statusCode = 409; // Conflict
      throw error;
    }
    return user;
  } catch (error) {
    if (error.statusCode) {
      throw error; // Re-throw known errors
    }
    const unknownError = new Error("An unknown error occurred");
    unknownError.statusCode = 500; // Internal Server Error
    throw unknownError;
  }
};

module.exports = mongoose.model("user", userSchema);
