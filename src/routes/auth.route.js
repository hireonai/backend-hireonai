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
      tags: ["api", "auth"],
      description: "Login menggunakan Google OAuth",
      handler: googleLogin,
    },
  },
  {
    method: "GET",
    path: "/auth/linkedin",
    options: {
      auth: "linkedin",
      tags: ["api", "auth"],
      description: "Login menggunakan LinkedIn OAuth",
      handler: linkedinLogin,
    },
  },
  {
    method: "GET",
    path: "/auth/facebook",
    options: {
      auth: "facebook",
      tags: ["api", "auth"],
      description: "Login menggunakan Facebook OAuth",
      handler: facebookLogin,
    },
  },
];
