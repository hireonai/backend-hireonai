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
      notes:
        "This endpoint retrieves a list of jobs based on search criteria or other filters. The results can be paginated. Authentication is optional. Job retrieval is based ranking recommendation, tag preference, and randomly (if not authenticated).",
      handler: getJobs,
      validate: {
        headers: Joi.object({
          authorization: Joi.string().description(
            "e.g., 'Bearer your_token' or empty if not authenticated"
          ),
        }).unknown(),
        query: Joi.object({
          keyword: Joi.string()
            .optional()
            .description(
              "Search keyword including job position, job description, job qualification, and working location."
            ),
          minSalary: Joi.number().optional().description("e.g., 1000000"),
          maxSalary: Joi.number().optional().description("e.g., 5000000"),
          experience: Joi.string()
            .optional()
            .description("Job Minimum Experience ID"),
          category: Joi.string()
            .optional()
            .description(
              "Job Category ID, can be multiple separated by commas (e.g., 'category1,category2')"
            ),
          industry: Joi.string().optional().description("Company Industry ID"),
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
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Company industries retrieved successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Jobs successfully retrieved.",
                  data: {
                    jobs: [
                      {
                        _id: "{{jobId}}",
                        categories: [
                          {
                            _id: "{{categoryId}}",
                            name: "{{categoryName}}",
                          },
                        ],
                        url: "{{jobUrl}}",
                        jobPosition: "{{jobPosition}}",
                        employmentType: "{{employmentType}}",
                        workingLocationType: "{{workingLocationType}}",
                        workingLocation: "{{workingLocation}}",
                        minSalary: "{{minSalary}}",
                        maxSalary: "{{maxSalary}}",
                        jobDescList: ["{{jobDescription}}"],
                        jobQualificationsList: ["{{jobQualification}}"],
                        createdAt: "{{createdAt}}",
                        updatedAt: "{{updatedAt}}",
                        company: {
                          _id: "{{companyId}}",
                          name: "{{companyName}}",
                          industry: {
                            _id: "{{industryId}}",
                            name: "{{industryName}}",
                          },
                        },
                        minExperience: {
                          _id: "{{minExperienceId}}",
                          name: "{{minExperienceName}}",
                        },
                        scoreMatch: "{{scoreMatch/null}}",
                      },
                    ],
                  },
                  pagination: {
                    currentPage: "{{currentPage}}",
                    totalPages: "{{totalPages}}",
                    totalItems: "{{totalItems}}",
                    itemsPerPage: "{{itemsPerPage}}",
                    hasNextPage: "{{hasNextPage}}",
                    hasPrevPage: "{{hasPrevPage}}",
                  },
                },
              },
            },
          },
        },
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
      notes:
        "This endpoint retrieves detailed information about a specific job and analyzes the CV for the job (if existed).",
      handler: getJobDetails,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
        }).unknown(),
        params: Joi.object({
          jobId: Joi.string().required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Job details successfully retrieved.",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Job details successfully retrieved.",
                  data: {
                    _id: "{{jobId}}",
                    categories: [
                      {
                        _id: "{{categoryId}}",
                        name: "{{categoryName}}",
                      },
                    ],
                    url: "{{jobUrl}}",
                    jobPosition: "{{jobPosition}}",
                    employmentType: "{{employmentType}}",
                    workingLocationType: "{{workingLocationType}}",
                    workingLocation: "{{workingLocation}}",
                    minSalary: "{{minSalary}}",
                    maxSalary: "{{maxSalary}}",
                    jobDescList: ["{{jobDescription}}"],
                    jobQualificationsList: ["{{jobQualification}}"],
                    createdAt: "{{createdAt}}",
                    updatedAt: "{{updatedAt}}",
                    company: {
                      _id: "{{companyId}}",
                      name: "{{companyName}}",
                      profileSrc: "{{companyProfileSrc}}",
                      description: "{{companyDescription}}",
                      profileSrc: "{{companyProfileSrc}}",
                      location: "{{companyLocation}}",
                      employeesCount: "{{companyEmployeesCount}}",
                      createdAt: "{{companyCreatedAt}}",
                      updatedAt: "{{companyUpdatedAt}}",
                      industry: {
                        _id: "{{industryId}}",
                        name: "{{industryName}}",
                      },
                    },
                    minExperience: {
                      _id: "{{minExperienceId}}",
                      name: "{{minExperienceName}}",
                    },
                    analysisResult: {
                      _id: "{{analysisId}}",
                      cvRelevanceScore: "{{cvRelevanceScore}}",
                      improvements: ["{{improvementSuggestion}}"],
                      skilIdentificationDict: {
                        "{{skillName}}": "{{skillValue}}",
                      },
                      suggestions: ["{{suggestion}}."],
                    },
                  },
                },
              },
            },
          },
        },
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
      notes:
        "This endpoint analyzes the CV against the job requirements and returns the analysis result. The language of the result is automatically matched to the language of your CV.",
      handler: analyzeCV,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
        }).unknown(),
        params: Joi.object({
          jobId: Joi.string().required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "CV analysis successfully completed.",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "CV analysis successfully completed.",
                  data: {
                    _id: "{{analysisId}}",
                    cvRelevanceScore: "{{cvRelevanceScore}}",
                    improvements: ["{{improvementSuggestion}}"],
                    skilIdentificationDict: {
                      "{{skillName}}": "{{skillValue}}",
                    },
                    suggestions: ["{{suggestion}}"],
                  },
                },
              },
            },
          },
        },
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
      notes:
        "This endpoint generates a cover letter based on the job requirements and the CV analysis result. You can add a specific request for the cover letter as well.",
      handler: coverLetter,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
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
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Cover letter successfully generated.",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Cover letter successfully generated.",
                  data: {
                    coverletterUrl: "{{coverletterUrl}}",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
];
