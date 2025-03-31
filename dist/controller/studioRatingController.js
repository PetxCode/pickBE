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
exports.unLikeStudio = exports.likeStudio = exports.createStudioRating = void 0;
const studioRatingModel_1 = __importDefault(require("../model/studioRatingModel"));
const authModel_1 = __importDefault(require("../model/authModel"));
const mongoose_1 = require("mongoose");
const statusEnums_1 = require("../utils/statusEnums");
const studioModel_1 = __importDefault(require("../model/studioModel"));
const studioLikeModel_1 = __importDefault(require("../model/studioLikeModel"));
const createStudioRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID, studioID } = req.params;
        let { rate } = req.body;
        // rate = parseInt(rate);
        // Validate the rate value
        if (rate < 1 || rate > 5) {
            return res.status(statusEnums_1.status.BAD).json({
                message: "Rate value must be between 1 and 5",
            });
        }
        // Fetch account and studio details
        const account = yield authModel_1.default.findById(accountID);
        const studio = yield studioModel_1.default
            .findById(studioID)
            .populate({ path: "studioRating", strictPopulate: false });
        if (!account || !studio) {
            return res.status(statusEnums_1.status.BAD).json({
                message: "Account or Studio not found",
            });
        }
        // Check if the user has already rated the studio
        const hasRated = studio.studioRating.some((el) => el.accountRaterID.toString() === accountID);
        if (hasRated) {
            return res.status(statusEnums_1.status.BAD).json({
                message: "You've already rated this studio",
            });
        }
        // Create a new rating
        const studioRating = yield studioRatingModel_1.default.create({
            accountRaterID: account._id,
            rate,
        });
        // Add the new rating to the studio's ratings
        studio.studioRating.push(new mongoose_1.Types.ObjectId(studioRating._id));
        const studioII = yield studioModel_1.default
            .findById(studioID)
            .populate({ path: "studioRating", strictPopulate: false });
        // Recalculate the studio's average rating
        const totalRatings = studioII === null || studioII === void 0 ? void 0 : studioII.studioRating.length;
        const totalRateValue = studioII === null || studioII === void 0 ? void 0 : studioII.studioRating.reduce((sum, rating) => sum + rating.rate, rate // Include the new rate
        );
        const averageRating = parseFloat((totalRateValue / totalRatings).toFixed(2));
        // Update the studio's average rating
        studioII.studioRate = averageRating;
        yield studioII.save();
        return res.status(statusEnums_1.status.OK).json({
            message: "Rating has been added successfully",
            data: {
                studioRating,
                averageRating,
            },
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.createStudioRating = createStudioRating;
const likeStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID, studioID } = req.params;
        const account = yield authModel_1.default.findById(accountID);
        const studio = yield studioModel_1.default
            .findById(studioID)
            .populate({ path: "studioLikes" });
        const check = studio === null || studio === void 0 ? void 0 : studio.studioLikes.some((el) => el.accountLikerID === accountID);
        if (account && studio) {
            if (check) {
                return res.status(statusEnums_1.status.BAD).json({
                    message: "You've already like",
                });
            }
            else {
                const studioLiking = yield studioLikeModel_1.default.create({
                    accountLikerID: account._id,
                });
                studio.studioLikes.push(new mongoose_1.Types.ObjectId(studioLiking === null || studioLiking === void 0 ? void 0 : studioLiking._id));
                studio.save();
                return res.status(statusEnums_1.status.OK).json({
                    message: `studio has been added`,
                    data: studioLiking,
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
exports.likeStudio = likeStudio;
const unLikeStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID, studioID, likeID } = req.params;
        const account = yield authModel_1.default.findById(accountID);
        const likeData = yield studioLikeModel_1.default.findByIdAndDelete(likeID);
        const studio = yield studioModel_1.default
            .findById(studioID)
            .populate({ path: "studioLikes" });
        const check = studio === null || studio === void 0 ? void 0 : studio.studioLikes.some((el) => el.accountLikerID === accountID);
        if (account && studio) {
            const studioLike = yield studioModel_1.default.findById(studioID);
            studio.studioLikes.pull(likeID);
            studio.save();
            return res.status(statusEnums_1.status.OK).json({
                message: `studio like has been remove`,
                data: studio,
            });
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
exports.unLikeStudio = unLikeStudio;
