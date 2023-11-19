"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dbConfig_1 = require("./utils/dbConfig");
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
require("./utils/socialAuth");
const mainApp_1 = require("./mainApp");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3300;
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
const spec = (0, swagger_jsdoc_1.default)(options);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type",
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
app
    .use((0, cookie_session_1.default)({
    name: `pickStudio`,
    keys: ["pickStudio"],
    maxAge: 2 * 60 * 60 * 100,
}))
    .use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => {
            cb();
        };
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => {
            cb();
        };
    }
    next();
})
    .use(passport_1.default.initialize())
    .use(passport_1.default.session());
(0, mainApp_1.mainApp)(app);
// app.get(
//   "/api/auth/google/",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
app.listen(port, () => {
    console.clear();
    (0, dbConfig_1.dbConfig)();
});
