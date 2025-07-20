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
exports.deleteAccountStudioImage = exports.openStudio = exports.blockStudio = exports.deleteStudio = exports.addAccountStudioFeature = exports.deleteAccountStudioFeature = exports.editAccountStudioInfo = exports.searchStudio = exports.removeStudioImages = exports.addStudioImages = exports.updateStudioInfo = exports.viewAllStudio = exports.viewAccountStudioByName = exports.viewUserStudios = exports.viewAccountStudioHistory = exports.viewAccountStudio = exports.createStudio = void 0;
const statusEnums_1 = require("../utils/statusEnums");
const authModel_1 = __importDefault(require("../model/authModel"));
const studioModel_1 = __importDefault(require("../model/studioModel"));
const mongoose_1 = require("mongoose");
const streamifier_1 = require("../utils/streamifier");
const axios_1 = __importDefault(require("axios"));
const activityModel_1 = __importDefault(require("../model/activityModel"));
const createStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID } = req.params;
        const { studioContact, studioCategory, studioAddress, studioDescription, studioFeatures, studioPrice, numberOfGuess, discountPercent, studioName, studioPriceDaily,
        // includeDiscount,
         } = req.body;
        const account = yield authModel_1.default.findById(accountID);
        // const options = {
        //   method: "GET",
        //   params: {
        //     address: studioAddress,
        //   },
        //   headers: {
        //     "x-rapidapi-key": "02dc23aea7msh5cc3022c747fdd7p160805jsn1378c2b79155",
        //     "x-rapidapi-host": "address-from-to-latitude-longitude.p.rapidapi.com",
        //   },
        // };
        // const location = await axios
        //   .get(
        //     `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi`,
        //     options
        //   )
        //   .then((res: any | {}) => {
        //     console.log(res.data.Results[0]);
        //     return res?.data?.Results[0];
        //   });
        const apiKey = "pk.2f2af94b99b88d7bd8e3b3d1fdb89bb0";
        const getCoordinates = (address) => __awaiter(void 0, void 0, void 0, function* () {
            const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;
            try {
                const response = yield axios_1.default.get(url);
                const location = response.data[0]; // get first result
                console.log("Latitude:", location.lat);
                console.log("Longitude:", location.lon);
                return { lat: location.lat, long: location.lon };
            }
            catch (error) {
                console.error("Error fetching coordinates:", error);
            }
        });
        let x = yield getCoordinates(studioAddress);
        if (account) {
            const studio = yield studioModel_1.default.create({
                accountHolderID: account === null || account === void 0 ? void 0 : account._id,
                studioContact,
                studioCategory,
                studioAddress,
                latitude: x.lat,
                longitude: x.long,
                studioLat: {
                    latitude: x.lat,
                    longitude: x.long,
                },
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
            yield activityModel_1.default.create({
                action: `A New Booking Action`,
                actionDetail: `${account === null || account === void 0 ? void 0 : account.firstName} ${account === null || account === void 0 ? void 0 : account.lastName} just listed a new studio named: ${studio === null || studio === void 0 ? void 0 : studio.studioName}`,
                actionInfo: `This is to Notify you that a new studio ${studio === null || studio === void 0 ? void 0 : studio.studioName} has been added to collections of studios`,
                actionType: "Studio Listing",
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
const viewAccountStudioHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID } = req.params;
        const account = yield studioModel_1.default.findById(accountID).populate({
            path: "history",
        });
        console.log(account);
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
exports.viewAccountStudioHistory = viewAccountStudioHistory;
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
const updateStudioInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountID, studioID } = req.params;
        const { studioDescription } = req.body;
        const account = yield authModel_1.default.findById(accountID);
        const studio = yield studioModel_1.default.findById(studioID);
        if (account && studio) {
            let imagesAdded = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                studioDescription: studioDescription,
            }, { new: true });
            return res.status(statusEnums_1.status.OK).json({
                message: `studio description has been updated`,
                data: imagesAdded,
                status: 201,
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
exports.updateStudioInfo = updateStudioInfo;
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
        if (studioCategory === "All") {
            const account = yield studioModel_1.default.find();
            return res.status(statusEnums_1.status.OK).json({
                message: `viewing studio`,
                data: account,
            });
        }
        else {
            const account = yield studioModel_1.default.find({ studioCategory });
            return res.status(statusEnums_1.status.OK).json({
                message: `viewing studio`,
                data: account,
            });
        }
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
            // const options = {
            //   method: "GET",
            //   params: {
            //     address: studioAddress,
            //   },
            //   headers: {
            //     "x-rapidapi-key":
            //       "02dc23aea7msh5cc3022c747fdd7p160805jsn1378c2b79155",
            //     "x-rapidapi-host":
            //       "address-from-to-latitude-longitude.p.rapidapi.com",
            //   },
            // };
            // const location = await axios
            //   .get(
            //     `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi`,
            //     options
            //   )
            //   .then((res: any | {}) => {
            //     console.log(res.data.Results[0]);
            //     return res?.data?.Results[0];
            //   });
            const apiKey = "pk.2f2af94b99b88d7bd8e3b3d1fdb89bb0";
            const getCoordinates = (address) => __awaiter(void 0, void 0, void 0, function* () {
                const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;
                try {
                    const response = yield axios_1.default.get(url);
                    const location = response.data[0]; // get first result
                    console.log("Latitude:", location.lat);
                    console.log("Longitude:", location.lon);
                    return { lat: location.lat, long: location.lon };
                }
                catch (error) {
                    console.error("Error fetching coordinates:", error);
                }
            });
            let x = yield getCoordinates(studioAddress);
            const account = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                studioName,
                latitude: x.lat,
                longitude: x.long,
                studioLat: {
                    latitude: x.lat,
                    longitude: x.long,
                },
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
const deleteAccountStudioFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, studioID } = req.params;
        const { featureName } = req.body;
        const user = yield authModel_1.default.findById(userID);
        const studio = yield studioModel_1.default.findById(studioID);
        const y = studio.studioFeatures[0].split(",");
        const m = y.filter((el) => el !== featureName);
        if (user) {
            const account = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                studioFeatures: [m.join(",")],
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
exports.deleteAccountStudioFeature = deleteAccountStudioFeature;
const addAccountStudioFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, studioID } = req.params;
        const { featureName } = req.body;
        const user = yield authModel_1.default.findById(userID);
        const studio = yield studioModel_1.default.findById(studioID);
        const y = studio.studioFeatures[0].split(",");
        if (user) {
            const account = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                studioFeatures: [[...featureName].join(",")],
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
exports.addAccountStudioFeature = addAccountStudioFeature;
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
const blockStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, studioID } = req.params;
        const { imageURL } = req.body;
        const user = yield authModel_1.default.findById(userID);
        const studio = yield studioModel_1.default.findById(studioID);
        if (user) {
            const account = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                block: true,
            }, { new: true });
            return res.status(statusEnums_1.status.OK).json({
                message: `studio has be closed`,
                data: account,
                status: 201,
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
exports.blockStudio = blockStudio;
const openStudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, studioID } = req.params;
        const user = yield authModel_1.default.findById(userID);
        const studio = yield studioModel_1.default.findById(studioID);
        if (user) {
            const account = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                block: false,
            }, { new: true });
            return res.status(statusEnums_1.status.OK).json({
                message: `studio is open`,
                data: account,
                status: 201,
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
exports.openStudio = openStudio;
const deleteAccountStudioImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, studioID } = req.params;
        const { imageURL } = req.body;
        const user = yield authModel_1.default.findById(userID);
        const studio = yield studioModel_1.default.findById(studioID);
        if (user) {
            const account = yield studioModel_1.default.findByIdAndUpdate(studioID, {
                studioImages: studio.studioImages.filter((el) => el !== imageURL),
            }, { new: true });
            return res.status(statusEnums_1.status.OK).json({
                message: `viewing studio`,
                data: account,
                status: 201,
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
exports.deleteAccountStudioImage = deleteAccountStudioImage;
