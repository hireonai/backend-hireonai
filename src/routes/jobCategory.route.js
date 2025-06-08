const { getJobCategories } = require("../handlers/jobCategory.handler");
const Joi = require("joi");

module.exports = [
  {
    method: "GET",
    path: "/job-categories",
    options: {
      handler: getJobCategories,
      tags: ["api", "job categories"],
      description: "Get all job categories",
      notes: "This endpoint retrieves all available job categories.",
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Job categories retrieved successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Job categories successfully retrieved.",
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
