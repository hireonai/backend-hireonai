const authMiddleware = require("../middlewares/authentication.middleware");
const {
  getProfile,
  updateProfile,
  updateTagPreferences,
  addBookmarkJobs,
  deleteBookmarkJobs,
  uploadProfilePhoto,
  uploadProfileCV,
} = require("../handlers/profile.handler");
const Joi = require("joi");
const { plugin } = require("mongoose");

module.exports = [
  {
    method: "GET",
    path: "/profile",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "profile"],
      description: "Get user profile",
      notes: "This endpoint retrieves the user profile.",
      handler: getProfile,
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
              description: "User profile retrieved successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Profile successfully retrieved.",
                  data: {
                    _id: "{{profileId}}",
                    fullname: "{{fullname}}",
                    phone: "{{phone}}",
                    domicile: "{{domicile}}",
                    lastEducation: "{{lastEducation}}",
                    photoUrl: "{{photoUrl}}",
                    portfolioUrl: "{{portfolioUrl}}",
                    cvUrl: "{{cvUrl}}",
                    tagPreferences: ["{{tagPreferences}}"],
                    bookmarkJobs: [
                      {
                        _id: "{{jobId}}",
                        url: "{{url}}",
                        jobPosition: "{{jobPosition}}",
                        employmentType: "{{employmentType}}",
                        company: {
                          _id: "{{companyId}}",
                          name: "{{companyName}}",
                        },
                        scoreMatch: "{{scoreMatch/null}}",
                      },
                    ],
                    createdAt: "{{createdAt}}",
                    updatedAt: "{{updatedAt}}",
                    user: {
                      _id: "{{userId}}",
                      username: "{{username}}",
                      email: "{{email}}",
                      verifiedAt: "{{verifiedAt}}",
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
    method: "PUT",
    path: "/profile",
    options: {
      pre: [{ method: authMiddleware }],
      handler: updateProfile,
      tags: ["api", "profile"],
      description: "Update user profile",
      notes:
        "This endpoint updates the user profile. You can update the following fields: fullname, phone, domicile, lastEducation, portfolioUrl.",
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
        }).unknown(),
        payload: Joi.object({
          fullname: Joi.string().min(1).max(100),
          phone: Joi.string().min(10).max(15).allow(""),
          domicile: Joi.string().allow(""),
          lastEducation: Joi.string().allow(""),
          portfolioUrl: Joi.string().allow(""),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "User profile updated successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "ProfProfile successfully updated.",
                  data: {
                    _id: "{{profileId}}",
                    fullname: "{{fullname}}",
                    phone: "{{phone}}",
                    domicile: "{{domicile}}",
                    lastEducation: "{{lastEducation}}",
                    photoUrl: "{{photoUrl}}",
                    portfolioUrl: "{{portfolioUrl}}",
                    cvUrl: "{{cvUrl}}",
                    tagPreferences: ["{{tagPreferences}}"],
                    bookmarkJobs: [
                      {
                        _id: "{{jobId}}",
                        url: "{{url}}",
                        jobPosition: "{{jobPosition}}",
                        employmentType: "{{employmentType}}",
                        company: {
                          _id: "{{companyId}}",
                          name: "{{companyName}}",
                        },
                      },
                    ],
                    createdAt: "{{createdAt}}",
                    updatedAt: "{{updatedAt}}",
                    user: {
                      _id: "{{userId}}",
                      username: "{{username}}",
                      email: "{{email}}",
                      verifiedAt: "{{verifiedAt}}",
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
    method: "PATCH",
    path: "/profile/tag-preferences",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "profile"],
      description: "Update tag preferences",
      notes: "This endpoint updates the tag preferences.",
      handler: updateTagPreferences,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
        }).unknown(),
        payload: Joi.object({
          tagPreferences: Joi.array().items(Joi.string()).required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Tag preferences updated successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Tag preferences successfully updated.",
                  data: {
                    updatedTagPreferences: ["{{tagPreferences}}"],
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
    path: "/profile/bookmark-job",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "profile"],
      description: "Add job to bookmark",
      notes: "This endpoint adds a job to the user's bookmark.",
      handler: addBookmarkJobs,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
        }).unknown(),
        payload: Joi.object({
          jobId: Joi.string().required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Job added to bookmark successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "JoJob successfully bookmarked.",
                  data: {
                    updatedBookmarkJobs: ["{{updatedBookmarkJobs}}"],
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
    method: "DELETE",
    path: "/profile/bookmark-job/{jobId}",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "profile"],
      description: "Delete job from bookmark",
      notes: "This endpoint deletes a job from the user's bookmark.",
      handler: deleteBookmarkJobs,
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
              description: "Job deleted from bookmark successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Job successfully removed from bookmarks.",
                  data: {
                    updatedBookmarkJobs: ["{{updatedBookmarkJobs}}"],
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
    method: "PATCH",
    path: "/profile/photo",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "profile"],
      description: "Upload profile photo",
      notes:
        "This endpoint uploads profile photo. Allowed file types: PNG, JPEG, JPG. and size must not be larger than 5MB.",
      handler: uploadProfilePhoto,
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
        }).unknown(),
        payload: Joi.object({
          photo: Joi.any()
            .meta({ swaggerType: "file" })
            .required()
            .description("Photo to be uploaded"),
        }),
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            200: {
              description: "Profile photo uploaded successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Profile photo successfully uploaded.",
                  data: {
                    photoUrl: ["{{photoUrl}}"],
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
    method: "PATCH",
    path: "/profile/cv",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "profile"],
      description: "Upload CV",
      notes:
        "This endpoint uploads CV. Allowed file types: PDF. and size must not be larger than 5MB.",
      handler: uploadProfileCV,
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("e.g., 'Bearer your_token'"),
        }).unknown(),
        payload: Joi.object({
          cv: Joi.any()
            .meta({ swaggerType: "file" })
            .required()
            .description("CV to be uploaded"),
        }),
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            200: {
              description: "CV uploaded successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "CV successfully uploaded.",
                  data: {
                    cvUrl: ["{{cvUrl}}"],
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
