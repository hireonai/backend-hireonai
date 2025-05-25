const Joi = require("joi");
const authMiddleware = require("../middlewares/authentication.middleware");
const { analyzeCV } = require("../handlers/job.handler");

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
];
