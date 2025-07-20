import { Request, Response } from "express";
import articleModel from "../model/articleModel";
import { status } from "../utils/statusEnums";
import payoutModel from "../model/payoutModel";
import authModel from "../model/authModel";
import studioModel from "../model/studioModel";
import { Types } from "mongoose";
import crypto from "crypto";
import activityModel from "../model/activityModel";
import reportModel from "../model/reportModel";

export const createReport = async (req: any, res: Response) => {
  try {
    const { request } = req.body;
    const { userID, studioID } = req.params;

    const user: any = await authModel.findById(userID);
    const studio = await studioModel.findById(studioID);

    const payout: any = await reportModel.create({
      complain: request,
      reporter: `${user?.firstName} ${user?.lastName} `,

      studioName: studio?.studioName,

      //   6874eca68216d754f7337426
    });

    await activityModel.create({
      action: `Report a complain`,
      actionDetail: `${user?.firstName} ${user?.lastName} just report a concern about: ${studio?.studioName} studio`,
      actionInfo: `This is to Notify you that a there is a serious concern about this studio ${
        studio?.studioName
      } `,

      request,
      actionType: "Report Complain",
    });

    let xx = await authModel.findByIdAndUpdate(
      userID,
      { payoutLeft: user?.payoutLeft - parseInt(request) },
      { new: true }
    );

    await authModel.findByIdAndUpdate(
      studio?.accountHolderID,
      {
        $push: {
          notificationData: {
            id: studioID,
            title: `You just made a Request for withdrawer`,
            message: `${xx?.firstName} your studio ${
              studio?.studioName
            } balance will be charged ₦${parseInt(
              request
            ).toLocaleString()} based of your Request for withdrawer!`,
            review: "Withdrawer Request",
            time: payout?.createdAt,
          },
        },
      },
      { new: true }
    );

    user?.payout.push(new Types.ObjectId(payout?._id));
    user?.save();

    return res.status(status.CREATED).json({
      message: "aerticle has been created",
      status: 201,
      data: payout,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error creating payout",
      data: error.message,
    });
  }
};
