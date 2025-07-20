import { Request, Response } from "express";
import articleModel from "../model/articleModel";
import { status } from "../utils/statusEnums";
import payoutModel from "../model/payoutModel";
import authModel from "../model/authModel";
import studioModel from "../model/studioModel";
import { Types } from "mongoose";
import crypto from "crypto"

export const createPayout = async (req: any, res: Response) => {
  try {
    const { request } = req.body;
    const { userID, studioID } = req.params;


    const user:any= await authModel.findById(userID)
    const studio= await studioModel.findById(studioID)

    const payout:any = await payoutModel.create({
      requestID: crypto.randomBytes(4).toString("hex"),
        request,
      status: "pending",
      name: `${user?.firstName} ${user?.lastName}`,
      studioName: studio?.studioName,
        amount: parseInt(request) - 500,
        ownerID: userID,
      studioID
    });
      
     let xx = await authModel.findByIdAndUpdate(
        userID,
        { payoutLeft: user?.payoutLeft - parseInt(request)},
        { new: true }
      );

      await authModel.findByIdAndUpdate(
                studio?.accountHolderID,
                {
                  $push: {
                    notificationData: {
                      id: studioID,
                      title: `You just made a Request for withdrawer`,
                      message: `${xx?.firstName} your studio ${studio?.studioName} balance will be charged ₦${parseInt(request).toLocaleString()} based of your Request for withdrawer!`,
                      review: "Withdrawer Request",
                      time: payout?.createdAt,
                    },
                  },
                },
                { new: true }
              );
      
      user?.payout.push(new Types.ObjectId(payout?._id));
      user?.save()
      

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

export const viewPayouts = async (req: Request, res: Response) => {
  try {
    const article = await payoutModel.find().sort({ createdAt: -1 });

    return res.status(status.OK).json({
      message: "aerticle has found",
      status: 200,
      data: article,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error founding article",
      data: error.message,
    });
  }
};

export const viewOnePayload = async (req: Request, res: Response) => {
  try {
    const { payoutID } = req.params;
    const payout = await payoutModel.findById(payoutID);

    return res.status(status.OK).json({
      message: "aerticle has found",
      status: 200,
      data: payout,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error founding payout",
      data: error.message,
    });
  }
};

export const viewOnePayloadUpdate = async (req: Request, res: Response) => {
  try {
      const { payoutID } = req.params;
      const { status } = req.body
      
      const payout:any = await payoutModel.findByIdAndUpdate(payoutID, {
          status
      }, { new: true });

 

      const user: any = await authModel.findById(payout?.ownerID);
      const studio = await studioModel.findById(payout?.studioID);
      
      
      await authModel.findByIdAndUpdate(
        studio?.accountHolderID,
        {
          $push: {
            notificationData: {
              id: payout?.studioID,
              title: `Your request for withdraw has been ${status}`,
              message: `${user?.firstName} your studio ${
                studio?.studioName
              } balance will be charged ₦${parseInt(
                payout?.request
              ).toLocaleString()} based of your Request for withdrawer has been ${status}!`,
              review: `Withdrawer Request ${status}`,
              time: payout?.createdAt,
            },
          },
        },
        { new: true }
      );

    return res.status(status.OK).json({
      message: "aerticle has found",
      status: 200,
      data: payout,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error founding payout",
      data: error.message,
    });
  }
};
