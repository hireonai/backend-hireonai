const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const generateToken = (user, expiresIn = env.jwtExpiresIn) => {
  return jwt.sign({ userId: user._id, email: user.email }, env.jwtSecret, {
    expiresIn,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
