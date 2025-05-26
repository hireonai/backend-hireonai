const CompanyIndustry = require("../models/companyIndustry.model");
const ResponseAPI = require("../utils/response.util");

const getCompanyIndustries = async (request, h) => {
  try {
    const companyIndustries = await CompanyIndustry.find();

    if (!companyIndustries || companyIndustries.length === 0) {
      throw new Error("Company industries not found");
    }

    return ResponseAPI.success(
      h,
      companyIndustries,
      "Company industries successfully retrieved"
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, 500);
  }
};

module.exports = {
  getCompanyIndustries,
};
