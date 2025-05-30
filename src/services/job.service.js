const axios = require("axios");
const mongoose = require("mongoose");
const env = require("../configs/env.config");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const Job = require("../models/job.model");
const AnalysisResult = require("../models/analysisResult.model");
const JobMinExperiences = require("../models/jobMinExperience.model");
const JobCategories = require("../models/jobCategory.model");
const CompanyIndustries = require("../models/companyIndustry.model");
const Company = require("../models/company.model");
const CustomError = require("../utils/error.util");
const { verifyToken } = require("../utils/token.util");

const createPaginationResponse = (page, limit, totalItems) => {
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

const getUserJobs = async (request) => {
  const {
    keyword,
    minSalary,
    maxSalary,
    experience,
    category,
    industry,
    page = 1,
    limit = 10,
  } = request.query;
  const filters = {
    keyword,
    minSalary,
    maxSalary,
    experience,
    category,
    industry,
  };

  const paginationParams = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    let user = null;
    const authHeader = request.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");

      try {
        const decoded = verifyToken(token);

        if (!decoded || !decoded.userId) {
          throw new CustomError("Invalid token", 401);
        }

        user = await User.findById(decoded.userId);

        if (!user) {
          throw new CustomError("User not found", 404);
        }
      } catch (err) {
        throw new CustomError(err.message || "Forbidden to access", 403);
      }
    }

    let result;

    if (!user) {
      result = await getJobsForGuest(filters, paginationParams);
    } else {
      const profile = await Profile.findOne({ userId: user._id });

      if (profile?.cvUrl) {
        result = await getJobsWithRecommendation(
          profile.cvUrl,
          filters,
          paginationParams
        );
      } else {
        result = await getJobsWithPreferences(
          profile.tagPreferences,
          filters,
          paginationParams
        );
      }
    }

    return result;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

const buildFilterQuery = async (filters = {}) => {
  const query = {};
  const conditions = [];

  if (filters.keyword) {
    const keywordRegex = new RegExp(filters.keyword, "i");
    conditions.push({
      $or: [
        { jobPosition: keywordRegex },
        { jobDescList: keywordRegex },
        { jobQualificationsList: keywordRegex },
        { workingLocation: keywordRegex },
      ],
    });
  }

  if (filters.minSalary || filters.maxSalary) {
    const salaryCondition = {};
    if (filters.minSalary) {
      salaryCondition.$gte = filters.minSalary;
    }
    if (filters.maxSalary) {
      salaryCondition.$lte = filters.maxSalary;
    }
    conditions.push({
      $or: [{ minSalary: salaryCondition }, { maxSalary: salaryCondition }],
    });
  }

  if (filters.experience) {
    conditions.push({
      minExperienceId: new mongoose.Types.ObjectId(filters.experience),
    });
  }

  if (filters.category) {
    conditions.push({
      categories: { $in: [new mongoose.Types.ObjectId(filters.category)] },
    });
  }

  if (filters.industry) {
    const companyIds = await Company.find({
      industryId: new mongoose.Types.ObjectId(filters.industry),
    }).select("_id");

    if (companyIds.length > 0) {
      conditions.push({
        companyId: { $in: companyIds.map((comp) => comp._id) },
      });
    }
  }

  if (conditions.length > 0) {
    query.$and = conditions;
  }

  return query;
};

const formatJobs = (jobDocs, companyMap, scoreMatch = null) => {
  return jobDocs.map((job) => {
    const jobObj = job.toObject ? job.toObject() : job;
    const company = companyMap.get(job.companyId?._id?.toString());

    if (company) {
      const companyObj = company.toObject ? company.toObject() : company;
      jobObj.company = {
        _id: companyObj._id,
        name: companyObj.name,
        industry: companyObj.industryId || companyObj.industry,
      };
    }

    jobObj.minExperience = job.minExperienceId;
    delete jobObj.minExperienceId;
    delete jobObj.companyId;
    jobObj.scoreMatch = scoreMatch;

    return jobObj;
  });
};

const getJobsForGuest = async (filters = {}, paginationParams = {}) => {
  const { page = 1, limit = 10 } = paginationParams;
  const skip = (page - 1) * limit;

  const filterQuery = await buildFilterQuery(filters);

  const totalItems = await Job.countDocuments(filterQuery);

  const jobs = await Job.find(filterQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "categories",
      model: "JobCategories",
      select: "name",
    })
    .populate("minExperienceId", "name")
    .populate("companyId", "name industryId")
    .lean();

  const companyIds = jobs.map((j) => j.companyId?._id).filter(Boolean);
  const companies = await Company.find({ _id: { $in: companyIds } })
    .select("name industryId")
    .populate("industryId", "name")
    .lean();

  const companyMap = new Map(companies.map((c) => [c._id.toString(), c]));

  return {
    jobs: formatJobs(jobs, companyMap, null),
    pagination: createPaginationResponse(page, limit, totalItems),
  };
};

