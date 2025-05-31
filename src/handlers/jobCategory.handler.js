const JobCategory = require("../models/jobCategory.model");
const ResponseAPI = require("../utils/response.util");

const getJobCategories = async (request, h) => {
  try {
    const jobCategories = await JobCategory.find();

    if (!jobCategories || jobCategories.length === 0) {
      throw new Error("Job categories not found.");
    }

    return ResponseAPI.success(
      h,
      jobCategories,
      "Job categories successfully retrieved."
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, 500);
  }
};

module.exports = {
  getJobCategories,
};
