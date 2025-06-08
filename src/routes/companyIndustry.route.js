const { getCompanyIndustries } = require("../handlers/companyIndustry.handler");

module.exports = [
  {
    method: "GET",
    path: "/company-industries",
    options: {
      handler: getCompanyIndustries,
      tags: ["api", "company industries"],
      description: "Get all company industries",
      notes: "This endpoint retrieves all available company industries.",
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
