import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import authModel from "../model/authModel";

const GOOGLE_CLIENT_ID =
  "938639497902-18ng02iae50d323nd5i0gilva0bl4lqk.apps.googleusercontent.com";

const GOOGLE_CLIENT_SECRET = "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";

// const GOOGLE_CLIENT_ID =
//   "76597312158-2o058qto2hgrmbe4ks4a8lbho51i1bd0.apps.googleusercontent.com";

// const GOOGLE_CLIENT_SECRET = "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";

// ${process.env.APP_URL_DEPLOY}
const BACKEND_URL = "http://localhost:3300";
passport.use(
  new Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:3300/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile: any, done: any) => {
      const user = await authModel.findOne({
        email: profile?.emails[0].value,
      });

      if (user) {
        return done(null, user);
      } else {
        await authModel.create({
          email: profile?.emails[0].value,
          verify: true,
        });

        return done(null, user);
      }
    }
  )
);

passport.serializeUser(function (user: any, done) {
  done(null, user._id);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user._id);
});
