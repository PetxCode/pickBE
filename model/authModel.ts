import mongoose, { Document, Schema, model } from "mongoose";

interface iAuth {
  userName: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  avatarID: string;
  avatar: string;
  verify: boolean;
  verifyToken: string;
  accessStatus: string;
  studio: Array<{}>;
}

interface iAuthData extends iAuth, Document {}

const authModel = new Schema<iAuthData>(
  {
    userName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },
    accessStatus: {
      type: String,
      default: "user",
    },
    verifyToken: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },

    studio: [
      {
        type: mongoose.Types.ObjectId,
        ref: "studioes",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<iAuthData>("auths", authModel);
