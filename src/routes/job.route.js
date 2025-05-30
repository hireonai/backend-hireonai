const Joi = require("joi");
const authMiddleware = require("../middlewares/authentication.middleware");
const {
  getJobs,
  getJobDetails,
  analyzeCV,
  coverLetter,
} = require("../handlers/job.handler");

module.exports = [
  {
    method: "GET",
    path: "/jobs",
    options: {
      tags: ["api", "jobs"],
      description: "Get all jobs",
      handler: getJobs,
      validate: {
        headers: Joi.object({
          authorization: Joi.string().description(
            "Authorization header with Bearer token"
          ),
        }).unknown(),
        query: Joi.object({
          keyword: Joi.string().optional(),
          minSalary: Joi.number().optional(),
          maxSalary: Joi.number().optional(),
          experience: Joi.string().optional(),
          category: Joi.string().optional(),
          industry: Joi.string().optional(),
          page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .description("Page number (starts from 1)"),
          limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .description("Number of items per page (max 100)"),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/jobs/{jobId}",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "jobs"],
      description: "Get job details",
      handler: getJobDetails,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
        params: Joi.object({
          jobId: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: "POST",
    path: "/jobs/{jobId}/analyze-cv",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "jobs"],
      description: "Analyze CV for job",
      handler: analyzeCV,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
        params: Joi.object({
          jobId: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: "POST",
    path: "/jobs/{jobId}/cover-letter",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "jobs"],
      description: "Generate cover letter for job",
      handler: coverLetter,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
        params: Joi.object({
          jobId: Joi.string().required(),
        }),
        payload: Joi.object({
          specificRequest: Joi.string()
            .allow("")
            .description("Specific request for cover letter"),
        }),
      },
    },
  },
];
