const authRoutes = require("./auth.route");
const profileRoutes = require("./profile.route");
const jobRoutes = require("./job.route");
const jobMinExperienceRoutes = require("./jobMinExperience.route");
const jobCategoryRoutes = require("./jobCategory.route");
const companyIndustryRoutes = require("./companyIndustry.route");

module.exports = [
  ...authRoutes,
  ...profileRoutes,
  ...jobRoutes,
  ...jobMinExperienceRoutes,
  ...jobCategoryRoutes,
  ...companyIndustryRoutes,
];
