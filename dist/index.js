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
const express_session_1 = __importDefault(require("express-session"));
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
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        "https://pickastudionow.web.app",
    ],
    methods: "GET,POST,PUT, PATCH,DELETE",
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
// app.use(
//   cookieSession({
//     name: `pickStudio`,
//     keys: ["pickStudio"],
//     maxAge: 2 * 60 * 60 * 1000,
//   })
// );
app.use((0, express_session_1.default)({
    secret: "pickStudio",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }, // Change this in production
}));
app.use((req, res, next) => {
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
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, mainApp_1.mainApp)(app);
app.listen(port, () => {
    console.clear();
    (0, dbConfig_1.dbConfig)();
});
