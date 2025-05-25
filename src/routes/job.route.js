const Joi = require("joi");
const authMiddleware = require("../middlewares/authentication.middleware");
const { analyzeCV, coverLetter } = require("../handlers/job.handler");

module.exports = [
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
