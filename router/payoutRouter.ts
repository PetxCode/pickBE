import { Router } from "express";

import { createPayout, viewOnePayload, viewOnePayloadUpdate, viewPayouts } from "../controller/payoutController";


const router: Router = Router();

router.route("/create-payout/:userID/:studioID").post(createPayout);
router.route("/read-payout").get(viewPayouts);
router.route("/read-one-payout/:payoutID").get(viewOnePayload);
router.route("/update-one-payout/:payoutID").patch(viewOnePayloadUpdate);

export default router;
