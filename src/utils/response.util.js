const env = require("../configs/env.config");

class ResponseAPI {
  static success(h, data = null, message = "Success", statusCode = 200) {
    return h
      .response({
        statusCode,
        success: true,
        message,
        data,
      })
      .code(statusCode);
  }

  static error(h, message, statusCode) {
    return h
      .response({
        statusCode,
        success: false,
        message:
          env.nodeEnv !== "development" && statusCode === 500 ? null : message,
        error:
          statusCode === 401
            ? "Unauthorized"
            : statusCode === 403
            ? "Forbidden"
            : statusCode === 404
            ? "Not Found"
            : statusCode === 500
            ? "Internal Server Error"
            : "Error",
      })
      .code(statusCode);
  }

  // static unauthorized(h, message = null) {
  //   return this.error(h, message, 401, "Unauthorized");
  // }

  // static forbidden(h, message = null) {
  //   return this.error(h, message, 403, "Forbidden");
  // }

  // static notFound(h, message = null) {
  //   return this.error(h, message, 404, "Not Found");
  // }

  // static serverError(h, message = null) {
  //   return this.error(
  //     h,
  //     env.nodeEnv === "development" ? message : null,
  //     500,
  //     "Internal Server Error"
  //   );
  // }
}

module.exports = ResponseAPI;
