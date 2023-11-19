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
    var _a;
    try {
        const { accountID, studioID } = req.params;
        const { rate } = req.body;
        const account = yield authModel_1.default.findById(accountID);
        const studio = yield studioModel_1.default
            .findById(studioID)
            .populate({ path: "studioRating" });
        const check = studio === null || studio === void 0 ? void 0 : studio.studioRating.some((el) => el.accountRaterID === accountID);
        if (account && studio) {
            if (check) {
                return res.status(statusEnums_1.status.BAD).json({
                    message: "You've already rated",
                });
            }
            else {
                let rateValue = studio === null || studio === void 0 ? void 0 : studio.studioRating.map((el) => {
                    return el.rate;
                }).reduce((a, b) => a + b);
                let totalRaters = (_a = studio === null || studio === void 0 ? void 0 : studio.studioRating) === null || _a === void 0 ? void 0 : _a.length;
                const studioRating = yield studioRatingModel_1.default.create({
                    accountRaterID: account._id,
                    rate,
                });
                yield studioModel_1.default.findByIdAndUpdate(studioID, {
                    studioRate: parseFloat((rateValue / totalRaters).toFixed(2)),
                }, { new: true });
                studio.studioRating.push(new mongoose_1.Types.ObjectId(studioRating === null || studioRating === void 0 ? void 0 : studioRating._id));
                studio.save();
                return res.status(statusEnums_1.status.OK).json({
                    message: `studio has been added`,
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
