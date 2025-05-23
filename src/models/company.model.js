const mongoose = require("mongoose");

const CompaniesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Company description is required"],
      trim: true,
    },
    profileSrc: {
      type: String,
      required: [true, "Company profile is required"],
    },
    location: {
      type: String,
      required: [true, "Company location is required"],
      trim: true,
    },
    industriId: {
      type: Schema.Types.ObjectId,
      ref: "CompanyIndustries",
      required: [true, "Company industry is required"],
    },
  },
  {
    timestamps: true,
  }
);

CompaniesSchema.index({
  name: "text",
  description: "text",
  location: "text",
});

module.exports = mongoose.model("Companies", CompaniesSchema);
