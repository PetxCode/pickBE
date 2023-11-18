import { Request, Response } from "express";
import studioRatingModel from "../model/studioRatingModel";
import authModel from "../model/authModel";
import { Types } from "mongoose";
import { status } from "../utils/statusEnums";
import studioModel from "../model/studioModel";
import studioLikeModel from "../model/studioLikeModel";

export const createStudioRating = async (req: Request, res: Response) => {
  try {
    const { accountID, studioID } = req.params;
    const { rate } = req.body;

    const account = await authModel.findById(accountID);
    const studio = await studioModel
      .findById(studioID)
      .populate({ path: "studioRating" });

    const check = studio?.studioRating.some(
      (el: any) => el.accountRaterID === accountID
    );

    if (account && studio) {
      if (check) {
        return res.status(status.BAD).json({
          message: "You've already rated",
        });
      } else {
        let rateValue = studio?.studioRating
          .map((el: any) => {
            return el.rate;
          })
          .reduce((a: any, b: any) => a + b);
        let totalRaters = studio?.studioRating?.length;

        const studioRating: any = await studioRatingModel.create({
          accountRaterID: account._id,
          rate,
        });

        await studioModel.findByIdAndUpdate(
          studioID,
          {
            studioRate: parseFloat((rateValue / totalRaters!).toFixed(2)),
          },
          { new: true }
        );

        studio.studioRating.push(new Types.ObjectId(studioRating?._id));
        studio.save();

        return res.status(status.OK).json({
          message: `studio has been added`,
          data: studioRating,
        });
      }
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

export const likeStudio = async (req: Request, res: Response) => {
  try {
    const { accountID, studioID } = req.params;

    const account = await authModel.findById(accountID);
    const studio = await studioModel
      .findById(studioID)
      .populate({ path: "studioLikes" });

    const check = studio?.studioLikes.some(
      (el: any) => el.accountLikerID === accountID
    );

    if (account && studio) {
      if (check) {
        return res.status(status.BAD).json({
          message: "You've already like",
        });
      } else {
        const studioLiking: any = await studioLikeModel.create({
          accountLikerID: account._id,
        });

        studio.studioLikes.push(new Types.ObjectId(studioLiking?._id));
        studio.save();

        return res.status(status.OK).json({
          message: `studio has been added`,
          data: studioLiking,
        });
      }
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

export const unLikeStudio = async (req: Request, res: Response) => {
  try {
    const { accountID, studioID, likeID } = req.params;

    const account = await authModel.findById(accountID);
    const likeData = await studioLikeModel.findByIdAndDelete(likeID);

    const studio: any = await studioModel
      .findById(studioID)
      .populate({ path: "studioLikes" });

    const check = studio?.studioLikes.some(
      (el: any) => el.accountLikerID === accountID
    );

    if (account && studio) {
      const studioLike = await studioModel.findById(studioID);

      studio.studioLikes.pull(likeID);
      studio.save();

      return res.status(status.OK).json({
        message: `studio like has been remove`,
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
