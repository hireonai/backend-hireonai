const mongoose = require("mongoose");
const { sendEmail } = require("../utils/email.util");
const { generateToken, verifyToken } = require("../utils/token.util");
const env = require("../configs/env.config");
const CustomError = require("../utils/error.util");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const roles = require("../constants/roles.constant");

const findOrCreateUserOAuth = async ({
  email,
  fullname,
  photoUrl,
  oauthProvider,
}) => {
  if (!email) {
    throw new CustomError(
      `The ${oauthProvider} provider did not provide an email address.`,
      400
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let user = await User.findOne({ email }).session(session);

    if (!user) {
      user = await User.create(
        {
          email,
          username: email.split("@")[0],
          role: roles.seeker,
          oauthProvider,
          password: "erikajagongodingkroconyangga",
          verifiedAt: new Date(),
        },
        { session }
      );

      await Profile.create(
        {
          userId: user._id,
          fullname,
          photoUrl,
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return user;
    } else {
      if (user.oauthProvider !== oauthProvider) {
        await session.abortTransaction();
        session.endSession();
        throw new CustomError(
          `Email already registered using the ${user.oauthProvider} provider.`,
          409
        );
      }
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(error.message, 500);
  }
};

const sendingActivationEmail = async ({ email, token }) => {
  const activationLink = `${env.frontendUrl}/activate/${token}`;
  const emailContent = `
    <h1>Welcome to ${env.appName}!</h1>
    <p>We're excited to have you on board. To start using your account, please verify your email address by clicking the link below:</p>
    <p><a href="${activationLink}">Verify my email</a></p>
    <p>If you did not sign up for an account, please ignore this email.</p>
    <p>Thank you,<br/>The ${env.appName} Team</p>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Verify Your Account",
      html: emailContent,
    });
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

const registerUser = async ({ fullname, username, email, phone, password }) => {
  if (!fullname) throw new CustomError("Fullname is required.", 400);
  if (!username) throw new CustomError("Username is required.", 400);
  if (!email) throw new CustomError("Email is required.", 400);
  if (!phone) throw new CustomError("Phone is required.", 400);
  if (!password) throw new CustomError("Password is required.", 400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername)
      throw new CustomError("Username already used.", 409);

    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      throw new CustomError(
        existingByEmail.oauthProvider
          ? `Email already registered using the ${existingByEmail.oauthProvider} provider.`
          : "Email already registered.",
        409
      );
    }

    const user = new User({ email, username, role: roles.seeker, password });
    const profile = new Profile({ userId: user._id, fullname, phone });
    await user.save({ session });
    await profile.save({ session });

    const token = generateToken(user, "1h");
    await sendingActivationEmail({ email, token });

    await session.commitTransaction();
    session.endSession();

    return { user, profile };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(error.message, 500);
  }
};

const activateUser = async ({ token }) => {
  if (!token) throw new CustomError("Token is required.", 400);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const decoded = verifyToken(token);
    const userId = decoded.userId;
    const user = await User.findById(userId);

    if (!user) throw new CustomError("User not found", 404);
    if (user.verifiedAt) throw new CustomError("User already activated", 409);

    user.verifiedAt = new Date();
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(error.message, 500);
  }
};

const loginUser = async ({ username, password }) => {
  if (!username) throw new CustomError("Email/Username is required.", 400);
  if (!password) throw new CustomError("Password is required.", 400);
  try {
    const user = await User.findOne({
      $or: [{ email: username }, { username }],
    });
    if (!user || !(await user.comparePassword(password)))
      throw new CustomError("Invalid email/username or password.", 401);
    if (!user.verifiedAt)
      throw new CustomError("Please verify your account first.", 403);
    return user;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(error.message, 500);
  }
};

const forgotPasswordUser = async ({ email }) => {
  if (!email) throw new CustomError("Email is required.", 400);
  try {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError("User not found.", 404);
    const token = generateToken(user, "1h");
    const resetLink = `${env.frontendUrl}/reset-password/${token}`;
    const emailContent = `
      <h1>Password Reset</h1>
      <p>To reset your password, please click the link below:</p>
      <p><a href="${resetLink}">Reset my password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you,<br/>The ${env.appName} Team</p>
    `;
    try {
      await sendEmail({
        to: email,
        subject: "Reset Your Account Password",
        html: emailContent,
      });
    } catch (error) {
      throw new CustomError(error.message, 500);
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(error.message, 500);
  }
};

const resetPasswordUser = async ({ token, newPassword }) => {
  if (!token) throw new CustomError("Token is required.", 400);
  if (!newPassword) throw new CustomError("New password is required.", 400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).session(session);
    if (!user) throw new CustomError("User not found.", 404);

    user.password = newPassword;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(error.message, 500);
  }
};

const sendActivationEmailUser = async ({ email }) => {
  if (!email) throw new CustomError("Email is required.", 400);

  try {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError("User not found.", 404);

    const token = generateToken(user, "1h");
    await sendingActivationEmail({ email, token });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(error.message, 500);
  }
};

module.exports = {
  findOrCreateUserOAuth,
  registerUser,
  activateUser,
  loginUser,
  forgotPasswordUser,
  resetPasswordUser,
  sendActivationEmailUser,
};
