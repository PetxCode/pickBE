import mongoose, { Document, Schema, model } from "mongoose";

interface iStudio {
  accountID: string;
  studioID: string;
  bookedDate: string;
  cost: number;
  studio: {};
  user: {};
}

interface iStudioData extends iStudio, Document {}

const historyModel = new Schema<iStudioData>(
  {
    accountID: {
      type: String,
    },
    studioID: {
      type: String,
    },

    cost: {
      type: Number,
    },

    bookedDate: {
      type: String,
    },

    studio: {
      type: mongoose.Types.ObjectId,
      ref: "studioes",
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

export default model<iStudioData>("histories", historyModel);
