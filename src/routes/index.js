const authRoutes = require("./auth.route");
const profileRoutes = require("./profile.route");

module.exports = [...authRoutes, ...profileRoutes];
