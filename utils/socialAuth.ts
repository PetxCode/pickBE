import passport from "passport";
import GoogleStrate from "passport-google-oauth20";

const GoogleStrategy = require("passport-google-oauth20").Strategy;

import decode from "jwt-decode";
import authModel from "../model/authModel";

const GOOGLE_CLIENT_ID =
  "199704572461-g84htr0if8p5ej23l2ukvsgtq2rh288g.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// const GOOGLE_CLIENT_ID =
//   "199704572461-mqftjmpvtc6k62t49ki4mshaocr0e6hf.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";

// http://localhost:3300/auth/google
// https://pick-be.onrender.com/auth/google/callback

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://pick-be.onrender.com/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      callback: any
    ) {
      try {
        console.log(profile);
        console.log(profile.email);

        let email = profile.email;

        const user = await authModel.findOne(email);

        if (user !== null) {
          console.log(profile);
          return callback(null, user);
        } else {
          const newUser = await authModel.create({
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            fullName: profile.displayName,
            userName: profile.name.familyName,
            avatar: profile.photos[0].value,
            password: "",
            verifyToken: "",
            verify: true,
            studio: [],
          });

          return callback(null, newUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
