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
exports.deleteStudio = exports.editAccountStudioInfo = exports.searchStudio = exports.removeStudioImages = exports.addStudioImages = exports.viewAllStudio = exports.viewAccountStudioByName = exports.viewUserStudios = exports.viewAccountStudio = exports.createStudio = void 0;
const statusEnums_1 = require("../utils/statusEnums");
const authModel_1 = __importDefault(require("../model/authModel"));
const studioModel_1 = __importDefault(require("../model/studioModel"));
const mongoose_1 = require("mongoose");
const streamifier_1 = require("../utils/streamifier");
const createStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID } = req.params;
        const { studioContact, studioCategory, studioAddress, studioDescription, studioFeatures, studioPrice, numberOfGuess, discountPercent, studioName, studioPriceDaily,
        // includeDiscount,
         } = req.body;
        const account = yield authModel_1.default.findById(accountID);
        if (account) {
            const studio = yield studioModel_1.default.create({
                accountHolderID: account._id,
                studioContact,
                studioCategory,
                studioAddress,
                studioDescription,
                studioFeatures,
                studioImages: yield (0, streamifier_1.multiStreamifier)(req),
                studioPrice,
                studioPriceDaily,
                numberOfGuess,
                includeDiscount: true,
                discountPercent,
                studioName,
            });
            account.studio.push(new mongoose_1.Types.ObjectId(studio._id));
            account.save();
            return res.status(statusEnums_1.status.OK).json({
                message: `studio has been added`,
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
exports.createStudio = createStudio;
const viewAccountStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID } = req.params;
        const account = yield studioModel_1.default.findById(accountID);
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing studio`,
            data: account,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewAccountStudio = viewAccountStudio;
const viewUserStudios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID } = req.params;
        const account = yield authModel_1.default.findById(accountID).populate({
            path: "studio",
            options: {
                createdAt: -1,
            },
        });
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing studio`,
            data: account,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewUserStudios = viewUserStudios;
const viewAccountStudioByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studioName } = req.params;
        const account = yield studioModel_1.default.findOne({ studioName });
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing studio`,
            data: account,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewAccountStudioByName = viewAccountStudioByName;
const viewAllStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield studioModel_1.default.find().sort({ createdAt: -1 });
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing studio`,
            data: account,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.viewAllStudio = viewAllStudio;
const addStudioImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID, studioID } = req.params;
        const account = yield authModel_1.default.findById(accountID);
        const studio = yield studioModel_1.default.findById(studioID);
        // const { secure_url }: any = await streamUpload(req);
        if (account && studio) {
            let imagesAdded = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                studioImages: 
                // [...studio.studioImages, secure_url],
                [...studio.studioImages, ...(yield (0, streamifier_1.multiStreamifier)(req))],
            }, { new: true });
            return res.status(statusEnums_1.status.OK).json({
                message: `studio images has been added`,
                data: imagesAdded,
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
exports.addStudioImages = addStudioImages;
const removeStudioImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID, studioID } = req.params;
        const { i } = req.body;
        const account = yield authModel_1.default.findById(accountID);
        const studio = yield studioModel_1.default.findById(studioID);
        if (account && studio) {
            let newImage = studio.studioImages.filter((el) => el !== i);
            let imagesAdded = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                studioImages: newImage,
            }, { new: true });
            return res.status(statusEnums_1.status.OK).json({
                message: `studio images has been added`,
                data: imagesAdded,
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
exports.removeStudioImages = removeStudioImages;
const searchStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studioCategory } = req.body;
        const account = yield studioModel_1.default.find({ studioCategory });
        return res.status(statusEnums_1.status.OK).json({
            message: `viewing studio`,
            data: account,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.searchStudio = searchStudio;
const editAccountStudioInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, studioID } = req.params;
        const { studioName, studioPrice, studioPriceDaily, studioAddress, studioDescription, discountPercent, } = req.body;
        const user = yield authModel_1.default.findById(userID);
        if (user) {
            const account = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                studioName,
                studioPrice,
                studioPriceDaily,
                studioAddress,
                studioDescription,
                discountPercent,
            }, { new: true });
            return res.status(statusEnums_1.status.OK).json({
                message: `viewing studio`,
                data: account,
            });
        }
        else {
            return res.status(statusEnums_1.status.BAD).json({
                message: "error with userID",
            });
        }
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: error.message,
        });
    }
});
exports.editAccountStudioInfo = editAccountStudioInfo;
const deleteStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { accountID, studioID } = req.params;
        const account = yield authModel_1.default.findById(accountID);
        if (account) {
            (_a = account === null || account === void 0 ? void 0 : account.studio) === null || _a === void 0 ? void 0 : _a.pull(new mongoose_1.Types.ObjectId(studioID));
            account.save();
            return res.status(statusEnums_1.status.OK).json({
                message: `studio has been delete`,
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
exports.deleteStudio = deleteStudio;
