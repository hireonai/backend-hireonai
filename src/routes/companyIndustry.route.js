const authMiddleware = require("../middlewares/authentication.middleware");
const { getCompanyIndustries } = require("../handlers/companyIndustry.handler");
const Joi = require("joi");

module.exports = [
  {
    method: "GET",
    path: "/company-industries",
    options: {
      pre: [{ method: authMiddleware }],
      handler: getCompanyIndustries,
      tags: ["api", "company industries"],
      description: "Get all company industries",
      notes: "Returns a list of all company industries",
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
