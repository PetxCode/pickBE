import { Router } from "express";

import {
  createPayout,
  viewActivities,
  viewOnePayload,
  viewOnePayloadUpdate,
  viewPayouts,
} from "../controller/payoutController";
import { createReport } from "../controller/reportController";

const router: Router = Router();

router.route("/create-payout/:userID/:studioID").post(createPayout);
router.route("/create-report/:userID/:studioID").post(createReport);

router.route("/read-payout").get(viewPayouts);
router.route("/read-activities").get(viewActivities);
router.route("/read-one-payout/:payoutID").get(viewOnePayload);
router.route("/update-one-payout/:payoutID").patch(viewOnePayloadUpdate);

export default router;
