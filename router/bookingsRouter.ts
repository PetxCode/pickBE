import { Router } from "express";
import {
  makeBookings,
  viewAllStudioHBook,
  viewStudioHistory,
  viewUserHistory,
} from "../controller/bookingController";

const router = Router();

router.route("/create-booking/:userID/:studioID").post(makeBookings);
router.route("/view-user-booking/:userID").get(viewUserHistory);
router.route("/view-studio-booking/:studioID").get(viewStudioHistory);

router.route("/view-studio-bookings").get(viewAllStudioHBook);

export default router;
