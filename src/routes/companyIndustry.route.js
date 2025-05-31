const authMiddleware = require("../middlewares/authentication.middleware");
const { getCompanyIndustries } = require("../handlers/companyIndustry.handler");
const Joi = require("joi");
const { plugin } = require("mongoose");

module.exports = [
  {
    method: "GET",
    path: "/company-industries",
    options: {
      pre: [{ method: authMiddleware }],
      handler: getCompanyIndustries,
      tags: ["api", "company industries"],
      description: "Get all company industries",
      notes: "This endpoint retrieves all available company industries.",
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
        }).unknown(),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Company industries retrieved successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Company industries successfully retrieved.",
                  data: [
                    {
                      _id: "{{id}}",
                      name: "{{name}}",
                      createdAt: "{{createdAt}}",
                      updatedAt: "{{updatedAt}}",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
];
