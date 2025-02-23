import { Router } from "express";
import {
  makePayment,
  viewVerifyTransaction,
} from "../controller/paymentController";

const router: Router = Router();

router.route("/make-payment-now").post(makePayment);
router.route("/verify/:trxref/:userID").get(viewVerifyTransaction);

export default router;
