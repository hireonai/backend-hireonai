const mongoose = require("mongoose");

const CompanyIndustriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Industry name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CompanyIndustriesSchema.index({
  name: "text",
});

module.exports = mongoose.model("CompanyIndustries", CompanyIndustriesSchema);
