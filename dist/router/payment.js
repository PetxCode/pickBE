"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controller/paymentController");
const router = (0, express_1.Router)();
router.route("/make-payment").post(paymentController_1.makePayment);
router.route("/verify/:trxref").get(paymentController_1.viewVerifyTransaction);
exports.default = router;
