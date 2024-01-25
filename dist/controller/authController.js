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
exports.deleteOneAuth = exports.signInUser = exports.verifyUser = exports.updateOneAuthAvatar = exports.updateOneAuthInfoLang = exports.updateOneAuthInfoBio = exports.updateOneAuthInfoProfession = exports.updateOneAuthInfoPhone = exports.updateOneAuthInfoContact = exports.updateOneAuthInfo = exports.readOneAuth = exports.readAllAuth = exports.createArtistAuth = exports.createAdminAuth = exports.createUserAuth = void 0;
const statusEnums_1 = require("../utils/statusEnums");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const authModel_1 = __importDefault(require("../model/authModel"));
const email_1 = require("../utils/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const streamifier_1 = require("../utils/streamifier");
const createUserAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        let token = crypto_1.default.randomBytes(25).toString("hex");
        let code = crypto_1.default.randomBytes(3).toString("hex");
        const user = yield authModel_1.default.create({
            email,
            password: hash,
            verifyToken: token,
            firstName,
            lastName,
            code,
            status: "user",
        });
        (0, email_1.verifiedEmail)(user);
        return res.status(statusEnums_1.status.CREATED).json({
            message: "account created but check your email for further verification",
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
            data: error.message,
        });
    }
});
exports.createUserAuth = createUserAuth;
const createAdminAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        let token = crypto_1.default.randomBytes(25).toString("hex");
        let code = crypto_1.default.randomBytes(3).toString("hex");
        const user = yield authModel_1.default.create({
            email,
            password: hash,
            verifyToken: token,
            firstName,
            lastName,
            code,
            status: "admin",
        });
        (0, email_1.verifiedEmail)(user);
        return res.status(statusEnums_1.status.CREATED).json({
            message: "account created but check your email for further verification",
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
            data: error.message,
        });
    }
});
exports.createAdminAuth = createAdminAuth;
const createArtistAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        let token = crypto_1.default.randomBytes(25).toString("hex");
        let code = crypto_1.default.randomBytes(3).toString("hex");
        const user = yield authModel_1.default.create({
            email,
            password: hash,
            verifyToken: token,
            firstName,
            lastName,
            code,
            status: "artist",
        });
        (0, email_1.verifiedEmail)(user);
        return res.status(statusEnums_1.status.CREATED).json({
            message: "account created but check your email for further verification",
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
            data: error.message,
        });
    }
});
exports.createArtistAuth = createArtistAuth;
const readAllAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authModel_1.default.find();
        return res.status(statusEnums_1.status.OK).json({
            message: "all users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.readAllAuth = readAllAuth;
const readOneAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield authModel_1.default.findById(userID);
        return res.status(statusEnums_1.status.OK).json({
            message: "one users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.readOneAuth = readOneAuth;
const updateOneAuthInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { userName, fullName } = req.body;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            userName,
            fullName,
        }, { new: true });
        return res.status(statusEnums_1.status.OK).json({
            message: "one users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.updateOneAuthInfo = updateOneAuthInfo;
const updateOneAuthInfoContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { contact } = req.body;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            contact,
        }, { new: true });
        return res.status(statusEnums_1.status.OK).json({
            message: "one users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.updateOneAuthInfoContact = updateOneAuthInfoContact;
const updateOneAuthInfoPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { phone } = req.body;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            phone,
        }, { new: true });
        return res.status(statusEnums_1.status.OK).json({
            message: "one users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.updateOneAuthInfoPhone = updateOneAuthInfoPhone;
const updateOneAuthInfoProfession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { profession } = req.body;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            profession,
        }, { new: true });
        return res.status(statusEnums_1.status.OK).json({
            message: "one users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.updateOneAuthInfoProfession = updateOneAuthInfoProfession;
const updateOneAuthInfoBio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { bio } = req.body;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            bio,
        }, { new: true });
        return res.status(statusEnums_1.status.OK).json({
            message: "one users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.updateOneAuthInfoBio = updateOneAuthInfoBio;
const updateOneAuthInfoLang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { lang } = req.body;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            lang,
        }, { new: true });
        return res.status(statusEnums_1.status.OK).json({
            message: "one users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.updateOneAuthInfoLang = updateOneAuthInfoLang;
const updateOneAuthAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            avatar: (0, streamifier_1.streamUpload)(req),
        }, { new: true });
        return res.status(statusEnums_1.status.OK).json({
            message: "one users read",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.updateOneAuthAvatar = updateOneAuthAvatar;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        const user = yield authModel_1.default.findOne({ code });
        if (user) {
            if (user.verifyToken !== "") {
                yield authModel_1.default.findByIdAndUpdate(user._id, {
                    verifyToken: "",
                    verify: true,
                }, { new: true });
                return res.status(statusEnums_1.status.CREATED).json({
                    message: "Account verified",
                });
            }
            else {
                return res.status(statusEnums_1.status.BAD).json({
                    message: "user haven't been verified",
                });
            }
        }
        else {
            return res.status(statusEnums_1.status.BAD).json({
                message: "user doesn't exist",
            });
        }
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error",
        });
    }
});
exports.verifyUser = verifyUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield authModel_1.default.findOne({ email });
        if (user) {
            const passwordCheck = yield bcrypt_1.default.compare(password, user.password);
            if (passwordCheck) {
                if (user.verify && user.verifyToken === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, "thisIsAwesome");
                    return res.status(statusEnums_1.status.CREATED).json({
                        message: "welcome back",
                        data: token,
                    });
                }
                else {
                    return res.status(statusEnums_1.status.BAD).json({
                        message: "user haven't been verified",
                    });
                }
            }
            else {
                return res.status(statusEnums_1.status.BAD).json({
                    message: "password is incorrect",
                });
            }
        }
        else {
            return res.status(statusEnums_1.status.BAD).json({
                message: "user doesn't exist",
            });
        }
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error",
        });
    }
});
exports.signInUser = signInUser;
const deleteOneAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield authModel_1.default.findByIdAndDelete(userID);
        return res.status(statusEnums_1.status.OK).json({
            message: "this users has been deleted",
            data: user,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.deleteOneAuth = deleteOneAuth;
