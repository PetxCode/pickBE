"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studioRatingController_1 = require("../controller/studioRatingController");
const router = (0, express_1.Router)();
router.route("/rate-studio/:accountID/:studioID").post(studioRatingController_1.createStudioRating);
router.route("/like-studio/:accountID/:studioID").post(studioRatingController_1.likeStudio);
router
    .route("/unlike-studio/:accountID/:studioID/:likeID")
    .delete(studioRatingController_1.unLikeStudio);
exports.default = router;
