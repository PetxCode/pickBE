import mongoose, { Document, Schema, model } from "mongoose";

interface iAuth {
  userName: string;
  lastName: string;
  firstName: string;

  contact: string;
  phone: string;
  bio: string;
  profession: string;
  lang: string;
  // category: string;

  status: string;
  email: string;
  code: string;
  password: string;
  avatarID: string;
  avatar: string;
  verify: boolean;
  verifyToken: string;
  accessStatus: string;
  studio: Array<{}>;
  history: Array<{}>;
}

interface iAuthData extends iAuth, Document {}

const authModel = new Schema<iAuthData>(
  {
    userName: {
      type: String,
    },

    code: {
      type: String,
    },

    status: {
      type: String,
    },

    lang: {
      type: String,
    },

    phone: {
      type: String,
    },

    profession: {
      type: String,
    },

    bio: {
      type: String,
    },

    contact: {
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

    history: [
      {
        type: mongoose.Types.ObjectId,
        ref: "histories",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<iAuthData>("auths", authModel);
