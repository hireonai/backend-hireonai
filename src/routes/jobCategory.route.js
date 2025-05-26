const authMiddleware = require("../middlewares/authentication.middleware");
const { getJobCategories } = require("../handlers/jobCategory.handler");
const Joi = require("joi");

module.exports = [
  {
    method: "GET",
    path: "/job-categories",
    options: {
      pre: [{ method: authMiddleware }],
      handler: getJobCategories,
      tags: ["api", "job categories"],
      description: "Get all job categories",
      notes: "Returns a list of all job categories",
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
