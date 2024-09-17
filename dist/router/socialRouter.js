"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
require("../controller/socialController");
const APP_URL_DEPLOY = "http://localhost:5174";
const router = (0, express_1.Router)();
router
    .route("/login-auth")
    .post((req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(404).json({
                message: err,
            });
        }
        else if (info) {
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
    .post(passport_1.default.authenticate("local"), function (req, res) {
    res.status(201).json({
        message: "Login successful",
        data: req.user,
    });
});
router.get("/auth/google-data", (req, res) => {
    var _a, _b;
    try {
        console.log((_a = req.session.passport) === null || _a === void 0 ? void 0 : _a.user.toString());
        return res.status(200).json({
            message: "data gotten",
            data: (_b = req.session.passport) === null || _b === void 0 ? void 0 : _b.user.toString(),
        });
    }
    catch (error) {
        return res.status(404).json({ message: "error" });
    }
});
router.get("/logout", (req, res) => {
    try {
        req.session.destory();
        res.clearCookie("connect.sid"); // `connect.sid` is the default name for the session ID cookie
        return res.status(200).json({
            message: "log out",
        });
    }
    catch (error) {
        return res.status(404).json({ message: "error" });
    }
});
router
    .route("/auth/google")
    .get(passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.route("/auth/google/callback").get(passport_1.default.authenticate("google", {
    successRedirect: "http://localhost:5173/",
}), (req, res) => {
    return res
        .status(200)
        .json({ message: "we have authenticated", data: req.user });
});
exports.default = router;
