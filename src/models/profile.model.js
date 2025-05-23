const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required"],
    },
    fullname: {
      type: String,
      trim: true,
      required: [true, "Fullname is required"],
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    domicile: {
      type: String,
      trim: true,
      default: null,
    },
    lastEducation: {
      type: String,
      trim: true,
      default: null,
    },
    photoUrl: {
      type: String,
      trim: true,
      default: null,
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: null,
    },
    cvUrl: {
      type: String,
      trim: true,
      default: null,
    },
    tagPreferences: {
      type: Array,
      default: [],
    },
    bookmarkJobs: {
      type: [Schema.Types.ObjectId],
      ref: "Jobs",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profiles", profileSchema);
