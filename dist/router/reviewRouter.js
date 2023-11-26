"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controller/reviewController");
const router = (0, express_1.Router)();
router
    .route("/create-review-studio/:accountID/:studioID")
    .post(reviewController_1.createStudioReview);
router.route("/get-review-studio/:accountID/:studioID").get(reviewController_1.getStudioReview);
router
    .route("/delete-review-studio/:accountID/:studioID/:studioReviewID")
    .delete(reviewController_1.deleteStudioReview);
exports.default = router;
