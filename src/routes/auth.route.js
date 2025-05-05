const {
  googleLogin,
  linkedinLogin,
  facebookLogin,
} = require("../handlers/auth.handler");

module.exports = [
  {
    method: "GET",
    path: "/auth/google",
    options: {
      auth: "google",
      handler: googleLogin,
    },
  },
  {
    method: "GET",
    path: "/auth/linkedin",
    options: {
      auth: false,
      handler: linkedinLogin,
    },
  },
  {
    method: "GET",
    path: "/auth/facebook",
    options: {
      auth: false,
      handler: facebookLogin,
    },
  },
];
