const {
  getJobMinExperiences,
} = require("../handlers/jobMinExperience.handler");
const Joi = require("joi");

module.exports = [
  {
    method: "GET",
    path: "/job-min-experiences",
    options: {
      handler: getJobMinExperiences,
      tags: ["api", "job min experience"],
      description: "Get all job minimum experiences",
      notes: "This endpoint retrieves all available job minimum experiences.",
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Job minimum experiences retrieved successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Job minimum experiences successfully retrieved.",
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
