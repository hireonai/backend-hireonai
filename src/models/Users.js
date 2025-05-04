const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const roles = require("../constants/roles");
const oauthProviders = require("../constants/oauthProviders");

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: [roles.admin, roles.seeker],
      default: roles.admin,
    },
    oauthProviders: {
      type: String,
      enum: [
        oauthProviders.google,
        oauthProviders.linkedin,
        oauthProviders.github,
        null,
      ],
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

usersSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
