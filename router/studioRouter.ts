import { Router } from "express";

import multer from "multer";
import {
  addStudioImages,
  createStudio,
  removeStudioImages,
  viewAccountStudio,
  viewAllStudio,
} from "../controller/studioController";

const upload = multer().array("avatar", 12);

const router = Router();

router.route("/view-all-studio/").get(viewAllStudio);
router.route("/view-studio/:accountID").get(viewAccountStudio);

router.route("/create-studio/:accountID").post(createStudio);
router
  .route("/add-studio-image/:accountID/:studioID")
  .post(upload, addStudioImages);

router
  .route("/remove-studio-image/:accountID/:studioID")
  .delete(removeStudioImages);

export default router;
