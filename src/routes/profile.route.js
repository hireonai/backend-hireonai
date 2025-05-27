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

module.exports = [
  {
    method: "GET",
    path: "/profile",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "profile"],
      description: "Get user profile",
      handler: getProfile,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
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
      description:
        "Update user profile, can be any one, in this case is example only",
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
        payload: Joi.object({
          fullname: Joi.string().min(1).max(100),
          phone: Joi.string().min(10).max(15).allow(""),
          domicile: Joi.string().allow(""),
          lastEducation: Joi.string().allow(""),
          portfolioUrl: Joi.string().allow(""),
        }),
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
      handler: updateTagPreferences,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
        payload: Joi.object({
          tagPreferences: Joi.array().items(Joi.string()).required(),
        }),
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
      handler: addBookmarkJobs,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
        payload: Joi.object({
          jobId: Joi.string().required(),
        }),
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
      handler: deleteBookmarkJobs,
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
  {
    method: "PATCH",
    path: "/profile/photo",
    options: {
      pre: [{ method: authMiddleware }],
      tags: ["api", "profile"],
      description: "Upload profile photo",
      handler: uploadProfilePhoto,
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
        payload: Joi.object({
          photo: Joi.any()
            .meta({ swaggerType: "file" })
            .required()
            .description("Photo to be uploaded"),
        }),
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
      handler: uploadProfileCV,
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("Authorization header with Bearer token"),
        }).unknown(),
        payload: Joi.object({
          cv: Joi.any()
            .meta({ swaggerType: "file" })
            .required()
            .description("CV to be uploaded"),
        }),
      },
    },
  },
];
