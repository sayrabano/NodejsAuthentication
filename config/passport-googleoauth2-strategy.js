// required library
const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");


//tell passport to use google login
passport.use(
  // google oauth2 authentication 
  new googleStrategy(
    {
      clientID:
        "1041551690768-5n2sh17gn1hk8k7sd7m8so1927po2ocg.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function (accessToken, refereshToken, profile, done) {
      User.findOne(
        { email: profile.emails[0].value }).exec(function (err, user) {
          if (err) {
            console.log("error in google oauth startegy", err);
            console.log(profile);
            console.log(accessToken,refereshToken)
            return;
          }
          if (user) {
            return done(null, user);
          } else {
            User.create(
              {
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString("hex"),
              },
              function (err, user) {
                if (err) {
                  console.log("error in google oauth startegy", err);
                  return;
                }
                return done(null, user);
              }
            );
          }
        })
      
    }
  )
);
// exporting passport
module.exports = passport;