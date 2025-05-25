const { analyzeUserCV } = require("../services/job.service");
const ResponseAPI = require("../utils/response.util");

const analyzeCV = async (request, h) => {
  const user = request.auth.credentials;
  const jobId = request.params.jobId;
  try {
    const result = await analyzeUserCV(user, jobId);
    return ResponseAPI.success(h, result, "CV analysis successfully completed");
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

module.exports = {
  analyzeCV,
};
