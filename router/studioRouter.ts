import { Router } from "express";

import multer from "multer";
import {
  addStudioImages,
  createStudio,
  removeStudioImages,
  searchStudio,
  viewAccountStudio,
  viewAccountStudioByName,
  viewAllStudio,
  viewUserStudios,
  editAccountStudioInfo,
  deleteStudio,
} from "../controller/studioController";
const upload = multer().array("avatar", 12);
const uploadOne = multer().single("avatar");

const router = Router();

router.route("/view-all-studio/").get(viewAllStudio);
router.route("/view-studio/:accountID").get(viewAccountStudio);
router.route("/view-user-studio/:accountID").get(viewUserStudios);
router.route("/view-studio-one/:studioName").get(viewAccountStudioByName);

router.route("/view-studio-category/").post(searchStudio);
router.route("/create-studio/:accountID").post(upload, createStudio);
router
  .route("/add-studio-image/:accountID/:studioID")
  .post(upload, addStudioImages);

router
  .route("/remove-studio-delete/:accountID/:studioID")
  .delete(removeStudioImages);

router
  .route("/edit-studio-info/:userID/:studioID")
  .patch(editAccountStudioInfo);

router.route("/delete-studio/:accountID/:studioID").delete(deleteStudio);

export default router;
