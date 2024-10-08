import { Request, Response } from "express";
import { status } from "../utils/statusEnums";
import authModel from "../model/authModel";
import studioModel from "../model/studioModel";
import { Types } from "mongoose";
import { multiStreamifier, streamUpload } from "../utils/streamifier";

export const createStudio = async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;
    const {
      studioContact,
      studioCategory,
      studioAddress,
      studioDescription,
      studioFeatures,
      studioPrice,
      numberOfGuess,
      discountPercent,
      studioName,
      studioPriceDaily,
      // includeDiscount,
    } = req.body;

    const account = await authModel.findById(accountID);

    if (account) {
      const studio = await studioModel.create({
        accountHolderID: account._id,
        studioContact,
        studioCategory,
        studioAddress,
        studioDescription,
        studioFeatures,
        studioImages: await multiStreamifier(req),
        studioPrice,
        studioPriceDaily,
        numberOfGuess,
        includeDiscount: true,
        discountPercent,
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
    const account = await studioModel.findById(accountID);

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

export const viewUserStudios = async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;
    const account = await authModel.findById(accountID).populate({
      path: "studio",
      options: {
        createdAt: -1,
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

export const viewAccountStudioByName = async (req: Request, res: Response) => {
  try {
    const { studioName } = req.params;
    const account = await studioModel.findOne({ studioName });

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
    const account = await studioModel.find().sort({ createdAt: -1 });

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
    // const { secure_url }: any = await streamUpload(req);

    if (account && studio) {
      let imagesAdded = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioImages:
            // [...studio.studioImages, secure_url],
            [...studio.studioImages, ...(await multiStreamifier(req))],
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
      let newImage: any = studio.studioImages.filter((el: any) => el !== i);

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

export const searchStudio = async (req: Request, res: Response) => {
  try {
    const { studioCategory } = req.body;
    const account = await studioModel.find({ studioCategory });

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

export const editAccountStudioInfo = async (req: Request, res: Response) => {
  try {
    const { userID, studioID } = req.params;
    const {
      studioName,
      studioPrice,
      studioPriceDaily,
      studioAddress,
      studioDescription,
      discountPercent,
    } = req.body;
    const user = await authModel.findById(userID);

    if (user) {
      const account = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioName,
          studioPrice,
          studioPriceDaily,
          studioAddress,
          studioDescription,
          discountPercent,
        },
        { new: true }
      );
      return res.status(status.OK).json({
        message: `viewing studio`,
        data: account,
      });
    } else {
      return res.status(status.BAD).json({
        message: "error with userID",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const deleteStudio = async (req: Request, res: Response) => {
  try {
    const { accountID, studioID } = req.params;

    const account: any = await authModel.findById(accountID);

    if (account) {
      account?.studio?.pull(new Types.ObjectId(studioID));
      account.save();

      return res.status(status.OK).json({
        message: `studio has been delete`,
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
