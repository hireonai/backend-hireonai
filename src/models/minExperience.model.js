const mongoose = require("mongoose");

const IndustriesSchema = new mongoose.Schema(
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

IndustriesSchema.index({
  name: "text",
});

module.exports = mongoose.model("Companies", IndustriesSchema);
