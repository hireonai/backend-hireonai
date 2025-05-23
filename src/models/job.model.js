const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
    categories: {
      type: [String],
      required: false,
    },
    url: {
      type: String,
      required: [true, "Valid URL is required"],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: [true, "Company is required"],
    },
    jobPosition: {
      type: String,
      required: [true, "Job position is required"],
      trim: true,
    },
    employmentType: {
      type: String,
      required: [true, "Employment type is required"],
      trim: true,
    },
    workingLocationType: {
      type: String,
      required: [true, "Working location type is required"],
      trim: true,
    },
    workingLocation: {
      type: String,
      trim: true,
    },
    minExperience: {
      type: String,
      required: [true, "Minimal experience is required"],
    },
    salary: {
      type: String,
      required: [true, "Salary is required"],
    },
    jobDescList: {
      type: [String],
      required: [true, "Job description list is required"],
    },
    jobQualificationsList: {
      type: [String],
      required: [true, "Job qualifications are required"],
    },
  },
  {
    timestamps: true,
  }
);

jobsSchema.index({
  jobPosition: "text",
  employmentType: "text",
  categories: "text",
  minExperience: "text",
  salary: "text",
});

module.exports = mongoose.model("Jobs", jobsSchema);
