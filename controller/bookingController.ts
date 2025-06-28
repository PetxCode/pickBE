import { Request, Response } from "express";
import authModel from "../model/authModel";
import historyModel from "../model/historyModel";
import { Types } from "mongoose";
import { status } from "../utils/statusEnums";
import studioModel from "../model/studioModel";
import {
  completePaymentEmail,
  completePaymentEmailForClient,
  receiptEmail,
} from "../utils/email";
import moment from "moment";

export const makeBookings = async (req: Request, res: Response) => {
  try {
    const { userID, studioID } = req.params;
    const { bookedDate, calendarDate, cost, paymentRef } = req.body;

    const getUser = await authModel.findById(userID);
    const getStudio: any = await studioModel.findById(studioID);

    const studioOwner: any = await authModel.findById(
      getStudio?.accountHolderID
    );

    if (getUser) {
      if (getStudio) {
        let x1 = parseInt(cost.replace(/,/g, ""), 10);

        const result = Object.entries(bookedDate)
          .filter(([_, value]) => value !== 0)
          .map(([key, value]) => `${key}:${value}`)[0];

        let x2 = parseFloat(result.split(":")[1]);

        let x = x1 * x2 + 500;

        console.log(x1, x2, x);

        const ref = await historyModel.find();

        const check = ref.some((el) => {
          return el.paymentRef === paymentRef;
        });

        if (check) {
          return res.status(201).json({
            message: "Already Recorded",
          });
        } else {
          const bookings: any = await historyModel.create({
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

            date: moment(bookings.createdAt).format("LLLL"),
            // date: moment(Date.now()).format("LLLL"),
            calendarDate,
            bookedDate,
            currency: "NGN",
            cost: (parseInt(cost.replace(/,/g, ""), 10) + 500).toLocaleString(),
            paymentRef,
            studioName: getStudio?.studioName,
          };

          completePaymentEmail(getUser, studioData);
          completePaymentEmailForClient(studioOwner, getUser, studioData);

          getStudio.history.push(new Types.ObjectId(bookings._id!));
          getStudio.save();

          getUser.history.push(new Types.ObjectId(bookings._id!));
          getUser.save();

          studioOwner.history.push(new Types.ObjectId(bookings._id!));
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
      } else {
        return res.status(404).json({
          message: "can't find studio",
        });
      }
    } else {
      return res.status(404).json({
        message: "can't find user",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error making bookings",
      data: error.message,
    });
  }
};

export const verifyToBook = async (req: Request, res: Response) => {
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
        message:
          "Invalid calendarDate format. Expected: 'MMM DD, YYYY H:MM AM - MMM DD, YYYY H:MM PM'",
      });
    }

    const startDateTimeStr = parts[0].trim();
    const endDateTimeStr = parts[1].trim();

    // Extract date and time components
    const parseDateTime = (dateTimeStr: string) => {
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

    console.log("=== DEBUGGING VERIFICATION ===");
    console.log("Request start date:", requestStartDate);
    console.log("Request end date:", requestEndDate);
    console.log("Request start time:", startTime);
    console.log("Request end time:", endTime);

    const getStudio: any = await studioModel.findById(studioID);
    if (!getStudio) {
      return res.status(404).json({ message: "Can't find studio" });
    }

    const getUser = await authModel.findById(getStudio?.accountHolderID);
    if (!getUser) {
      return res.status(404).json({ message: "Can't find user" });
    }

    // Get studio with booking history
    const studioWithBookings: any = await studioModel
      .findById(studioID)
      .populate({ path: "history" });

    if (!studioWithBookings) {
      return res.status(404).json({
        message: "Studio not found",
        available: false,
      });
    }

    // Helper function to convert time string to minutes for comparison
    const timeToMinutes = (timeStr: string): number => {
      // Handle different time formats
      let cleanTime = timeStr.trim().toUpperCase();

      // Check if it's 12-hour format (contains AM/PM)
      if (cleanTime.includes("AM") || cleanTime.includes("PM")) {
        const [time, period] = cleanTime.split(/\s*(AM|PM)/);
        const [hours, minutes] = time.split(":").map(Number);

        let hour24 = hours;
        if (period === "PM" && hours !== 12) {
          hour24 += 12;
        } else if (period === "AM" && hours === 12) {
          hour24 = 0;
        }

        return hour24 * 60 + (minutes || 0);
      } else {
        // Assume 24-hour format
        const [hours, minutes] = cleanTime.split(":").map(Number);
        return hours * 60 + (minutes || 0);
      }
    };

    console.log("Existing bookings:", studioWithBookings.history.length);

    // Check for overlapping bookings
    const hasConflict = studioWithBookings.history.some((booking: any) => {
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
      } else {
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
      const datesOverlap =
        requestStartDate === existingStartDate ||
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
        if (
          requestStartDate !== requestEndDate ||
          existingStartDate !== existingEndDate
        ) {
          console.log(
            "Cross-day booking detected - using date-time comparison"
          );

          // Convert to full datetime for proper comparison
          const parseFullDateTime = (dateStr: string, timeStr: string) => {
            const date = new Date(dateStr + " " + timeStr);
            return date.getTime();
          };

          const requestStart = parseFullDateTime(requestStartDate, startTime);
          const requestEnd = parseFullDateTime(requestEndDate, endTime);
          const existingStart = parseFullDateTime(
            existingStartDate,
            existingStartTime
          );
          const existingEnd = parseFullDateTime(
            existingEndDate,
            existingEndTime
          );

          console.log(
            "Request datetime range:",
            new Date(requestStart),
            "to",
            new Date(requestEnd)
          );
          console.log(
            "Existing datetime range:",
            new Date(existingStart),
            "to",
            new Date(existingEnd)
          );

          // Check for datetime overlap
          const hasOverlap =
            requestStart < existingEnd && existingStart < requestEnd;
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
        const hasOverlap =
          requestStartMinutes < bookingEndMinutes &&
          bookingStartMinutes < requestEndMinutes;

        console.log("Same-day overlap:", hasOverlap);
        return hasOverlap;
      } catch (error) {
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
  } catch (error: any) {
    console.error("Booking verification error:", error);
    return res.status(500).json({
      message: "Error verifying booking availability",
      data: error.message,
    });
  }
};

export const viewUserHistory = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const history = await authModel.findById(userID).populate({
      path: "history",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(status.OK).json({
      message: `viewing user bookings`,
      data: history,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewStudioHistory = async (req: Request, res: Response) => {
  try {
    const { studioID } = req.params;
    const history = await studioModel
      .findById(studioID)

      .populate({
        path: "history",
        options: {
          sort: {
            createdAt: -1,
          },
        },
      });
    return res.status(status.OK).json({
      message: `viewing studio bookings`,
      data: history,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewAllStudioHBook = async (req: Request, res: Response) => {
  try {
    const history = await historyModel.find({}).sort({ createdAt: -1 });
    return res.status(status.OK).json({
      message: `viewing all studio bookings`,
      data: history,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};
