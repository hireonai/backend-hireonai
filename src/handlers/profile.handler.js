const Profile = require("../models/profile.model");
const Company = require("../models/company.model");
const ResponseAPI = require("../utils/response.util");
const {
  getUserProfile,
  updateUserProfile,
  updateProfileCV,
  deleteUserProfileCV,
  updateProfilePhoto,
  updateUserTagPreferences,
  addUserBookmarkJobs,
  deleteUserBookmarkJobs,
} = require("../services/profile.service");

const getProfile = async (request, h) => {
  let user = request.auth.credentials;

  try {
    const updated = await getUserProfile(user);

    return ResponseAPI.success(h, updated, "Profile successfully retrieved.");
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

const updateProfile = async (request, h) => {
  const user = request.auth.credentials;
  const payload = request.payload;

  try {
    const updatedProfile = await updateUserProfile(user, payload);
    return ResponseAPI.success(
      h,
      updatedProfile,
      "Profile successfully updated"
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

const updateTagPreferences = async (request, h) => {
  const user = request.auth.credentials;
  const tagPreferences = request.payload.tagPreferences;
  try {
    const updatedTagPreferences = await updateUserTagPreferences(
      user,
      tagPreferences
    );

    return ResponseAPI.success(
      h,
      { updatedTagPreferences },
      "Tag preferences successfully updated."
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

const addBookmarkJobs = async (request, h) => {
  const user = request.auth.credentials;
  const jobId = request.payload.jobId;

  try {
    const updatedBookmarkJobs = await addUserBookmarkJobs(user, jobId);

    return ResponseAPI.success(
      h,
      { updatedBookmarkJobs },
      "Job successfully bookmarked"
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

const deleteBookmarkJobs = async (request, h) => {
  const user = request.auth.credentials;
  const jobId = request.params.jobId;

  try {
    const updatedBookmarkJobs = await deleteUserBookmarkJobs(user, jobId);

    return ResponseAPI.success(
      h,
      { updatedBookmarkJobs },
      "Job successfully removed from bookmarks."
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

const uploadProfileCV = async (request, h) => {
  const user = request.auth.credentials;
  const cv = request.payload.cv;

  try {
    const cvUrl = await updateProfileCV(user, cv);

    return ResponseAPI.success(h, { cvUrl }, "CV successfully uploaded.");
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

const deleteProfileCV = async (request, h) => {
  const user = request.auth.credentials;

  try {
    await deleteUserProfileCV(user);

    return ResponseAPI.success(h, null, "CV successfully deleted.");
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

const uploadProfilePhoto = async (request, h) => {
  const user = request.auth.credentials;
  const photo = request.payload.photo;
  try {
    const photoUrl = await updateProfilePhoto(user, photo);

    return ResponseAPI.success(
      h,
      { photoUrl },
      "Profile photo successfully uploaded."
    );
  } catch (err) {
    return ResponseAPI.error(h, err.message, err.statusCode || 500);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateTagPreferences,
  addBookmarkJobs,
  deleteBookmarkJobs,
  uploadProfileCV,
  deleteProfileCV,
  uploadProfilePhoto,
};
