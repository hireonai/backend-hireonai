const env = require("./configs/env.config");

class ResponseAPI {
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res
      .response({
        success: true,
        message,
        data,
      })
      .code(statusCode);
  }

  static error(res, message = "Error", statusCode = 400, errors = null) {
    return res
      .response({
        success: false,
        message,
        errors,
      })
      .code(statusCode);
  }

  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = "Forbidden") {
    return this.error(res, message, 403);
  }

  static notFound(res, message = "Not Found") {
    return this.error(res, message, 404);
  }

  static serverError(res, error) {
    console.error(error);
    return this.error(
      res,
      "Internal Server Error",
      500,
      env.nodeEnv === "development" ? error.message : null
    );
  }
}

module.exports = ResponseAPI;
