const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");
const { findOrCreateUserOAuth } = require("../services/user.service");

function generateToken(user) {
  return jwt.sign({ userId: user._id, role: user.roles }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

const googleLogin = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    return `Authentication failed: ${request.auth.error.message}`;
  }

  const profile = request.auth.credentials.profile;

  // return h.response({ profile }).code(200);

  try {
    const account = await findOrCreateUserOAuth({
      email: profile.email,
      fullname: profile.displayName,
      photoUrl: profile.raw.picture,
      oauthProvider: "google",
    });

    request.cookieAuth.set({ user: account });

    return h.response(`Login berhasil, selamat datang ${account.username}`);
  } catch (err) {
    console.error("Login error:", err);
    return h.response("Terjadi kesalahan saat login").code(500);
  }
};
const linkedinLogin = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    return `Authentication failed: ${request.auth.error}`;
  }

  const profile = request.auth.credentials.profile;

  return h.response({ profile }).code(200);

  try {
    const account = await findOrCreateUserOAuth({
      email: profile.emails[0].value,
      fullname: profile.displayName,
      photoUrl: profile.photos[0].value,
      oauthProvider: "linkedin",
    });

    request.cookieAuth.set({ user: account });

    return h.response(`Login berhasil, selamat datang ${account.fullname}`);
  } catch (err) {
    console.error("Login error:", err);
    return h.response("Terjadi kesalahan saat login").code(500);
  }
};
const facebookLogin = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    return `Authentication failed: ${request.auth.error}`;
  }

  const profile = request.auth.credentials.profile;

  return h.response({ profile }).code(200);

  try {
    const account = await findOrCreateUserOAuth({
      email: profile.emails[0].value,
      fullname: profile.displayName,
      photoUrl: profile.photos[0].value,
      oauthProvider: "linkedin",
    });

    request.cookieAuth.set({ user: account });

    return h.response(`Login berhasil, selamat datang ${account.fullname}`);
  } catch (err) {
    console.error("Login error:", err);
    return h.response("Terjadi kesalahan saat login").code(500);
  }
};

module.exports = {
  googleLogin,
  linkedinLogin,
  facebookLogin,
};
