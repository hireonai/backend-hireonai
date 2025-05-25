const axios = require("axios");
const env = require("../configs/env.config");
const Profile = require("../models/profile.model");
const Job = require("../models/job.model");
const AnalysisResult = require("../models/analysisResult.model");
const JobMinExperiences = require("../models/jobMinExperience.model");
const JobCategories = require("../models/jobCategory.model");
const CompanyIndustries = require("../models/companyIndustry.model");
const Company = require("../models/company.model");
const CustomError = require("../utils/error.util");

const getUserJobDetails = async (user, jobId) => {
  try {
    const job = await Job.findById(jobId)
      .populate({
        path: "categories",
        model: "JobCategories",
        select: "name",
      })
      .populate("minExperienceId", "name");
    const company = await Company.findById(job.companyId._id).populate(
      "industryId",
      "name"
    );
    if (!job) {
      throw new CustomError("Job not found", 404);
    }
    const analysisResult = await AnalysisResult.findOne({
      userId: user._id,
      jobId: jobId,
    }).select(
      "explanation cvRelevanceScore skilIdentificationDict suggestions"
    );

    const updated = job.toObject();
    updated.company = company.toObject();
    updated.company.industry = company.industryId;
    delete updated.company.industryId;
    updated.minExperience = job.minExperienceId;
    delete updated.minExperienceId;
    delete updated.companyId;
    updated.analysisResult = analysisResult;
    return updated;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

const analyzeUserCV = async (user, jobId) => {
  try {
    const profile = await Profile.findOne({ userId: user._id }).select("cvUrl");

    if (!profile || !profile.cvUrl) {
      throw new CustomError("CV not found", 404);
    }

    const job = await Job.findById(jobId)
      .select("jobDescList jobPosition jobQualificationsList minExperienceId")
      .populate("minExperienceId", "name");

    if (!job) {
      throw new CustomError("Job not found", 404);
    }

    const response = await axios.post(
      `${env.mlServiceUrl}/gen-ai-services/cv_job_analysis_flash`,
      {
        cv_url: profile.cvUrl,
        job_details: {
          job_desc_list: job.jobDescList,
          job_position: job.jobPosition,
          job_qualification_list: job.jobQualificationsList,
          min_experience: job.minExperienceId.name,
        },
      }
    );

    const analysisResult = response.data;

    const result = await AnalysisResult.findOneAndUpdate(
      { userId: user._id, jobId },
      {
        cvRelevanceScore: analysisResult.cv_relevance_score,
        explanation: analysisResult.explaination,
        skilIdentificationDict: analysisResult.skill_identification_dict,
        suggestions: analysisResult.suggestions,
      },
      {
        upsert: true,
        new: true,
        fields: {
          cvRelevanceScore: 1,
          skilIdentificationDict: 1,
          suggestions: 1,
          explanation: 1,
        },
      }
    );

    return result;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

const coverLetterUser = async (user, jobId, specificRequest) => {
  try {
    const profile = await Profile.findOne({ userId: user._id }).select("cvUrl");

    if (!profile || !profile.cvUrl) {
      throw new CustomError("CV not found", 404);
    }

    const job = await Job.findById(jobId)
      .select(
        "jobDescList jobPosition jobQualificationsList minExperienceId companyId url workingLocation"
      )
      .populate("minExperienceId", "name")
      .populate("companyId", "name location");

    if (!job) {
      throw new CustomError("Job not found", 404);
    }
    const response = await axios.post(
      `${env.mlServiceUrl}/gen-ai-services/cover_letter_generator`,
      {
        current_date: new Date().toISOString().split("T")[0],
        cv_url: profile.cvUrl,
        job_details: {
          company_location: job.companyId.location,
          company_name: job.companyId.name,
          job_desc_list: job.jobDescList,
          job_position: job.jobPosition,
          job_qualification_list: job.jobQualificationsList,
          min_experience: job.minExperienceId.name,
          url: job.url,
          working_location: job.workingLocation,
        },
        spesific_request: specificRequest,
      }
    );

    return response.data.pdf_url;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

module.exports = {
  getUserJobDetails,
  analyzeUserCV,
  coverLetterUser,
};
