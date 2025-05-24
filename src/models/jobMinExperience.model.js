const mongoose = require("mongoose");

const JobMinExperiencesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Job min experience is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

JobMinExperiencesSchema.index({
  name: "text",
});

module.exports = mongoose.model("JobMinExperiences", JobMinExperiencesSchema);
