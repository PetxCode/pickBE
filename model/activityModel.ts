import mongoose, { Document, Schema, model } from "mongoose";

interface iStudio {
  action: string;
  actionInfo: string;
  actionType: string;
  actionDetail: string;

  amount: string;
  
  status: string;
  request: string;
  requestID: string;
    user: {};
}

interface iStudioData extends iStudio, Document {}

const activityModel = new Schema<iStudioData>(
  {
    action: {
      type: String,
        },
      
    actionInfo: {
      type: String,
        },
      
    requestID: {
      type: String,
        },
      
    request: {
      type: String,
    },
    actionType: {
      type: String,
    },

    actionDetail: {
      type: String,
    },

    amount: {
      type: String,
    },

    status: {
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

export default model<iStudioData>("activitys", activityModel);
