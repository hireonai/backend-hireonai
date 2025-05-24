const mongoose = require("mongoose");
const CompanyIndustry = require("../models/companyIndustry.model");
const { mongodbUri } = require("../configs/env.config");
const data = require("../data/companyIndustries.json");

async function seedCompanyIndustries() {
  try {
    await mongoose.connect(mongodbUri);
    await CompanyIndustry.deleteMany();
    console.log("Company Industries collection cleared!");

    const inserted = await CompanyIndustry.insertMany(
      data.map((industry) => ({ name: industry.company_industry }))
    );

    console.log("Company Industries seeded!");
    return inserted.reduce((map, ind) => {
      map[ind.name] = ind._id;
      return map;
    }, {});
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = seedCompanyIndustries;
