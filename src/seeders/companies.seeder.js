const mongoose = require("mongoose");
const Company = require("../models/company.model");
const { mongodbUri } = require("../configs/env.config");
const data = require("../data/companies.json");

async function seedCompanies(industryMap) {
  try {
    await mongoose.connect(mongodbUri);
    await Company.deleteMany();
    console.log("Companies collection cleared!");

    const mappedCompanies = data.map((comp) => ({
      name: comp.company_name,
      description: comp.company_desc,
      profileSrc: comp.company_profile_src,
      location: comp.company_location,
      employeesCount: comp.company_employess_count,
      industryId: industryMap[comp.company_industry.trim()],
    }));

    const inserted = await Company.insertMany(mappedCompanies);

    console.log("Companies seeded!");
    return inserted.reduce((map, comp) => {
      map[comp.name] = comp._id;
      return map;
    }, {});
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = seedCompanies;
