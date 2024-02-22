import { Request, Response } from "express";
import authModel from "../model/authModel";
import historyModel from "../model/historyModel";
import { Types } from "mongoose";
import { status } from "../utils/statusEnums";
import studioModel from "../model/studioModel";

export const makeBookings = async (req: Request, res: Response) => {
  try {
    const { userID, studioID } = req.params;
    const { bookedDate, calendarDate } = req.body;

    const getUser = await authModel.findById(userID);
    const getStudio: any = await studioModel.findById(studioID);

    if (getUser) {
      if (getStudio) {
        const bookings = await historyModel.create({
          calendarDate,
          bookedDate,
          cost: getStudio?.studioPrice * parseFloat(bookedDate) + 500,
          accountID: userID,
          studioID,
        });
        console.log(bookings);
        getStudio.history.push(new Types.ObjectId(bookings._id!));
        getStudio.save();

        getUser.history.push(new Types.ObjectId(bookings._id!));
        getUser.save();

        return res.status(201).json({
          message: "bookings has been recorded",
          data: {
            getStudio,
            getUser,
          },
        });
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
  } catch (error) {
    return res.status(404).json({
      message: "Error making bookings",
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
