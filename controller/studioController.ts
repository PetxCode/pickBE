import { Request, Response } from "express";
import { status } from "../utils/statusEnums";
import authModel from "../model/authModel";
import studioModel from "../model/studioModel";
import { Types } from "mongoose";
import { multiStreamifier } from "../utils/streamifier";

export const createStudio = async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;
    const { studioContact, studioLocation, studioName } = req.body;

    const account = await authModel.findById(accountID);

    if (account) {
      const studio = await studioModel.create({
        accountHolderID: account._id,
        studioContact,
        studioLocation,
        studioName,
      });

      account.studio.push(new Types.ObjectId(studio._id));
      account.save();

      return res.status(status.OK).json({
        message: `studio has been added`,
        data: studio,
      });
    } else {
      return res.status(status.BAD).json({
        message: "Account can't be found",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewAccountStudio = async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;
    const account = await authModel.findById(accountID).populate({
      path: "studio",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(status.OK).json({
      message: `viewing studio`,
      data: account,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewAllStudio = async (req: Request, res: Response) => {
  try {
    const account = await studioModel.find();

    return res.status(status.OK).json({
      message: `viewing studio`,
      data: account,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const addStudioImages = async (req: any, res: Response) => {
  try {
    const { accountID, studioID } = req.params;

    const account = await authModel.findById(accountID);
    const studio = await studioModel.findById(studioID);

    if (account && studio) {
      let imagesAdded = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioImages: [
            ...studio.studioImages,
            ...(await multiStreamifier(req)),
          ],
        },
        { new: true }
      );

      return res.status(status.OK).json({
        message: `studio images has been added`,
        data: imagesAdded,
      });
    } else {
      return res.status(status.BAD).json({
        message: "Account can't be found",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const removeStudioImages = async (req: any, res: Response) => {
  try {
    const { accountID, studioID } = req.params;
    const { i } = req.body;

    const account = await authModel.findById(accountID);
    const studio = await studioModel.findById(studioID);

    if (account && studio) {
      let newImage = studio.studioImages.filter((el: any) => el !== i);

      let imagesAdded = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioImages: newImage,
        },
        { new: true }
      );

      return res.status(status.OK).json({
        message: `studio images has been added`,
        data: imagesAdded,
      });
    } else {
      return res.status(status.BAD).json({
        message: "Account can't be found",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};
