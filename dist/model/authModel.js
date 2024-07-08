"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const authModel = new mongoose_1.Schema({
    userName: {
        type: String,
    },
    code: {
        type: String,
    },
    bankCode: {
        type: String,
    },
    status: {
        type: String,
    },
    accountName: {
        type: String,
    },
    bankAccount: {
        type: String,
    },
    bankName: {
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
            type: mongoose_1.default.Types.ObjectId,
            ref: "studioes",
        },
    ],
    history: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "histories",
        },
    ],
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("auths", authModel);
