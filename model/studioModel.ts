import mongoose, { Document, Schema, model } from "mongoose";

interface iAuth {
  accountHolderID: string;

  studioName: string;
  studioPrice: number;
  studioAddress: string;
  studioContact: string;
  studioImages: Array<{}>;

  studioDescription: string;
  studioCategory: string;
  discountPercent: number;
  numberOfGuess: number;
  includeDiscount: boolean;
  studioFeatures: Array<string>;

  studioRate: number;
  studioRating: Array<{}>;
  studioLikes: Array<{}>;
  studioReview: Array<{}>;

  user: {};
}

interface iAuthData extends iAuth, Document {}

const authModel = new Schema<iAuthData>(
  {
    accountHolderID: {
      type: String,
    },
    studioCategory: {
      type: String,
    },

    studioRate: {
      type: Number,
      default: 0,
    },

    studioPrice: {
      type: Number,
    },

    discountPercent: {
      type: Number,
    },

    studioName: {
      type: String,
    },

    studioDescription: {
      type: String,
    },

    numberOfGuess: {
      type: Number,
    },

    studioFeatures: {
      type: [],
    },

    includeDiscount: {
      type: Boolean,
      default: false,
    },

    studioAddress: {
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

    studioReview: [
      {
        type: mongoose.Types.ObjectId,
        ref: "reviews",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<iAuthData>("studioes", authModel);