const getJobsWithRecommendation = async (
  cvUrl,
  filters = {},
  paginationParams = {}
) => {
  const { page = 1, limit = 10 } = paginationParams;

  const response = await axios.post(
    `${env.mlServiceUrl}/recommendation-engine/recommendations`,
    { cv_storage_url: cvUrl }
  );

  const recommendations = response.data.recommendations;
  const recommendedIds = recommendations.map(
    (r) => new mongoose.Types.ObjectId(r.job_id)
  );

  const filterQuery = await buildFilterQuery(filters);
  const baseQuery = { _id: { $in: recommendedIds } };

  const finalQuery =
    Object.keys(filterQuery).length > 0
      ? { $and: [baseQuery, filterQuery] }
      : baseQuery;

  // Get total count for pagination
  const totalItems = await Job.countDocuments(finalQuery);

  // Calculate pagination for recommendations
  const skip = (page - 1) * limit;
  const paginatedRecommendations = recommendations.slice(skip, skip + limit);

  const jobDocs = await Job.find({
    _id: {
      $in: paginatedRecommendations.map(
        (r) => new mongoose.Types.ObjectId(r.job_id)
      ),
    },
  })
    .populate({
      path: "categories",
      model: "JobCategories",
      select: "name",
    })
    .populate("minExperienceId", "name");

  const jobMap = new Map(jobDocs.map((job) => [job._id.toString(), job]));

  const companyIds = jobDocs.map((job) => job.companyId?._id).filter(Boolean);
  const companies = await Company.find({
    _id: { $in: companyIds },
  })
    .select("name")
    .populate("industryId", "name");

  const companyMap = new Map(companies.map((c) => [c._id.toString(), c]));

  const scoreMap = new Map(
    recommendations.map((r) => [r.job_id, r.similarity_score])
  );

  const orderedJobs = paginatedRecommendations
    .map((r) => jobMap.get(r.job_id))
    .filter(Boolean);

  const formattedJobs = formatJobs(orderedJobs, companyMap).map((job) => ({
    ...job,
    scoreMatch: `${scoreMap.get(job._id.toString()).toFixed(1)}%`,
  }));

  return {
    jobs: formattedJobs,
    pagination: createPaginationResponse(page, limit, totalItems),
  };
};

const getJobsWithPreferences = async (
  tagPreferences,
  filters = {},
  paginationParams = {}
) => {
  const { page = 1, limit = 10 } = paginationParams;
  const skip = (page - 1) * limit;

  if (!tagPreferences || tagPreferences.length === 0) {
    return await getJobsForGuest(filters, paginationParams);
  }

  const preferenceQuery = {
    $or: [
      {
        categories: {
          $in: await JobCategories.find({
            name: { $in: tagPreferences.map((p) => new RegExp(p, "i")) },
          }).select("_id"),
        },
      },
      {
        jobPosition: { $in: tagPreferences.map((p) => new RegExp(p, "i")) },
      },
      {
        employmentType: { $in: tagPreferences.map((p) => new RegExp(p, "i")) },
      },
      {
        workingLocationType: {
          $in: tagPreferences.map((p) => new RegExp(p, "i")),
        },
      },
      {
        workingLocation: { $in: tagPreferences.map((p) => new RegExp(p, "i")) },
      },
      {
        jobDescList: { $in: tagPreferences.map((p) => new RegExp(p, "i")) },
      },
      {
        jobQualificationsList: {
          $in: tagPreferences.map((p) => new RegExp(p, "i")),
        },
      },
    ],
  };

  const filterQuery = await buildFilterQuery(filters);
  const finalQuery =
    Object.keys(filterQuery).length > 0
      ? { $and: [preferenceQuery, filterQuery] }
      : preferenceQuery;

  // Get total count for pagination
  const totalItems = await Job.countDocuments(finalQuery);

  const jobs = await Job.find(finalQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "categories",
      model: "JobCategories",
      select: "name",
    })
    .populate("minExperienceId", "name")
    .populate("companyId", "name industryId")
    .lean();

  const companyIds = jobs.map((j) => j.companyId?._id).filter(Boolean);
  const companies = await Company.find({ _id: { $in: companyIds } })
    .select("name industryId")
    .populate("industryId", "name")
    .lean();

  const filteredCompanies = companies.filter((company) => {
    const companyMatches = tagPreferences.some(
      (pref) =>
        company.name.toLowerCase().includes(pref.toLowerCase()) ||
        company.industryId?.name?.toLowerCase().includes(pref.toLowerCase())
    );
    return companyMatches;
  });

  const companyMap = new Map(companies.map((c) => [c._id.toString(), c]));

  const experienceLevels = await JobMinExperiences.find({
    name: { $in: tagPreferences.map((p) => new RegExp(p, "i")) },
  }).select("_id");

  let filteredJobs = jobs;

  if (experienceLevels.length > 0) {
    const expIds = experienceLevels.map((exp) => exp._id.toString());
    filteredJobs = jobs.filter((job) =>
      expIds.includes(job.minExperienceId?._id?.toString())
    );
  }

  if (filteredCompanies.length > 0) {
    const preferredCompanyIds = filteredCompanies.map((c) => c._id.toString());
    const companyJobs = jobs.filter((job) =>
      preferredCompanyIds.includes(job.companyId?._id?.toString())
    );

    const allJobIds = new Set([
      ...filteredJobs.map((j) => j._id.toString()),
      ...companyJobs.map((j) => j._id.toString()),
    ]);

    filteredJobs = jobs.filter((job) => allJobIds.has(job._id.toString()));
  }

  return {
    jobs: formatJobs(filteredJobs, companyMap, null),
    pagination: createPaginationResponse(page, limit, totalItems),
  };
};

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
  getUserJobs,
  getUserJobDetails,
  analyzeUserCV,
  coverLetterUser,
};
