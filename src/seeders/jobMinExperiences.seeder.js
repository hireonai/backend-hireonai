const mongoose = require("mongoose");
const jobMinExperience = require("../models/jobMinExperience.model");
const { mongodbUri } = require("../configs/env.config");
const data = require("../data/jobMinExperiences.json");

async function seedJobMinExperiences() {
  try {
    await mongoose.connect(mongodbUri);
    await jobMinExperience.deleteMany();
    console.log("Job Min Experiences collection cleared!");

    const inserted = await jobMinExperience.insertMany(
      data.map((job_min_experience) => ({
        name: job_min_experience.min_experience,
      }))
    );

    console.log("Job Min Experiences seeded!");
    return inserted.reduce((map, exp) => {
      map[exp.name] = exp._id;
      return map;
    }, {});
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = seedJobMinExperiences;
