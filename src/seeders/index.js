const seedJobCategories = require("./jobCategories.seeder");
const seedJobMinExperiences = require("./jobMinExperiences.seeder");
const seedCompanyIndustries = require("./companyIndustries.seeder");
const seedCompanies = require("./companies.seeder");
const seedJobs = require("./jobs.seeder");

async function runSeeders() {
  const categoryMap = await seedJobCategories();
  const experienceMap = await seedJobMinExperiences();
  const industryMap = await seedCompanyIndustries();
  const companyMap = await seedCompanies(industryMap);
  await seedJobs({ categoryMap, experienceMap, companyMap });
}

runSeeders();
