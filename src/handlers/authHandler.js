const jwt = require("jsonwebtoken");
const passport = require("../auth/passport");
const env = require("../configs/env");

function generateToken(user) {
  return jwt.sign({ userId: user._id, role: user.roles }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

const handleOAuthCallback = (provider) => {
  return async (request, h) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(provider, { session: false }, async (err, user) => {
        if (err) {
          console.error("OAuth Error:", err);
          return resolve(
            h.redirect(
              `${env.frontendUrl}/oauth-failed?error=${encodeURIComponent(
                err.message
              )}`
            )
          );
        }

        if (!user) {
          return resolve(
            h.redirect(`${env.frontendUrl}/oauth-failed?error=no_user`)
          );
        }

        try {
          const token = generateToken(user);
          return resolve(
            h.redirect(`${env.frontendUrl}/oauth-success?token=${token}`)
          );
        } catch (error) {
          console.error("Token Generation Error:", error);
          return resolve(
            h.redirect(`${env.frontendUrl}/oauth-failed?error=token_generation`)
          );
        }
      })(request.raw.req, request.raw.res);
    });
  };
};

const initiateOAuth = (provider, options) => {
  return (request, h) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        provider,
        { ...options, session: false },
        (err, user) => {
          if (err) {
            console.error("OAuth Initiation Error:", err);
            return reject(err);
          }
          return resolve(user);
        }
      )(request.raw.req, request.raw.res);
    });
  };
};

module.exports = {
  handleOAuthCallback,
  initiateOAuth,
};
