const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Jobs = require("../models/job.model");
const { mongodbUri } = require("../configs/env.config");

const jobsPath = path.join(__dirname, "../data/jobs.json");
const rawJobsData = JSON.parse(fs.readFileSync(jobsPath, "utf8"));

const mappedJobsData = rawJobsData.map((job) => ({
  url: job.url,
  companyProfileSrc: job.company_profile_src,
  companyName: job.company_name,
  jobPosition: job.job_position,
  employmentType: job.employment_type,
  workingLocationType: job.working_location_type,
  workingLocation: job.working_location,
  minExperience: job.min_experience,
  salary: job.salary,
  jobDescList: job.job_desc_list,
  jobQualificationsList: job.job_qualification_list,
}));

async function seedJobs() {
  try {
    await mongoose.connect(mongodbUri);

    await Jobs.deleteMany();

    console.log("Jobs collection cleared.");

    await Jobs.insertMany(mappedJobsData);

    console.log("Jobs data seeded successfully!");
  } catch (error) {
    console.error("Seeding error: ", error);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = seedJobs;
