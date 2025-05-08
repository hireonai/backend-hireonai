const seedJobs = require("./jobs.seeder");

async function runSeeders() {
  await seedJobs();
}

runSeeders();
