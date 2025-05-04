const Users = require("../models/Users");
const Profiles = require("../models/Profiles");

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
      roles: "seeker",
      oauthProvider,
      verifiedAt: new Date(),
    });

    await Profiles.create({
      userId: user._id,
      fullname,
      photoUrl,
    });
  }

  return user;
}

module.exports = { findOrCreateUserOAuth };
