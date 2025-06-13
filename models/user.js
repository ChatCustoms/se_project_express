const mongoose = require("mongoose");
const validator = require("validator");

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

userSchema.statics.findUserByCredentials = function(email, password) {
  return this.findOne({ email })
    .select("+password") // Include password in the query
    .then((user) => {
      if (!user) {
        throw new Error("Invalid email or password");
      }
      // Here you would typically compare the password with a hashed version
      // For simplicity, we assume the password is stored in plain text
      if (user.password !== password) {
        throw new Error("Invalid email or password");
      }
      return user;
    });
}

module.exports = mongoose.model("user", userSchema);
