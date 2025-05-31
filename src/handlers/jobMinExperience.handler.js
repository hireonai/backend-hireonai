const JobMinExperience = require("../models/jobMinExperience.model");
const ResponseAPI = require("../utils/response.util");

const getJobMinExperiences = async (request, h) => {
  try {
    const jobMinExperiences = await JobMinExperience.find();

    if (!jobMinExperiences || jobMinExperiences.length === 0) {
      throw new Error("Job minimum experiences not found.");
    }

    return ResponseAPI.success(
      h,
      jobMinExperiences,
      "Job minimum experiences successfully retrieved."
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, 500);
  }
};

module.exports = {
  getJobMinExperiences,
};
