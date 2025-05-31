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
      description: "Login with Google OAuth",
      notes:
        "This endpoint allows users to log in using their Google account. It redirects to the Google OAuth page for authentication.",
      handler: googleOauth,
    },
  },
  {
    method: "GET",
    path: "/auth/linkedin",
    options: {
      auth: "linkedin",
      tags: ["api", "auth"],
      description: "Login with LinkedIn OAuth",
      notes:
        "This endpoint allows users to log in using their LinkedIn account. It redirects to the LinkedIn OAuth page for authentication.",
      handler: linkedinOauth,
    },
  },
  {
    method: "GET",
    path: "/auth/facebook",
    options: {
      auth: "facebook",
      tags: ["api", "auth"],
      description: "Login with Facebook OAuth",
      notes:
        "This endpoint allows users to log in using their Facebook account. It redirects to the Facebook OAuth page for authentication.",
      handler: facebookOauth,
    },
  },
  {
    method: "POST",
    path: "/auth/register",
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Register a new user",
      notes:
        "This endpoint allows users to register with their email, username, password, fullname, and phone number.",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          username: Joi.string().min(3).max(30).required(),
          password: Joi.string().min(8).required(),
          fullname: Joi.string().min(1).max(100).required(),
          phone: Joi.string().min(10).max(15).required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            201: {
              description: "User registered successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Account created. Please verify via email.",
                  data: {
                    _id: "{{userId}}",
                    email: "{{email}}",
                    username: "{{username}}",
                    fullname: "{{fullname}}",
                    phone: "{{phone}}",
                  },
                },
              },
            },
          },
        },
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
      description: "Activate user account",
      validate: {
        params: Joi.object({
          token: Joi.string().required(),
        }),
      },
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
      notes:
        "This endpoint allows users to log in with their email/username and password.",
      validate: {
        payload: Joi.object({
          username: Joi.string().min(3).max(30).required(),
          password: Joi.string().min(8).required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Login successful",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Login successful.",
                  data: {
                    token: "{{token}}",
                    user: {
                      _id: "{{userId}}",
                      username: "{{username}}",
                      email: "{{email}}",
                      fullname: "{{fullname}}",
                      phone: "{{phone}}",
                      verifiedAt: "{{verifiedAt}}",
                      createdAt: "{{createdAt}}",
                      updatedAt: "{{updatedAt}}",
                    },
                  },
                },
              },
            },
          },
        },
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
      description: "Request password reset",
      notes:
        "This endpoint allows users to request a password reset link by providing their email address.",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Password reset link sent successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message:
                    "Password reset link sent. Please check your inbox/spam.",
                  data: null,
                },
              },
            },
          },
        },
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
      description: "Reset user password",
      notes:
        "This endpoint allows users to reset their password using a token received via email.",
      validate: {
        payload: Joi.object({
          token: Joi.string().required(),
          newPassword: Joi.string().min(8).required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Password reset successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message: "Password reset successful.",
                  data: null,
                },
              },
            },
          },
        },
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
      notes:
        "This endpoint allows users to request a new activation email if they haven't received it or if it has expired.",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
        }),
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: "Activation email sent successfully",
              examples: {
                "application/json": {
                  statusCode: 200,
                  success: true,
                  message:
                    "Activation email sent. Please check your inbox/spam.",
                  data: null,
                },
              },
            },
          },
        },
      },
      handler: sendActivationEmail,
    },
  },
];
