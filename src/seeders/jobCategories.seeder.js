const mongoose = require("mongoose");
const JobCategory = require("../models/jobCategory.model");
const { mongodbUri } = require("../configs/env.config");
const data = require("../data/jobCategories.json");

async function seedJobCategories() {
  try {
    await mongoose.connect(mongodbUri);
    await JobCategory.deleteMany();
    console.log("Job Categories collection cleared!");

    const inserted = await JobCategory.insertMany(
      data.map((category) => ({ name: category.category_name }))
    );

    console.log("Job Categories seeded!");
    return inserted.reduce((map, cat) => {
      map[cat.name] = cat._id;
      return map;
    }, {});
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = seedJobCategories;
