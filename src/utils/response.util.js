const env = require("../configs/env.config");

class ResponseAPI {
  static success(h, data = null, message = "Success", statusCode = 200) {
    return h
      .response({
        success: true,
        message,
        data,
      })
      .code(statusCode);
  }

  static error(h, message = "Error", statusCode = 400, errors = null) {
    return h
      .response({
        success: false,
        message,
        errors,
      })
      .code(statusCode);
  }

  static unauthorized(h, message = "Unauthorized") {
    return this.error(h, message, 401);
  }

  static forbidden(h, message = "Forbidden") {
    return this.error(h, message, 403);
  }

  static notFound(h, message = "Not Found") {
    return this.error(h, message, 404);
  }

  static serverError(h, error) {
    return this.error(
      h,
      "Internal Server Error",
      500,
      env.nodeEnv === "development" ? error.message : null
    );
  }
}

module.exports = ResponseAPI;
