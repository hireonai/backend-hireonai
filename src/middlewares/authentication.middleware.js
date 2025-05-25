const { verifyToken } = require("../utils/token.util");
const User = require("../models/user.model");
const Boom = require("@hapi/boom");

const authMiddleware = async (request, h) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw Boom.unauthorized("Authorization header is missing or invalid");
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      throw Boom.unauthorized("Invalid token");
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw Boom.notFound("User not found");
    }

    request.auth = { credentials: user };

    return h.continue;
  } catch (err) {
    throw Boom.unauthorized(err.message || "Forbidden to access");
  }
};

module.exports = authMiddleware;
