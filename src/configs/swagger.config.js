const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Package = require("../../package.json");

module.exports = async function registerSwagger(server) {
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "HireOn.AI API Documentation",
          version: Package.version,
        },
        grouping: "tags",
        documentationPath: "/docs",
      },
    },
  ]);
};
