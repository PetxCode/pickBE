"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewAllStudioHBook = exports.viewStudioHistory = exports.viewUserHistory = exports.verifyToBook = exports.makeBookings = void 0;
const authModel_1 = __importDefault(require("../model/authModel"));
const historyModel_1 = __importDefault(require("../model/historyModel"));
const mongoose_1 = require("mongoose");
const statusEnums_1 = require("../utils/statusEnums");
const studioModel_1 = __importDefault(require("../model/studioModel"));
const email_1 = require("../utils/email");
const moment_1 = __importDefault(require("moment"));
const activityModel_1 = __importDefault(require("../model/activityModel"));
const makeBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, studioID } = req.params;
        const { bookedDate, calendarDate, cost, paymentRef } = req.body;
        const getUser = yield authModel_1.default.findById(userID);
        const getStudio = yield studioModel_1.default.findById(studioID);
        const studioOwner = yield authModel_1.default.findById(getStudio === null || getStudio === void 0 ? void 0 : getStudio.accountHolderID);
        if (getUser) {
            if (getStudio) {
                let x1 = parseInt(cost.replace(/,/g, ""), 10);
                const result = Object.entries(bookedDate)
                    .filter(([_, value]) => value !== 0)
                    .map(([key, value]) => `${key}:${value}`)[0];
                let x2 = parseFloat(result.split(":")[1]);
                let x = x1 * x2 + 500;
                console.log(x1, x2, x);
                const ref = yield historyModel_1.default.find();
                const check = ref.some((el) => {
                    return el.paymentRef === paymentRef;
                });
                const start = {
                    accountID: userID,
                    studioID,
                    date: Date.now(),
                    // date: moment(Date.now()).format("LLLL"),
                    calendarDate,
                    bookedDate,
                    currency: "NGN",
                    cost: (parseInt(cost.replace(/,/g, ""), 10) + 500).toLocaleString(),
                    paymentRef,
                    studioName: getStudio === null || getStudio === void 0 ? void 0 : getStudio.studioName,
                };
                // completePaymentEmail(getUser, start).then(() => console.log("sent"));
                // completePaymentEmailForClient(studioOwner, getUser, start).then(() =>
                //   console.log("sentII")
                // );
                if (check) {
                    return res.status(201).json({
                        message: "Already Recorded",
                    });
                }
                else {
                    const bookings = yield historyModel_1.default.create({
                        calendarDate,
                        bookedDate,
                        cost: parseInt(cost.replace(/,/g, ""), 10) + 500,
                        accountID: userID,
                        studioID,
                        paymentRef,
                    });
                    const studioData = {
                        accountID: userID,
                        studioID,
                        date: (0, moment_1.default)(bookings.createdAt).format("LLLL"),
                        // date: moment(Date.now()).format("LLLL"),
                        calendarDate,
                        bookedDate,
                        currency: "NGN",
                        cost: (parseInt(cost.replace(/,/g, ""), 10) + 500).toLocaleString(),
                        paymentRef,
                        studioName: getStudio === null || getStudio === void 0 ? void 0 : getStudio.studioName,
                    };
                    yield activityModel_1.default.create({
                        action: `A New Booking Action`,
                        actionDetail: `${getUser === null || getUser === void 0 ? void 0 : getUser.firstName} ${getUser === null || getUser === void 0 ? void 0 : getUser.lastName} just booked ${getStudio === null || getStudio === void 0 ? void 0 : getStudio.studioName}`,
                        actionInfo: `This is to Notify you that a new booking of ${getStudio === null || getStudio === void 0 ? void 0 : getStudio.studioName} has been recorded for ${bookings === null || bookings === void 0 ? void 0 : bookings.calendarDate} and made a payment of ${bookings === null || bookings === void 0 ? void 0 : bookings.cost}`,
                        actionType: "Studio Booking",
                    });
                    yield authModel_1.default.findByIdAndUpdate(userID, {
                        notifationData: [
                            ...getUser === null || getUser === void 0 ? void 0 : getUser.notificationData,
                            {
                                id: bookings._id,
                                bookedDate,
                                calendarDate,
                                title: `You just booked ${getStudio === null || getStudio === void 0 ? void 0 : getStudio.studioName} studio`,
                                message: `Your booking for ${getStudio === null || getStudio === void 0 ? void 0 : getStudio.studioName} studio has been recorded on ${(0, moment_1.default)(bookings.createdAt)}. Please check your history for details.`,
                            },
                        ],
                    }, { new: true });
                    yield authModel_1.default.findByIdAndUpdate(getStudio === null || getStudio === void 0 ? void 0 : getStudio.accountHolderID, {
                        notifationData: [
                            ...getUser === null || getUser === void 0 ? void 0 : getUser.notificationData,
                            {
                                id: bookings._id,
                                bookedDate,
                                calendarDate,
                                title: "New Booking",
                                message: `You have a new booking from ${getUser === null || getUser === void 0 ? void 0 : getUser.userName} for ${getStudio === null || getStudio === void 0 ? void 0 : getStudio.studioName} on ${(0, moment_1.default)(bookings.createdAt).format("LLLL")}`,
                            },
                        ],
                    }, { new: true });
                    (0, email_1.completePaymentEmail)(getUser, studioData);
                    (0, email_1.completePaymentEmailForClient)(studioOwner, getUser, studioData);
                    getStudio.history.push(new mongoose_1.Types.ObjectId(bookings._id));
                    getStudio.save();
                    getUser.notifications.push(new mongoose_1.Types.ObjectId(bookings._id));
                    getUser.history.push(new mongoose_1.Types.ObjectId(bookings._id));
                    getUser.save();
                    studioOwner.history.push(new mongoose_1.Types.ObjectId(bookings._id));
                    studioOwner.save();
                    return res.status(201).json({
                        message: "bookings has been recorded",
                        data: {
                            getStudio,
                            getUser,
                        },
                        status: 201,
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "can't find studio",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "can't find user",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error making bookings",
            data: error.message,
        });
    }
});
exports.makeBookings = makeBookings;
const verifyToBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studioID } = req.params;
        const { calendarDate } = req.body; // Expect format: "Jun 26, 2025 9:00 AM - Jun 26, 2025 4:00 PM"
        // Validate required fields
        if (!calendarDate) {
            return res.status(400).json({
                message: "Missing required field: calendarDate",
            });
        }
        // Parse the date range string
        const parts = calendarDate.split(" - ");
        if (parts.length !== 2) {
            return res.status(400).json({
                message: "Invalid calendarDate format. Expected: 'MMM DD, YYYY H:MM AM - MMM DD, YYYY H:MM PM'",
            });
        }
        const startDateTimeStr = parts[0].trim();
        const endDateTimeStr = parts[1].trim();
        // Extract date and time components
        const parseDateTime = (dateTimeStr) => {
            // Split by last space to separate time and AM/PM
            const lastSpaceIndex = dateTimeStr.lastIndexOf(" ");
            const timePart = dateTimeStr.substring(lastSpaceIndex + 1); // AM or PM
            const beforeTime = dateTimeStr.substring(0, lastSpaceIndex);
            // Split again to get the actual time
            const secondLastSpaceIndex = beforeTime.lastIndexOf(" ");
            const time = beforeTime.substring(secondLastSpaceIndex + 1);
            const datePart = beforeTime.substring(0, secondLastSpaceIndex);
            return {
                date: datePart, // "Jun 26, 2025"
                time: `${time} ${timePart}`, // "9:00 AM"
            };
        };
        const startDateTime = parseDateTime(startDateTimeStr);
        const endDateTime = parseDateTime(endDateTimeStr);
        const requestStartDate = startDateTime.date;
        const requestEndDate = endDateTime.date;
        const startTime = startDateTime.time;
        const endTime = endDateTime.time;
        const getStudio = yield studioModel_1.default.findById(studioID);
        if (!getStudio) {
            return res.status(404).json({ message: "Can't find studio" });
        }
        const getUser = yield authModel_1.default.findById(getStudio === null || getStudio === void 0 ? void 0 : getStudio.accountHolderID);
        if (!getUser) {
            return res.status(404).json({ message: "Can't find user" });
        }
        // Get studio with booking history
        const studioWithBookings = yield studioModel_1.default
            .findById(studioID)
            .populate({ path: "history" });
        if (!studioWithBookings) {
            return res.status(404).json({
                message: "Studio not found",
                available: false,
            });
        }
        // Helper function to convert time string to minutes for comparison
        const timeToMinutes = (timeStr) => {
            // Handle different time formats
            let cleanTime = timeStr.trim().toUpperCase();
            // Check if it's 12-hour format (contains AM/PM)
            if (cleanTime.includes("AM") || cleanTime.includes("PM")) {
                const [time, period] = cleanTime.split(/\s*(AM|PM)/);
                const [hours, minutes] = time.split(":").map(Number);
                let hour24 = hours;
                if (period === "PM" && hours !== 12) {
                    hour24 += 12;
                }
                else if (period === "AM" && hours === 12) {
                    hour24 = 0;
                }
                return hour24 * 60 + (minutes || 0);
            }
            else {
                // Assume 24-hour format
                const [hours, minutes] = cleanTime.split(":").map(Number);
                return hours * 60 + (minutes || 0);
            }
        };
        // Check for overlapping bookings
        const hasConflict = studioWithBookings.history.some((booking) => {
            console.log("\n--- Checking booking ---");
            console.log("Existing booking calendarDate:", booking.calendarDate);
            // Special debug for midnight bookings
            if (booking.calendarDate.includes("12:00 AM")) {
                console.log("🚨 MIDNIGHT BOOKING DETECTED:", booking.calendarDate);
            }
            // Parse existing booking date format (could be different formats)
            let existingStartDate, existingEndDate;
            let existingStartTime, existingEndTime;
            // If existing booking also has the full format, extract just the date
            if (booking.calendarDate.includes(" - ")) {
                const existingParts = booking.calendarDate.split(" - ");
                const existingStartDateTime = parseDateTime(existingParts[0].trim());
                const existingEndDateTime = parseDateTime(existingParts[1].trim());
                existingStartDate = existingStartDateTime.date;
                existingEndDate = existingEndDateTime.date;
                existingStartTime = existingStartDateTime.time;
                existingEndTime = existingEndDateTime.time;
            }
            else {
                // If it's stored as just date or different format
                existingStartDate = booking.calendarDate;
                existingEndDate = booking.calendarDate; // Assume same day
                existingStartTime = booking.startTime;
                existingEndTime = booking.endTime;
            }
            console.log("Existing start date:", existingStartDate);
            console.log("Existing end date:", existingEndDate);
            console.log("Existing start time:", existingStartTime);
            console.log("Existing end time:", existingEndTime);
            // Check if the date ranges overlap at all
            // For date overlap: we need to check if any day in the request overlaps with any day in existing booking
            const datesOverlap = requestStartDate === existingStartDate ||
                requestStartDate === existingEndDate ||
                requestEndDate === existingStartDate ||
                requestEndDate === existingEndDate ||
                // Handle multi-day bookings that might span the same period
                (requestStartDate <= existingEndDate &&
                    requestEndDate >= existingStartDate);
            if (!datesOverlap) {
                console.log("No date overlap - no conflict");
                return false;
            }
            console.log("Dates overlap - checking times...");
            try {
                // For cross-day bookings, we need more complex logic
                if (requestStartDate !== requestEndDate ||
                    existingStartDate !== existingEndDate) {
                    console.log("Cross-day booking detected - using date-time comparison");
                    // Convert to full datetime for proper comparison
                    const parseFullDateTime = (dateStr, timeStr) => {
                        const date = new Date(dateStr + " " + timeStr);
                        return date.getTime();
                    };
                    const requestStart = parseFullDateTime(requestStartDate, startTime);
                    const requestEnd = parseFullDateTime(requestEndDate, endTime);
                    const existingStart = parseFullDateTime(existingStartDate, existingStartTime);
                    const existingEnd = parseFullDateTime(existingEndDate, existingEndTime);
                    console.log("Request datetime range:", new Date(requestStart), "to", new Date(requestEnd));
                    console.log("Existing datetime range:", new Date(existingStart), "to", new Date(existingEnd));
                    // Check for datetime overlap
                    const hasOverlap = requestStart < existingEnd && existingStart < requestEnd;
                    console.log("Cross-day overlap:", hasOverlap);
                    return hasOverlap;
                }
                // Same-day booking logic (original)
                console.log("Same-day booking - using time comparison");
                const requestStartMinutes = timeToMinutes(startTime);
                const requestEndMinutes = timeToMinutes(endTime);
                const bookingStartMinutes = timeToMinutes(existingStartTime);
                const bookingEndMinutes = timeToMinutes(existingEndTime);
                console.log("Request start minutes:", requestStartMinutes);
                console.log("Request end minutes:", requestEndMinutes);
                console.log("Existing start minutes:", bookingStartMinutes);
                console.log("Existing end minutes:", bookingEndMinutes);
                // Check for time overlap
                const hasOverlap = requestStartMinutes < bookingEndMinutes &&
                    bookingStartMinutes < requestEndMinutes;
                console.log("Same-day overlap:", hasOverlap);
                return hasOverlap;
            }
            catch (error) {
                console.error("Error parsing time:", error);
                return false; // If we can't parse the time, assume no conflict
            }
        });
        console.log("\n=== FINAL RESULT ===");
        console.log("Has conflict:", hasConflict);
        // FIXED LOGIC: If there IS a conflict, return unavailable
        if (hasConflict) {
            return res.status(409).json({
                message: "Studio is already booked for this date and time.",
                available: false,
            });
        }
        // If no conflict, return available
        return res.status(200).json({
            message: "Studio is available for booking at this date and time.",
            available: true,
        });
    }
    catch (error) {
        console.error("Booking verification error:", error);
        return res.status(500).json({
            message: "Error verifying booking availability",
            data: error.message,
        });
    }
});
exports.verifyToBook = verifyToBook;
const viewUserHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const history = yield authModel_1.default.findById(userID).populate({
            path: "history",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing user bookings`,
            data: history,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewUserHistory = viewUserHistory;
const viewStudioHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studioID } = req.params;
        const history = yield studioModel_1.default
            .findById(studioID)
            .populate({
            path: "history",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        console.log(history);
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing studio bookings`,
            data: history,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewStudioHistory = viewStudioHistory;
const viewAllStudioHBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield historyModel_1.default.find({}).sort({ createdAt: -1 });
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing all studio bookings`,
            data: history,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewAllStudioHBook = viewAllStudioHBook;
