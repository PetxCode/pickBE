import { Application, NextFunction, Request, Response } from "express";
import { status } from "./utils/statusEnums";
import { HTTP, mainError } from "./error/mianError";
import { handleError } from "./error/handleError";
import auth from "./router/authRouter";
import studio from "./router/studioRouter";
import social from "./router/socialRouter";
import rating from "./router/studioRatingRouter";
import jwt from "jsonwebtoken";
import passport from "passport";

const CLIENT_URL = "http://localhost:5173";

export const mainApp = (app: Application) => {
  try {
    app.use("/api/v1", auth);
    app.use("/api/v1", studio);
    app.use("/api/v1", rating);
    app.use("/api/v1", social);

    app.get(
      "/api/v1/auth/google/",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get("/api/v1/sign-in/success", (req, res) => {
      if (req.user) {
        const user: any = req.user;

        const token = jwt.sign({ id: user.id, email: user.email }, "secret");

        res.status(200).json({
          message: "Well done...!",
          data: token,
        });
      }
    });

    app.get("/api/v1/sign-in/failed", (req, res) => {
      res.status(401).json({
        success: false,
        message: "failure",
      });
    });

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/api/v1/sign-in/failed",
        successRedirect: CLIENT_URL,
      }),
      function (req, res) {
        res.redirect("/api/v1/sign-in/success");
      }
    );

    app.get("/", (req: Request, res: Response) => {
      try {
        return res.status(status.OK).json({
          message: "Welcome to Pick a Studio API",
        });
      } catch (error) {
        return res.status(status.BAD).json({
          message: "Error reading default route",
        });
      }
    });

    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(
        new mainError({
          name: `Route Error`,
          message: `Route Error: because the page, ${req.originalUrl} doesn't exist`,
          status: HTTP.BAD_REQUEST,
          success: false,
        })
      );
    });

    app.use(handleError);
  } catch (error) {
    console.log(error);
  }
};
