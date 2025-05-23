const mongoose = require("mongoose");

const analysisResultsSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required"],
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Jobs",
      required: [true, "Job is required"],
    },
    cvRelevanceScore: {
      type: Number,
      required: [true, "CV relevance is required"],
    },
    explanation: {
      type: [String],
      required: [true, "Explanation is required"],
    },
    skilIdentificationDict: {
      type: Object,
      required: [true, "Skill identification is required"],
    },
    suggestions: {
      type: [
        {
          keypoint: { type: String, required: [true, "Keypoint is required"] },
          penjelasan: {
            type: String,
            required: [true, "Penjelasan is required"],
          },
        },
      ],
      required: [true, "Suggestions are required"],
    },
  },
  {
    timestamps: true,
  }
);

analysisResultsSchema.index({
  name: "text",
  description: "text",
  location: "text",
});

module.exports = mongoose.model("Companies", analysisResultsSchema);
