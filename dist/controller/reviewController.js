"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudioReview = exports.getStudioReview = exports.createStudioReview = void 0;
const authModel_1 = __importDefault(require("../model/authModel"));
const mongoose_1 = require("mongoose");
const statusEnums_1 = require("../utils/statusEnums");
const studioModel_1 = __importDefault(require("../model/studioModel"));
const reviewModel_1 = __importDefault(require("../model/reviewModel"));
const createStudioReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID, studioID } = req.params;
        const { review } = req.body;
        const account = yield authModel_1.default.findById(accountID);
        const studio = yield studioModel_1.default
            .findById(studioID)
            .populate({ path: "studioReview" });
        const check = studio === null || studio === void 0 ? void 0 : studio.studioRating.some((el) => el.accountRaterID === accountID);
        if (account && studio) {
            if (check) {
                return res.status(statusEnums_1.status.BAD).json({
                    message: "You've already review",
                });
            }
            else {
                const studioRating = yield reviewModel_1.default.create({
                    accountID: account._id,
                    review,
                });
                studio.studioReview.push(new mongoose_1.Types.ObjectId(studioRating === null || studioRating === void 0 ? void 0 : studioRating._id));
                studio.save();
                return res.status(statusEnums_1.status.OK).json({
                    message: `studio has been reviewed`,
                    data: studioRating,
                });
            }
        }
        else {
            return res.status(statusEnums_1.status.BAD).json({
                message: "Account can't be found",
            });
        }
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.createStudioReview = createStudioReview;
const getStudioReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studioID } = req.params;
        const { review } = req.body;
        const studio = yield studioModel_1.default
            .findById(studioID)
            .populate({ path: "studioReview" });
        return res.status(statusEnums_1.status.OK).json({
            message: `studio has been reviewed`,
            data: studio,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.getStudioReview = getStudioReview;
const deleteStudioReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID, studioID, studioReviewID } = req.params;
        const { review } = req.body;
        const studio = yield studioModel_1.default.findById(studioID);
        const studioReview = yield reviewModel_1.default.findByIdAndDelete(studioReviewID);
        studio.studioReview.pull(new mongoose_1.Types.ObjectId(studioReviewID));
        studio.save();
        return res.status(statusEnums_1.status.OK).json({
            message: `studio review has been deleted`,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.deleteStudioReview = deleteStudioReview;
