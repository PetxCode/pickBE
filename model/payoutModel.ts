import mongoose, { Document, Schema, model } from "mongoose";

interface iStudio {
  ownerID: string;
  studioID: string;
  name: string;
  studioName: string;
  amount: string;
  status: string;
  action: string;
  request: string;
  requestID: string;
    user: {};
}

interface iStudioData extends iStudio, Document {}

const payoutModel = new Schema<iStudioData>(
  {
    ownerID: {
      type: String,
        },
      
    studioID: {
      type: String,
        },
      
    requestID: {
      type: String,
        },
      
    request: {
      type: String,
    },
    name: {
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
        default: "in-view"
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

export default model<iStudioData>("payouts", payoutModel);
