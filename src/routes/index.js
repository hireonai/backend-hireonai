const authRoutes = require("./auth.route");
const profileRoutes = require("./profile.route");
const jobRoutes = require("./job.route");

module.exports = [...authRoutes, ...profileRoutes, ...jobRoutes];
