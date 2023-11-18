import mongoose, { Document, Schema, model } from "mongoose";

interface iStudio {
  accountRaterID: string;
  rate: number;
  studio: {};
}

interface iStudioData extends iStudio, Document {}

const studioRatingModel = new Schema<iStudioData>(
  {
    accountRaterID: {
      type: String,
    },
    rate: {
      type: Number,
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

export default model<iStudioData>("ratings", studioRatingModel);
