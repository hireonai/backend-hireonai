const Hapi = require("@hapi/hapi");
const connectDB = require("./config/database.js");
const env = require("./config/env.js");

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

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
