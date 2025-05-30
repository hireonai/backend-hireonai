const {
  getUserJobs,
  getUserJobDetails,
  analyzeUserCV,
  coverLetterUser,
} = require("../services/job.service");
const ResponseAPI = require("../utils/response.util");

const getJobs = async (request, h) => {
  try {
    const result = await getUserJobs(request);

    if (!result || !result.jobs || result.jobs.length === 0) {
      return ResponseAPI.success(
        h,
        {
          data: [],
          pagination: {
            currentPage: parseInt(request.query.page) || 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: parseInt(request.query.limit) || 10,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        "Jobs not found"
      );
    }

    return ResponseAPI.success(
      h,
      {
        data: result.jobs,
        pagination: result.pagination,
      },
      "Jobs successfully retrieved"
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};
const getJobDetails = async (request, h) => {
  const user = request.auth.credentials;
  const jobId = request.params.jobId;
  try {
    const jobDetails = await getUserJobDetails(user, jobId);
    return ResponseAPI.success(
      h,
      jobDetails,
      "Job details successfully retrieved"
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};
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
  getJobs,
  getJobDetails,
  analyzeCV,
  coverLetter,
};
