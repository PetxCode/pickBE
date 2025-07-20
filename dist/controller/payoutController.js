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
exports.viewOnePayloadUpdate = exports.viewOnePayload = exports.viewPayouts = exports.viewActivities = exports.createPayout = void 0;
const statusEnums_1 = require("../utils/statusEnums");
const payoutModel_1 = __importDefault(require("../model/payoutModel"));
const authModel_1 = __importDefault(require("../model/authModel"));
const studioModel_1 = __importDefault(require("../model/studioModel"));
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const activityModel_1 = __importDefault(require("../model/activityModel"));
const createPayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { request } = req.body;
        const { userID, studioID } = req.params;
        const user = yield authModel_1.default.findById(userID);
        const studio = yield studioModel_1.default.findById(studioID);
        const payout = yield payoutModel_1.default.create({
            requestID: crypto_1.default.randomBytes(4).toString("hex"),
            request,
            status: "pending",
            name: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
            studioName: studio === null || studio === void 0 ? void 0 : studio.studioName,
            amount: parseInt(request) - 500,
            ownerID: userID,
            studioID,
        });
        yield activityModel_1.default.create({
            action: `A Payout Request`,
            actionDetail: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName} just requested for a payout from his studio named: ${studio === null || studio === void 0 ? void 0 : studio.studioName}`,
            actionInfo: `This is to Notify you that a studio owner just requested a withdrawer from his studio ${studio === null || studio === void 0 ? void 0 : studio.studioName} to collect the sum of ₦${parseInt(request).toLocaleString()}`,
            actionType: "Withdrawer Request",
        });
        let xx = yield authModel_1.default.findByIdAndUpdate(userID, { payoutLeft: (user === null || user === void 0 ? void 0 : user.payoutLeft) - parseInt(request) }, { new: true });
        yield authModel_1.default.findByIdAndUpdate(studio === null || studio === void 0 ? void 0 : studio.accountHolderID, {
            $push: {
                notificationData: {
                    id: studioID,
                    title: `You just made a Request for withdrawer`,
                    message: `${xx === null || xx === void 0 ? void 0 : xx.firstName} your studio ${studio === null || studio === void 0 ? void 0 : studio.studioName} balance will be charged ₦${parseInt(request).toLocaleString()} based of your Request for withdrawer!`,
                    review: "Withdrawer Request",
                    time: payout === null || payout === void 0 ? void 0 : payout.createdAt,
                },
            },
        }, { new: true });
        user === null || user === void 0 ? void 0 : user.payout.push(new mongoose_1.Types.ObjectId(payout === null || payout === void 0 ? void 0 : payout._id));
        user === null || user === void 0 ? void 0 : user.save();
        return res.status(statusEnums_1.status.CREATED).json({
            message: "aerticle has been created",
            status: 201,
            data: payout,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating payout",
            data: error.message,
        });
    }
});
exports.createPayout = createPayout;
const viewActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield activityModel_1.default.find().sort({ createdAt: -1 });
        return res.status(statusEnums_1.status.OK).json({
            message: "aerticle has found",
            status: 200,
            data: article,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error founding article",
            data: error.message,
        });
    }
});
exports.viewActivities = viewActivities;
const viewPayouts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield payoutModel_1.default.find().sort({ createdAt: -1 });
        return res.status(statusEnums_1.status.OK).json({
            message: "aerticle has found",
            status: 200,
            data: article,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error founding article",
            data: error.message,
        });
    }
});
exports.viewPayouts = viewPayouts;
const viewOnePayload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payoutID } = req.params;
        const payout = yield payoutModel_1.default.findById(payoutID);
        return res.status(statusEnums_1.status.OK).json({
            message: "aerticle has found",
            status: 200,
            data: payout,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error founding payout",
            data: error.message,
        });
    }
});
exports.viewOnePayload = viewOnePayload;
const viewOnePayloadUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payoutID } = req.params;
        const { status } = req.body;
        const payout = yield payoutModel_1.default.findByIdAndUpdate(payoutID, {
            status,
        }, { new: true });
        const user = yield authModel_1.default.findById(payout === null || payout === void 0 ? void 0 : payout.ownerID);
        const studio = yield studioModel_1.default.findById(payout === null || payout === void 0 ? void 0 : payout.studioID);
        yield activityModel_1.default.create({
            action: `A Payout Request Status`,
            actionDetail: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName} requested for a payout from his studio named: ${studio === null || studio === void 0 ? void 0 : studio.studioName} has been ${status}`,
            actionInfo: `This is to Notify you that a studio owner who requested for a withdrawer from his studio ${studio === null || studio === void 0 ? void 0 : studio.studioName} to collect the sum of ₦${parseInt(payout === null || payout === void 0 ? void 0 : payout.request).toLocaleString()} has just been ${status}`,
            actionType: "Withdrawer Request Status",
        });
        yield authModel_1.default.findByIdAndUpdate(studio === null || studio === void 0 ? void 0 : studio.accountHolderID, {
            $push: {
                notificationData: {
                    id: payout === null || payout === void 0 ? void 0 : payout.studioID,
                    title: `Your request for withdraw has been ${status}`,
                    message: `${user === null || user === void 0 ? void 0 : user.firstName} your studio ${studio === null || studio === void 0 ? void 0 : studio.studioName} balance will be charged ₦${parseInt(payout === null || payout === void 0 ? void 0 : payout.request).toLocaleString()} based of your Request for withdrawer has been ${status}!`,
                    review: `Withdrawer Request ${status}`,
                    time: payout === null || payout === void 0 ? void 0 : payout.createdAt,
                },
            },
        }, { new: true });
        return res.status(status.OK).json({
            message: "aerticle has found",
            status: 200,
            data: payout,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error founding payout",
            data: error.message,
        });
    }
});
exports.viewOnePayloadUpdate = viewOnePayloadUpdate;
