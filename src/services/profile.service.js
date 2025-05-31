const axios = require("axios");
const mongoose = require("mongoose");
const Profile = require("../models/profile.model");
const Jobs = require("../models/job.model");
const { uploadToGCS, deleteFromGCS } = require("../utils/gcp.util");
const CustomError = require("../utils/error.util");
const env = require("../configs/env.config");

const getUserProfile = async (user) => {
  try {
    const profile = await Profile.findOne({ userId: user._id })
      .populate("userId", "username email verifiedAt")
      .populate({
        path: "bookmarkJobs",
        select: "url jobPosition employmentType",
        populate: {
          path: "companyId",
          select: "name",
        },
      });

    if (!profile) {
      return ResponseAPI.error(h, "Profile not found", 404);
    }

    const updated = profile.toObject();
    updated.user = profile.userId;
    delete updated.userId;
    updated.bookmarkJobs = updated.bookmarkJobs.map((job) => {
      const jobObj = { ...job };
      jobObj.company = jobObj.companyId;
      delete jobObj.companyId;
      return jobObj;
    });
    return updated;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};
const updateUserProfile = async (user, payload) => {
  try {
    const profile = await Profile.findOne({ userId: user._id })
      .populate("userId", "username email verifiedAt")
      .populate({
        path: "bookmarkJobs",
        select: "url jobPosition employmentType",
        populate: {
          path: "companyId",
          select: "name",
        },
      });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    const { fullname, phone, domicile, lastEducation, portfolioUrl } = payload;
    if (fullname) profile.fullname = fullname;
    if (phone) profile.phone = phone;
    if (domicile) profile.domicile = domicile;
    if (lastEducation) profile.lastEducation = lastEducation;
    if (portfolioUrl) profile.portfolioUrl = portfolioUrl;

    await profile.save();

    const updated = profile.toObject();
    updated.user = profile.userId;
    delete updated.userId;
    updated.bookmarkJobs = updated.bookmarkJobs.map((job) => {
      const jobObj = { ...job };
      jobObj.company = jobObj.companyId;
      delete jobObj.companyId;
      return jobObj;
    });

    return updated;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

const updateUserTagPreferences = async (user, tagPreferences) => {
  try {
    const profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    if (!tagPreferences || !tagPreferences.length) {
      throw new CustomError("Tag preferences is required", 400);
    }

    profile.tagPreferences = tagPreferences;
    await profile.save();

    return profile.tagPreferences;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

const addUserBookmarkJobs = async (user, jobId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new CustomError("Job not found", 404);
    }
    const job = await Jobs.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404);
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $addToSet: { bookmarkJobs: new mongoose.Types.ObjectId(jobId) } },
      { new: true }
    );

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return profile.bookmarkJobs;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

const deleteUserBookmarkJobs = async (user, jobId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new CustomError("Job not found", 404);
    }
    const job = await Jobs.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404);
    }
    const profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    const jobIndex = profile.bookmarkJobs.findIndex(
      (id) => id.toString() === jobId
    );

    if (jobIndex === -1) {
      throw new CustomError("Job not found in bookmarks", 404);
    }

    profile.bookmarkJobs.splice(jobIndex, 1);
    await profile.save();

    return profile.bookmarkJobs;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

const updateProfilePhoto = async (user, photo) => {
  try {
    const profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    if (!photo || !photo._data) {
      throw new CustomError("Photo is required", 400);
    }

    const photoSize = photo._data.length;
    if (photoSize > 5 * 1024 * 1024) {
      throw new CustomError("Photo size must not be larger than 5MB", 400);
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const photoType = photo.hapi.headers["content-type"];
    if (!validImageTypes.includes(photoType)) {
      throw new CustomError(
        "Invalid photo type. Allowed types are JPEG, PNG, GIF",
        400
      );
    }

    if (profile.photoUrl) {
      await deleteFromGCS(profile.photoUrl);
    }

    const photoName = photo.hapi.filename.replace(/\s/g, "-");
    const photoPath = `photos/${user._id}/${photoName}`;
    const photoUrl = await uploadToGCS(photo._data, photoPath, photoType);

    profile.photoUrl = photoUrl;

    await profile.save();

    return profile.photoUrl;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

const updateProfileCV = async (user, cv) => {
  try {
    const profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    if (!cv || !cv._data) {
      throw new CustomError("CV is required", 400);
    }

    const cvSize = cv._data.length;
    if (cvSize > 5 * 1024 * 1024) {
      throw new CustomError("CV size must not be larger than 5MB", 400);
    }

    const validCVTypes = ["application/pdf"];
    const cvType = cv.hapi.headers["content-type"];
    if (!validCVTypes.includes(cvType)) {
      throw new CustomError("Invalid CV type. Allowed types are PDF", 400);
    }

    if (profile.cvUrl) {
      await deleteFromGCS(profile.cvUrl);
    }

    const cvName = cv.hapi.filename.replace(/\s/g, "-");
    const cvPath = `user_cv/${user._id}/${cvName}`;
    const cvUrl = await uploadToGCS(cv._data, cvPath, cvType);

    await axios.post(
      `${env.mlServiceUrl}/recommendation-engine/cv_embeddings`,
      {
        cv_storage_url: cvUrl,
        user_id: user._id,
      }
    );

    profile.cvUrl = cvUrl;

    await profile.save();

    return profile.cvUrl;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(err.message, 500);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserTagPreferences,
  addUserBookmarkJobs,
  deleteUserBookmarkJobs,
  updateProfilePhoto,
  updateProfileCV,
};
