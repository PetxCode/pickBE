"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleControlling_1 = require("../controller/articleControlling");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)().single("articleImage");
const router = (0, express_1.Router)();
router.route("/create-article").post(upload, articleControlling_1.createArticle);
router.route("/read-article").get(articleControlling_1.viewArticles);
router.route("/read-one-article").get(articleControlling_1.viewOneArticle);
exports.default = router;
