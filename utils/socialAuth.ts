import passport from "passport";
import GoogleStrate from "passport-google-oauth20";

const GoogleStrategy = require("passport-google-oauth20").Strategy;

import decode from "jwt-decode";
import authModel from "../model/authModel";

// const GOOGLE_CLIENT_ID = -9MB4kcUdrtNYjLGMqDNoPAWm1-yf";

const GOOGLE_CLIENT_ID =
  "199704572461-g84htr0if8p5ej23l2ukvsgtq2rh288g.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

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
          return callback(null, user);
        } else {
          const newUser = await authModel.create({
            email: profile.emails[0].value,
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
