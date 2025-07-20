import mongoose, { Document, Schema, model } from "mongoose";

interface iStudio {
  complain: string;
  studioName: string;
  reporter: string;
  amount: string;
  status: string;
  action: string;
  user: {};
}

interface iStudioData extends iStudio, Document {}

const reportModel = new Schema<iStudioData>(
  {
    complain: {
      type: String,
    },

    reporter: {
      type: String,
    },

    studioName: {
      type: String,
    },

    amount: {
      type: String,
    },

    status: {
      type: String,
    },

    action: {
      type: String,
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

export default model<iStudioData>("reports", reportModel);
