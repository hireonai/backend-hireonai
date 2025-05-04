const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { findOrCreateUserOAuth } = require("../../services/userService");
const env = require("../../configs/env");
passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      scope: ["profile", "email"], // Pindahkan scope ke sini
    },
    async (accessToken, refreshToken, profile, done) => {
      // Tambahkan parameter yang kurang
      try {
        const user = await findOrCreateUserOAuth({
          email: profile.emails[0].value,
          fullname: profile.displayName,
          photoUrl: profile.photos[0].value,
          oauthProvider: "google",
        });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Tambahkan serializeUser dan deserializeUser
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
