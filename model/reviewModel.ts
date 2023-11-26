import mongoose, { Document, Schema, model } from "mongoose";

interface iStudio {
  accountID: string;
  review: string;
  studio: {};
}

interface iStudioData extends iStudio, Document {}

const studioReviewModel = new Schema<iStudioData>(
  {
    accountID: {
      type: String,
    },

    review: {
      type: String,
    },

    studio: {
      type: mongoose.Types.ObjectId,
      ref: "studioes",
    },
  },
  {
    timestamps: true,
  }
);

export default model<iStudioData>("reviews", studioReviewModel);
