const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");
const { URL } = require("url");
const { findOrCreateUserOAuth } = require("../services/user.service");
const ResponseAPI = require("../utils/response.util");

function generateToken(user) {
  return jwt.sign({ userId: user._id, role: user.roles }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

const googleOauth = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    // return h.redirect(
    //   `${env.frontendUrl}/login?error=${encodeURIComponent(
    //     "Failed to authenticate with Google"
    //   )}`
    // );
    return ResponseAPI.error(h, "Failed to authenticate with Google", 401);
  }

  const profile = request.auth.credentials.profile;

  try {
    const account = await findOrCreateUserOAuth({
      email: profile.email,
      fullname: profile.displayName,
      photoUrl:
        profile.raw.picture !== null && profile.raw.picture !== undefined
          ? profile.raw.picture
          : null,
      oauthProvider: "google",
    });

    const token = generateToken(account);

    // const redirectUrl = new URL(`${env.frontendUrl}/oauth/callback`);
    // redirectUrl.searchParams.set("token", token);

    // return h.redirect(redirectUrl.toString());

    return ResponseAPI.success(
      h,
      {
        token,
        user: {
          id: account._id,
          email: account.email,
          fullname: profile.displayName,
          photoUrl:
            profile.raw.picture !== null && profile.raw.picture !== undefined
              ? profile.raw.picture
              : null,
        },
      },
      "Login success with Google"
    );
  } catch (err) {
    // const redirectUrl = new URL(`${env.frontendUrl}/login`);
    // redirectUrl.searchParams.set(
    //   "error",
    //   encodeURIComponent(err.message || "Login error with Google")
    // );

    // return h.redirect(redirectUrl.toString());

    return ResponseAPI.error(
      h,
      err.message || "Login error with Google",
      400,
      err.errors || null
    );
  }
};

const linkedinOauth = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    // return h.redirect(
    //   `${env.frontendUrl}/login?error=${encodeURIComponent(
    //     "Failed to authenticate with LinkedIn"
    //   )}`
    // );
    return ResponseAPI.error(h, "Failed to authenticate with LinkedIn", 401);
  }

  const profile = request.auth.credentials.profile;

  try {
    const account = await findOrCreateUserOAuth({
      email: profile.email,
      fullname: profile.displayName,
      photoUrl: profile.photo || null,
      oauthProvider: "linkedin",
    });

    const token = generateToken(account);

    // const redirectUrl = new URL(`${env.frontendUrl}/oauth/callback`);
    // redirectUrl.searchParams.set("token", token);

    // return h.redirect(redirectUrl.toString());

    return ResponseAPI.success(
      h,
      {
        token,
        user: {
          id: account._id,
          email: account.email,
          fullname: profile.displayName,
          photoUrl: profile.photo || null,
        },
      },
      "Login success with LinkedIn"
    );
  } catch (err) {
    // const redirectUrl = new URL(`${env.frontendUrl}/login`);
    // redirectUrl.searchParams.set(
    //   "error",
    //   encodeURIComponent(err.message || "Login error with LinkedIn")
    // );

    // return h.redirect(redirectUrl.toString());

    return ResponseAPI.error(
      h,
      err.message || "Login error with LinkedIn",
      400,
      err.errors || null
    );
  }
};
const facebookOauth = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    // return h.redirect(
    //   `${env.frontendUrl}/login?error=${encodeURIComponent(
    //     "Failed to authenticate with Facebook"
    //   )}`
    // );
    return ResponseAPI.error(h, "Failed to authenticate with Facebook", 401);
  }

  const profile = request.auth.credentials.profile;

  try {
    const account = await findOrCreateUserOAuth({
      email: profile.email,
      fullname: profile.displayName,
      photoUrl:
        profile.picture !== null && profile.picture !== undefined
          ? profile.picture.data.url
          : null,
      oauthProvider: "facebook",
    });

    const token = generateToken(account);

    // const redirectUrl = new URL(`${env.frontendUrl}/oauth/callback`);
    // redirectUrl.searchParams.set("token", token);

    // return h.redirect(redirectUrl.toString());

    return ResponseAPI.success(
      h,
      {
        token,
        user: {
          id: account._id,
          email: account.email,
          fullname: profile.displayName,
          photoUrl:
            profile.picture !== null && profile.picture !== undefined
              ? profile.picture.data.url
              : null,
        },
      },
      "Login success with Facebook"
    );
  } catch (err) {
    // const redirectUrl = new URL(`${env.frontendUrl}/login`);
    // redirectUrl.searchParams.set(
    //   "error",
    //   encodeURIComponent(err.message || "Login error with Facebook")
    // );
    // return h.redirect(redirectUrl.toString());

    return ResponseAPI.error(
      h,
      err.message || "Login error with Facebook",
      400,
      err.errors || null
    );
  }
};

module.exports = {
  googleOauth,
  linkedinOauth,
  facebookOauth,
};
