"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controller/bookingController");
const router = (0, express_1.Router)();
router.route("/create-booking/:userID/:studioID").post(bookingController_1.makeBookings);
router.route("/view-user-booking/:userID").get(bookingController_1.viewUserHistory);
router.route("/view-studio-booking/:studioID").get(bookingController_1.viewStudioHistory);
exports.default = router;
