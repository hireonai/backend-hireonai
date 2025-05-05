const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    domicile: {
      type: String,
      trim: true,
    },
    lastEducation: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    cvUrl: {
      type: String,
      trim: true,
    },
    tagPreferences: {
      type: Array,
    },
    bookmarkJobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Jobs",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profiles", profileSchema);
