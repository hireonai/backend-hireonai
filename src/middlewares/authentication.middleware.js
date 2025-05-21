const { verifyToken } = require("../utils/token.util");
const ResponseAPI = require("../utils/response.util");
const User = require("../models/user.model");

const authMiddleware = async (request, h) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ResponseAPI.error(h, "Token missing or invalid", 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return ResponseAPI.error(h, "Token missing or invalid", 401);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return ResponseAPI.error(h, "User not found", 401);
    }

    request.auth = { credentials: user };

    return h.continue;
  } catch (err) {
    return ResponseAPI.error(h, "Forbidden to access", 403);
  }
};

module.exports = authMiddleware;
