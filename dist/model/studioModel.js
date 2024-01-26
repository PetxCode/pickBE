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
    studioPriceDaily: {
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
        type: mongoose_1.default.Types.ObjectId,
        ref: "auths",
    },
    studioRating: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "ratings",
        },
    ],
    studioLikes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "likes",
        },
    ],
    studioReview: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "reviews",
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
exports.default = (0, mongoose_1.model)("studioes", authModel);
