import { Router } from "express";
import {
  makePayment,
  viewVerifyTransaction,
} from "../controller/paymentController";

const router: Router = Router();

router.route("/make-payment").post(makePayment);
router.route("/verify/:trxref").get(viewVerifyTransaction);

export default router;
