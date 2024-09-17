import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import "../controller/socialController";

const APP_URL_DEPLOY = "http://localhost:5174";

const router: Router = Router();

router
  .route("/login-auth")
  .post((req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: string) => {
      if (err) {
        return res.status(404).json({
          message: err,
        });
      } else if (info) {
        return res.status(404).json({
          message: info,
        });
      }

      res.status(201).json({
        message: "Login successful",
        data: user,
      });
    })(req, res, next);
  });

router
  .route("/login")
  .post(passport.authenticate("local"), function (req: Request, res: Response) {
    res.status(201).json({
      message: "Login successful",
      data: req.user,
    });
  });

router.get("/auth/google-data", (req: any, res: Response) => {
  try {
    console.log(req.session.passport?.user.toString());
    return res.status(200).json({
      message: "data gotten",
      data: req.session.passport?.user.toString(),
    });
  } catch (error) {
    return res.status(404).json({ message: "error" });
  }
});

router.get("/logout", (req: any, res: Response) => {
  try {
    req.session.destory();

    res.clearCookie("connect.sid"); // `connect.sid` is the default name for the session ID cookie

    return res.status(200).json({
      message: "log out",
    });
  } catch (error) {
    return res.status(404).json({ message: "error" });
  }
});

router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/auth/google/callback").get(
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
  }),
  (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: "we have authenticated", data: req.user });
  }
);

export default router;
