import { Router } from "express";
import {
  createStudioReview,
  deleteStudioReview,
  getStudioReview,
  clearNotification,
} from "../controller/reviewController";

const router = Router();

router
  .route("/create-review-studio/:accountID/:studioID")
  .post(createStudioReview);

router.route("/get-review-studio/:studioID").get(getStudioReview);

router.route("/clear-notification/:id").patch(clearNotification);
router
  .route("/delete-review-studio/:accountID/:studioID/:studioReviewID")
  .delete(deleteStudioReview);

export default router;
