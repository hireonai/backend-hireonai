const Users = require("../models/user.model");
const Profiles = require("../models/profile.model");

async function findOrCreateUserOAuth({
  email,
  fullname,
  photoUrl,
  oauthProvider,
}) {
  let user = await Users.findOne({ email });

  if (!user) {
    user = await Users.create({
      email,
      username: email.split("@")[0],
      role: "seeker",
      oauthProvider,
      password: "krocoerikagajagongoding",
      verifiedAt: new Date(),
    });

    await Profiles.create({
      userId: user._id,
      fullname,
      phone: null,
      domicile: null,
      lastEducation: null,
      photoUrl,
      portfolioUrl: null,
      cvUrl: null,
      tagPreferences: [],
      bookmarkJobs: [],
    });
  }

  return user;
}

module.exports = { findOrCreateUserOAuth };
