const { URL } = require("url");
const {
  findOrCreateUserOAuth,
  registerUser,
  activateUser,
  loginUser,
  forgotPasswordUser,
  resetPasswordUser,
  sendActivationEmailUser,
} = require("../services/user.service");
const ResponseAPI = require("../utils/response.util");
const { generateToken } = require("../utils/token.util");

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

    return ResponseAPI.error(h, err.message, err.statusCode);
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

    return ResponseAPI.error(h, err.message, err.statusCode);
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

    return ResponseAPI.error(h, err.message, err.statusCode);
  }
};

const register = async (request, h) => {
  try {
    const { email, username, password, fullname, phone } = request.payload;

    const { user, profile } = await registerUser({
      fullname,
      username,
      email,
      phone,
      password,
    });

    const data = {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullname: profile.fullname,
      phone: profile.phone,
    };

    return ResponseAPI.success(
      h,
      data,
      "Account created. Please verify via email."
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode);
  }
};
const activate = async (request, h) => {
  try {
    const { token } = request.params;

    let user = await activateUser({ token });

    user = user.toObject();
    delete user.password;
    delete user.oauthProvider;
    delete user.role;

    return ResponseAPI.success(h, user, "Account verified successfully.");
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode);
  }
};

const login = async (request, h) => {
  try {
    const { username, password } = request.payload;

    let user = await loginUser({ username, password });
    user = user.toObject();
    delete user.password;
    delete user.oauthProvider;
    delete user.role;

    const token = generateToken(user);

    return ResponseAPI.success(h, { token, user: user }, "Login successful.");
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode);
  }
};

const forgotPassword = async (request, h) => {
  try {
    const { email } = request.payload;

    await forgotPasswordUser({ email });

    return ResponseAPI.success(h, null, "Password reset link sent to email.");
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode);
  }
};

const resetPassword = async (request, h) => {
  try {
    const { token, newPassword } = request.payload;

    await resetPasswordUser({ token, newPassword });

    return ResponseAPI.success(h, null, "Password reset successful.");
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode);
  }
};

const sendActivationEmail = async (request, h) => {
  try {
    const { email } = request.payload;

    await sendActivationEmailUser({ email });
    return ResponseAPI.success(
      h,
      null,
      "Activation email sent. Please check your inbox."
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode);
  }
};

module.exports = {
  googleOauth,
  linkedinOauth,
  facebookOauth,
  register,
  activate,
  login,
  forgotPassword,
  resetPassword,
  sendActivationEmail,
};
