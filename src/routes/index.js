const authRoutes = require("./auth.route");
const profileRoutes = require("./profile.route");
const jobRoutes = require("./job.route");
const jobMinExperienceRoutes = require("./jobMinExperience.route");
const jobCategoryRoutes = require("./jobCategory.route");
const companyIndustryRoutes = require("./companyIndustry.route");

// Root route to redirect to documentation
const rootRoute = {
  method: "GET",
  path: "/",
  handler: (request, h) => {
    return h.redirect("/docs");
  },
  options: {
    auth: false,
    description: "Redirect to API documentation",
    tags: ["api"],
  },
};

module.exports = [
  rootRoute, // Add the root route
  ...authRoutes,
  ...profileRoutes,
  ...jobRoutes,
  ...jobMinExperienceRoutes,
  ...jobCategoryRoutes,
  ...companyIndustryRoutes,
];
