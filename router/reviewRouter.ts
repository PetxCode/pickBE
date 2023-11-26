import { Router } from "express";
import {
  createStudioReview,
  deleteStudioReview,
  getStudioReview,
} from "../controller/reviewController";

const router = Router();

router
  .route("/create-review-studio/:accountID/:studioID")
  .post(createStudioReview);

router.route("/get-review-studio/:accountID/:studioID").get(getStudioReview);
router
  .route("/delete-review-studio/:accountID/:studioID/:studioReviewID")
  .delete(deleteStudioReview);

export default router;
