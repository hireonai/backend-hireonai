const mongoose = require("mongoose");
const Job = require("../models/job.model");
const { mongodbUri } = require("../configs/env.config");
const data = require("../data/jobs.json");

const parseNumber = (value) => {
  if (!value) return 0;
  return parseInt(String(value).replace(/[^\d]/g, ""), 10);
};

const parseArray = (value) => {
  const matches = value.match(/\[(.*)\]/);
  if (!matches) return [];
  return matches[1].split(",").map((v) => v.trim().replace(/'/g, ""));
};

async function seedJobs({ categoryMap, experienceMap, companyMap }) {
  try {
    await mongoose.connect(mongodbUri);
    await Job.deleteMany();
    console.log("Jobs collection cleared!");

    const mappedJobs = data.map((job) => ({
      categories: parseArray(job.kategori).map((k) => categoryMap[k]),
      url: job.url,
      jobPosition: job.job_position,
      employmentType: job.employment_type,
      workingLocationType: job.working_location_type,
      workingLocation: job.working_location,
      minExperienceId: experienceMap[job.min_experience.trim()],
      minSalary: parseNumber(job.min_salary.trim()),
      maxSalary: parseNumber(job.max_salary.trim()),
      jobDescList: parseArray(job.job_desc_list),
      jobQualificationsList: parseArray(job.job_qualification_list),
      companyId: companyMap[job.company_name.trim()],
    }));

    await Job.insertMany(mappedJobs);
    console.log("Jobs seeded!");
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = seedJobs;
