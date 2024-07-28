"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const studioController_1 = require("../controller/studioController");
const upload = (0, multer_1.default)().array("avatar", 12);
const uploadOne = (0, multer_1.default)().single("avatar");
const router = (0, express_1.Router)();
router.route("/view-all-studio/").get(studioController_1.viewAllStudio);
router.route("/view-studio/:accountID").get(studioController_1.viewAccountStudio);
router.route("/view-user-studio/:accountID").get(studioController_1.viewUserStudios);
router.route("/view-studio-one/:studioName").get(studioController_1.viewAccountStudioByName);
router.route("/view-studio-category/").post(studioController_1.searchStudio);
router.route("/create-studio/:accountID").post(upload, studioController_1.createStudio);
router
    .route("/add-studio-image/:accountID/:studioID")
    .post(upload, studioController_1.addStudioImages);
router
    .route("/remove-studio-image/:accountID/:studioID")
    .delete(studioController_1.removeStudioImages);
router
    .route("/edit-studio-info/:userID/:studioID")
    .patch(studioController_1.editAccountStudioInfo);
exports.default = router;
