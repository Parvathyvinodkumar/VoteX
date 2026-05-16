const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
  },

  mobile: {
    type: String,
  },

  aadhaar: {
    type: Number,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },

  isVoted: {
    type: Boolean,
    default: false,
  },

  count_locations: {
    type: Number,
    default: 0,
  },

  lastLocation: {
    latitude: Number,
    longitude: Number,
  },
});


// HASH PASSWORD
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    next();

  } catch (err) {
    next(err);
  }
});


// COMPARE PASSWORD
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// EXPORT MODEL
const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

module.exports = User;