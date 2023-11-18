import { Router } from "express";

import {
  createStudioRating,
  likeStudio,
  unLikeStudio,
} from "../controller/studioRatingController";

const router = Router();

router.route("/rate-studio/:accountID/:studioID").post(createStudioRating);

router.route("/like-studio/:accountID/:studioID").post(likeStudio);
router
  .route("/unlike-studio/:accountID/:studioID/:likeID")
  .delete(unLikeStudio);

export default router;
