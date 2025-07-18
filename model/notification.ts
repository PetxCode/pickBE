import mongoose, { Document, Schema, model } from "mongoose";

interface iStudio {
  title: string;
  description: string;
  accountID: string;
  studioID: string;
  calendarDate: string;
  bookedDate: {};
  paymentRef: string;
  cost: number;
  studio: {};
  user: {};
}

interface iStudioData extends iStudio, Document {}

const notificationModel = new Schema<iStudioData>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    accountID: {
      type: String,
    },
    studioID: {
      type: String,
    },

    cost: {
      type: Number,
    },

    paymentRef: {
      type: String,
    },

    bookedDate: {
      type: {},
    },

    calendarDate: {
      type: String,
    },

    studio: {
      type: mongoose.Types.ObjectId,
      ref: "studioes",
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "auths",
    },
  },
  {
    timestamps: true,
  }
);

export default model<iStudioData>("notifications", notificationModel);
