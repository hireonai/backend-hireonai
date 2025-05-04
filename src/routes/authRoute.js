const passport = require("../auth/passport");
const {
  handleOAuthCallback,
  initiateOAuth,
} = require("../handlers/authHandler");

module.exports = [
  {
    method: "GET",
    path: "/auth/google",
    options: {
      auth: false,
      handler: initiateOAuth("google", {
        session: false,
        scope: ["profile", "email"],
        prompt: "select_account", // Tambahkan ini untuk memastikan user selalu diminta memilih akun
      }),
    },
  },
  {
    method: "GET",
    path: "/auth/google/callback",
    options: {
      auth: false,
      handler: handleOAuthCallback("google"),
    },
  },
  {
    method: "GET",
    path: "/auth/github",
    options: {
      auth: false,
      handler: passport.authenticate("github", { scope: ["user:email"] }),
    },
  },
  {
    method: "GET",
    path: "/auth/github/callback",
    options: {
      auth: false,
      handler: handleOAuthCallback("github"),
    },
  },
  {
    method: "GET",
    path: "/auth/linkedin",
    options: {
      auth: false,
      handler: passport.authenticate("linkedin", {
        scope: ["r_liteprofile", "r_emailaddress"],
      }),
    },
  },
  {
    method: "GET",
    path: "/auth/linkedin/callback",
    options: {
      auth: false,
      handler: handleOAuthCallback("linkedin"),
    },
  },
];
