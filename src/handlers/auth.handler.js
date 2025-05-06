const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");
const { URL } = require("url");
const { findOrCreateUserOAuth } = require("../services/user.service");

function generateToken(user) {
  return jwt.sign({ userId: user._id, role: user.roles }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

const googleLogin = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    return h.redirect(
      `${env.frontendUrl}/login?error=${encodeURIComponent(
        "Autentikasi gagal"
      )}`
    );
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

    const redirectUrl = new URL(`${env.frontendUrl}/oauth/callback`);
    redirectUrl.searchParams.set("token", token);

    return h.redirect(redirectUrl.toString());
  } catch (err) {
    console.error("Login error:", err);

    const redirectUrl = new URL(`${env.frontendUrl}/login`);
    redirectUrl.searchParams.set(
      "error",
      encodeURIComponent(err.message || "Login error")
    );

    return h.redirect(redirectUrl.toString());
  }
};

const linkedinLogin = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    return h.redirect(
      `${env.frontendUrl}/login?error=${encodeURIComponent(
        "Autentikasi gagal"
      )}`
    );
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

    const redirectUrl = new URL(`${env.frontendUrl}/oauth/callback`);
    redirectUrl.searchParams.set("token", token);

    return h.redirect(redirectUrl.toString());
  } catch (err) {
    console.error("Login error:", err);

    const redirectUrl = new URL(`${env.frontendUrl}/login`);
    redirectUrl.searchParams.set(
      "error",
      encodeURIComponent(err.message || "Login error")
    );

    return h.redirect(redirectUrl.toString());
  }
};
const facebookLogin = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    return h.redirect(
      `${env.frontendUrl}/login?error=${encodeURIComponent(
        "Autentikasi gagal"
      )}`
    );
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

    const redirectUrl = new URL(`${env.frontendUrl}/oauth/callback`);
    redirectUrl.searchParams.set("token", token);

    return h.redirect(redirectUrl.toString());
  } catch (err) {
    console.error("Login error:", err);

    const redirectUrl = new URL(`${env.frontendUrl}/login`);
    redirectUrl.searchParams.set(
      "error",
      encodeURIComponent(err.message || "Login error")
    );

    return h.redirect(redirectUrl.toString());
  }
};

module.exports = {
  googleLogin,
  linkedinLogin,
  facebookLogin,
};
