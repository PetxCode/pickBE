import { Request, Response } from "express";
import studioRatingModel from "../model/studioRatingModel";
import authModel from "../model/authModel";
import { Types } from "mongoose";
import { status } from "../utils/statusEnums";
import studioModel from "../model/studioModel";
import studioLikeModel from "../model/studioLikeModel";
import studioReviewModel from "../model/reviewModel";

export const createStudioReview = async (req: Request, res: Response) => {
  try {
    const { accountID, studioID } = req.params;
    const { review } = req.body;

    const account = await authModel.findById(accountID);
    const studio = await studioModel
      .findById(studioID)
      .populate({ path: "studioReview" });

    const check = studio?.studioRating.some(
      (el: any) => el.accountRaterID === accountID
    );

    if (account && studio) {
      if (check) {
        return res.status(status.BAD).json({
          message: "You've already review",
        });
      } else {
        const studioRating: any = await studioReviewModel.create({
          accountID: account._id,
          review,
        });

        studio.studioReview.push(new Types.ObjectId(studioRating?._id));
        studio.save();

        return res.status(status.OK).json({
          message: `studio has been reviewed`,
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

export const getStudioReview = async (req: Request, res: Response) => {
  try {
    const { accountID, studioID } = req.params;
    const { review } = req.body;

    const account = await authModel.findById(accountID);

    const studio = await studioModel
      .findById(studioID)
      .populate({ path: "studioReview" });

    return res.status(status.OK).json({
      message: `studio has been reviewed`,
      data: studio,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const deleteStudioReview = async (req: Request, res: Response) => {
  try {
    const { accountID, studioID, studioReviewID } = req.params;
    const { review } = req.body;

    const studio: any = await studioModel.findById(studioID);
    const studioReview: any = await studioReviewModel.findByIdAndDelete(
      studioReviewID
    );

    studio.studioReview.pull(new Types.ObjectId(studioReviewID));
    studio.save();

    return res.status(status.OK).json({
      message: `studio review has been deleted`,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};
