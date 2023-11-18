import mongoose, { Document, Schema, model } from "mongoose";

interface iStudio {
  accountLikerID: string;

  studio: {};
}

interface iStudioData extends iStudio, Document {}

const studioLikeModel = new Schema<iStudioData>(
  {
    accountLikerID: {
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

export default model<iStudioData>("likes", studioLikeModel);
