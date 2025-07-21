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
  deleteAccountStudioFeature,
  addAccountStudioFeature,
  deleteAccountStudioImage,
  updateStudioInfo,
  viewAccountStudioHistory,
  openStudio,
  blockStudio,
  unbanStudio,
  banStudio,
} from "../controller/studioController";
const upload = multer().array("avatar", 12);
const uploadOne = multer().single("avatar");

const router = Router();

router.route("/view-all-studio/").get(viewAllStudio);
router.route("/view-studio/:accountID").get(viewAccountStudio);

router.route("/view-studio-history/:accountID").get(viewAccountStudioHistory);

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

router
  .route("/remove-studio-feature/:userID/:studioID")
  .patch(deleteAccountStudioFeature);

router
  .route("/delete-studio-image/:userID/:studioID")
  .patch(deleteAccountStudioImage);

router.route("/open-studio/:userID/:studioID").patch(openStudio);

router.route("/close-studio/:userID/:studioID").patch(blockStudio);
router.route("/unban-studio/:studioID").patch(unbanStudio);
router.route("/ban-studio/:studioID").patch(banStudio);

router
  .route("/update-studio-info/:accountID/:studioID")
  .patch(updateStudioInfo);

router
  .route("/add-studio-feature/:userID/:studioID")
  .patch(addAccountStudioFeature);

router.route("/delete-studio/:accountID/:studioID").delete(deleteStudio);

export default router;
