const mongoose = require("mongoose");

const JobCategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Job category is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

JobCategoriesSchema.index({
  name: "text",
});

module.exports = mongoose.model("CompanyIndustries", JobCategoriesSchema);
