const Hapi = require("@hapi/hapi");
const connectDB = require("./configs/database");
const env = require("./configs/env");
const routes = require("./routes");
const passport = require("./auth/passport");

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

  server.ext("onRequest", (request, h) => {
    passport.initialize()(request.raw.req, request.raw.res, () => {});
    return h.continue;
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
