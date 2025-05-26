const authMiddleware = require("../middlewares/authentication.middleware");
const {
  getJobMinExperiences,
} = require("../handlers/jobMinExperience.handler");
const Joi = require("joi");

module.exports = [
  {
    method: "GET",
    path: "/job-min-experiences",
    options: {
      pre: [{ method: authMiddleware }],
      handler: getJobMinExperiences,
      tags: ["api", "job min experience"],
      description: "Get all job minimum experiences",
      notes: "Returns a list of all job minimum experiences",
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
      },
    },
  },
];
