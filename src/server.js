const Hapi = require("@hapi/hapi");
const env = require("./configs/env.config");
const routes = require("./routes");
const Bell = require("bell");
const Cookie = require("@hapi/cookie");
const connectDB = require("./configs/database.config");
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

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: "auth-session",
      password: env.cookiePassword,
      isSecure: false,
    },
    redirectTo: "/auth/google",
  });

  server.auth.strategy("google", "bell", {
    provider: "google",
    password: env.cookiePassword,
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    isSecure: false,
    scope: ["profile", "email"],
  });

  server.auth.strategy("linkedin", "bell", {
    provider: "linkedin",
    password: env.cookiePassword,
    clientId: env.linkedinClientId,
    clientSecret: env.linkedinClientSecret,
    isSecure: false,
    scope: ["r_liteprofile", "r_emailaddress"],
  });

  server.auth.strategy("facebook", "bell", {
    provider: "facebook",
    password: env.cookiePassword,
    clientId: env.facebookClientId,
    clientSecret: env.facebookClientSecret,
    isSecure: false,
    scope: ["email"],
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
