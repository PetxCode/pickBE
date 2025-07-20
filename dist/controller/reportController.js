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
exports.createReport = void 0;
const statusEnums_1 = require("../utils/statusEnums");
const authModel_1 = __importDefault(require("../model/authModel"));
const studioModel_1 = __importDefault(require("../model/studioModel"));
const mongoose_1 = require("mongoose");
const activityModel_1 = __importDefault(require("../model/activityModel"));
const reportModel_1 = __importDefault(require("../model/reportModel"));
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { request } = req.body;
        const { userID, studioID } = req.params;
        const user = yield authModel_1.default.findById(userID);
        const studio = yield studioModel_1.default.findById(studioID);
        const payout = yield reportModel_1.default.create({
            complain: request,
            reporter: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName} `,
            studioName: studio === null || studio === void 0 ? void 0 : studio.studioName,
            //   6874eca68216d754f7337426
        });
        yield activityModel_1.default.create({
            action: `Report a complain`,
            actionDetail: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName} just report a concern about: ${studio === null || studio === void 0 ? void 0 : studio.studioName} studio`,
            actionInfo: `This is to Notify you that a there is a serious concern about this studio ${studio === null || studio === void 0 ? void 0 : studio.studioName} `,
            request,
            actionType: "Report Complain",
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
exports.createReport = createReport;
