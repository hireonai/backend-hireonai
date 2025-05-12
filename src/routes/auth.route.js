const {
  googleOauth,
  linkedinOauth,
  facebookOauth,
  register,
  activate,
  login,
  forgotPassword,
  resetPassword,
  sendActivationEmail,
} = require("../handlers/auth.handler");
const Joi = require("joi");

module.exports = [
  {
    method: "GET",
    path: "/auth/google",
    options: {
      auth: "google",
      tags: ["api", "auth"],
      description: "Login menggunakan Google OAuth",
      handler: googleOauth,
    },
  },
  {
    method: "GET",
    path: "/auth/linkedin",
    options: {
      auth: "linkedin",
      tags: ["api", "auth"],
      description: "Login menggunakan LinkedIn OAuth",
      handler: linkedinOauth,
    },
  },
  {
    method: "GET",
    path: "/auth/facebook",
    options: {
      auth: "facebook",
      tags: ["api", "auth"],
      description: "Login menggunakan Facebook OAuth",
      handler: facebookOauth,
    },
  },
  {
    method: "POST",
    path: "/auth/register",
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Register user",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          username: Joi.string().min(3).max(30).required(),
          password: Joi.string().min(8).required(),
          fullname: Joi.string().min(1).max(100).required(),
          phone: Joi.string().min(10).max(15).required(),
        }),
      },
      handler: register,
    },
  },
  {
    method: "GET",
    path: "/auth/activate/{token}",
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Activate user",
      handler: activate,
    },
  },
  {
    method: "POST",
    path: "/auth/login",
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Login user",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        }),
      },
      handler: login,
    },
  },
  {
    method: "POST",
    path: "/auth/forgot-password",
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Forgot password",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
        }),
      },
      handler: forgotPassword,
    },
  },
  {
    method: "POST",
    path: "/auth/reset-password",
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Reset password",
      validate: {
        payload: Joi.object({
          token: Joi.string().required(),
          newPassword: Joi.string().min(8).required(),
        }),
      },
      handler: resetPassword,
    },
  },
  {
    method: "POST",
    path: "/auth/send-activation-email",
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Send activation link",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
        }),
      },
      handler: sendActivationEmail,
    },
  },
];
