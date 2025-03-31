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
    let { rate } = req.body;
    // rate = parseInt(rate);

    // Validate the rate value
    if (rate < 1 || rate > 5) {
      return res.status(status.BAD).json({
        message: "Rate value must be between 1 and 5",
      });
    }

    // Fetch account and studio details
    const account = await authModel.findById(accountID);
    const studio = await studioModel
      .findById(studioID)
      .populate({ path: "studioRating", strictPopulate: false });

    if (!account || !studio) {
      return res.status(status.BAD).json({
        message: "Account or Studio not found",
      });
    }

    // Check if the user has already rated the studio
    const hasRated = studio.studioRating.some(
      (el: any) => el.accountRaterID.toString() === accountID
    );

    if (hasRated) {
      return res.status(status.BAD).json({
        message: "You've already rated this studio",
      });
    }

    // Create a new rating
    const studioRating = await studioRatingModel.create({
      accountRaterID: account._id,
      rate,
    });

    // Add the new rating to the studio's ratings
    studio.studioRating.push(new Types.ObjectId(studioRating._id));

    const studioII: any = await studioModel
      .findById(studioID)
      .populate({ path: "studioRating", strictPopulate: false });

    // Recalculate the studio's average rating
    const totalRatings = studioII?.studioRating.length;

    const totalRateValue = studioII?.studioRating.reduce(
      (sum: number, rating: any) => sum + rating.rate,
      rate // Include the new rate
    );
    const averageRating = parseFloat(
      (totalRateValue / totalRatings).toFixed(2)
    );

    // Update the studio's average rating
    studioII.studioRate = averageRating;
    await studioII.save();

    return res.status(status.OK).json({
      message: "Rating has been added successfully",
      data: {
        studioRating,
        averageRating,
      },
    });
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
