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
exports.viewStudioHistory = exports.viewUserHistory = exports.makeBookings = void 0;
const authModel_1 = __importDefault(require("../model/authModel"));
const historyModel_1 = __importDefault(require("../model/historyModel"));
const mongoose_1 = require("mongoose");
const statusEnums_1 = require("../utils/statusEnums");
const studioModel_1 = __importDefault(require("../model/studioModel"));
const makeBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, studioID } = req.params;
        const { bookedDate } = req.body;
        const getUser = yield authModel_1.default.findById(userID);
        const getStudio = yield studioModel_1.default.findById(studioID);
        if (getUser) {
            if (getStudio) {
                const bookings = yield historyModel_1.default.create({
                    bookedDate,
                    cost: (getStudio === null || getStudio === void 0 ? void 0 : getStudio.studioPrice) * parseFloat(bookedDate),
                    accountID: userID,
                    studioID,
                });
                getStudio.history.push(new mongoose_1.Types.ObjectId(bookings._id));
                getStudio.save();
                getUser.history.push(new mongoose_1.Types.ObjectId(bookings._id));
                getUser.save();
                return res.status(404).json({
                    message: "bookings has been recorded",
                    data: {
                        getStudio,
                        getUser,
                    },
                });
            }
            else {
                return res.status(404).json({
                    message: "can't find studio",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "can't find user",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error making bookings",
        });
    }
});
exports.makeBookings = makeBookings;
const viewUserHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const history = yield authModel_1.default.findById(userID).populate({
            path: "history",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing user bookings`,
            data: history,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewUserHistory = viewUserHistory;
const viewStudioHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studioID } = req.params;
        const history = yield studioModel_1.default
            .findById(studioID)
            .populate({
            path: "history",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing studio bookings`,
            data: history,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewStudioHistory = viewStudioHistory;
