const Hapi = require("@hapi/hapi");
const env = require("./configs/env.config");
const routes = require("./routes");
const Bell = require("bell");
const Cookie = require("@hapi/cookie");
const connectDB = require("./configs/database.config");
const axios = require("axios");
const registerSwagger = require("./configs/swagger.config");

const customLinkedInOIDC = {
  name: "linkedin",
  protocol: "oauth2",
  useParamsAuth: true,
  auth: "https://www.linkedin.com/oauth/v2/authorization",
  token: "https://www.linkedin.com/oauth/v2/accessToken",
  scope: ["openid", "profile", "email"],
  profile: async function (credentials, params) {
    const { access_token } = params;
    if (!params || !params.access_token) {
      throw new Error("Missing access token in params");
    }

    const { data: profile } = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    credentials.profile = {
      id: profile.sub,
      email: profile.email,
      displayName: `${profile.given_name || ""} ${
        profile.family_name || ""
      }`.trim(),
      photo: profile.picture || null,
      raw: profile,
    };
  },
};

const init = async () => {
  await connectDB();

  const server = Hapi.server({
    port: env.port,
    host: env.nodeEnv === "production" ? "0.0.0.0" : "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([Bell, Cookie]);
  await registerSwagger(server);

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: "auth-session",
      password: env.cookiePassword,
      isSecure: env.nodeEnv === "production",
    },
    redirectTo: "/auth/google",
  });

  server.auth.strategy("google", "bell", {
    provider: "google",
    password: env.cookiePassword,
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    isSecure: env.nodeEnv === "production",
    scope: ["profile", "email"],
  });

  server.auth.strategy("linkedin", "bell", {
    provider: customLinkedInOIDC,
    password: env.cookiePassword,
    clientId: env.linkedinClientId,
    clientSecret: env.linkedinClientSecret,
    isSecure: env.nodeEnv === "production",
  });

  server.auth.strategy("facebook", "bell", {
    provider: "facebook",
    password: env.cookiePassword,
    clientId: env.facebookClientId,
    clientSecret: env.facebookClientSecret,
    isSecure: env.nodeEnv === "production",
    scope: ["email", "public_profile"],
  });

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response.isBoom) {
      const { statusCode } = response.output;
      const { error, message } = response.output.payload;

      return h
        .response({
          statusCode,
          success: false,
          error,
          message,
        })
        .code(statusCode);
    }

    return h.continue;
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  console.log(`Documentation running on ${server.info.uri}/docs`);
};

init();
