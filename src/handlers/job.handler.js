const { analyzeUserCV, coverLetterUser } = require("../services/job.service");
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

const coverLetter = async (request, h) => {
  const user = request.auth.credentials;
  const jobId = request.params.jobId;
  const { specificRequest } = request.payload;
  try {
    const result = await coverLetterUser(user, jobId, specificRequest);
    return ResponseAPI.success(
      h,
      { coverletterUrl: result },
      "Cover letter successfully generated"
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

module.exports = {
  analyzeCV,
  coverLetter,
};
