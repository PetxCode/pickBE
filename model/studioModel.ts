import mongoose, { Document, Schema, model } from "mongoose";

interface iAuth {
  accountHolderID: string;
  studioName: string;
  studioCost: number;
  studioRate: number;
  studioLocation: string;
  studioContact: string;
  studioImages: Array<{}>;
  studioRating: Array<{}>;
  studioLikes: Array<{}>;

  user: {};
}

interface iAuthData extends iAuth, Document {}

const authModel = new Schema<iAuthData>(
  {
    accountHolderID: {
      type: String,
    },

    studioRate: {
      type: Number,
      default: 0,
    },

    studioCost: {
      type: Number,
    },

    studioName: {
      type: String,
    },
    studioLocation: {
      type: String,
    },
    studioContact: {
      type: String,
    },
    studioImages: [
      {
        type: String,
      },
    ],

    user: {
      type: mongoose.Types.ObjectId,
      ref: "auths",
    },

    studioRating: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ratings",
      },
    ],

    studioLikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "likes",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<iAuthData>("studioes", authModel);
