const mongoose = require("mongoose");

const analysisResultsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
      required: [true, "Job is required"],
    },
    cvRelevanceScore: {
      type: Number,
      required: [true, "CV relevance is required"],
    },
    explanation: {
      type: String,
      required: [true, "Explanation is required"],
    },
    skilIdentificationDict: {
      type: Object,
      required: [true, "Skill identification is required"],
    },
    suggestions: {
      type: [String],
      required: [true, "Suggestions are required"],
    },
    improvements: {
      type: [String],
      required: [true, "Improvements are required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AnalysisResults", analysisResultsSchema);
