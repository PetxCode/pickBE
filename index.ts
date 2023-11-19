import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConfig } from "./utils/dbConfig";
import cookieSession from "cookie-session";
import passport from "passport";
import "./utils/socialAuth";
import { mainApp } from "./mainApp";
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";

const app: Application = express();
const port: number | string = process.env.PORT || 3300;

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "PICKASTUDIO - APIv1",
      version: "1.0.0",
      description: "",
      termsOfService: "http://swagger.io/terms/",
      contact: {
        email: "brighterdayscodelab@gmail.com",
      },
      license: {
        name: " Apache 2.0",
        url: " http://www.apache.org/licenses/LICENSE-2.0.html",
        version: "1.0.11",
      },
    },
  },
  servers: {
    url: [
      "http://localhost:3300/api/v1",
      "https://pick-be.onrender.com/api/v1",
    ],
  },
  apis: ["./router/*.ts"],
};

const spec = swaggerDoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(spec));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173, *",
    // methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(helmet());
app.use(morgan("dev"));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user!);
});

app
  .use(
    cookieSession({
      name: `pickStudio`,
      keys: ["pickStudio"],
      maxAge: 2 * 60 * 60 * 100,
    })
  )

  .use((req: any, res: Response, next: NextFunction) => {
    if (req.session && !req.session.regenerate) {
      req.session.regenerate = (cb: any) => {
        cb();
      };
    }
    if (req.session && !req.session.save) {
      req.session.save = (cb: any) => {
        cb();
      };
    }
    next();
  })
  .use(passport.initialize())
  .use(passport.session());

mainApp(app);

// app.get(
//   "/api/auth/google/",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

app.listen(port, () => {
  console.clear();
  dbConfig();
});
