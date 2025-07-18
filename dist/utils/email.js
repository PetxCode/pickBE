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
exports.completePaymentEmailForClient = exports.completePaymentEmail = exports.receiptEmail = exports.verifiedEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const GOOGLE_ID =
//   "199704572461-g84htr0if8p5ej23l2ukvsgtq2rh288g.apps.googleusercontent.com";
// const GOOGLE_SECRET = "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";
// const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
// const GOOGLE_REFRESH =
//   "1//04YjCKwj61rd0CgYIARAAGAQSNwF-L9Ir3vxuuMwtJOuDWBxTPBmmcxcX1F6FWMEYBtSPx-_aU6N5_dXKT4zarEfisB5XRHVkz2c";
const GOOGLE_ID = "848542784186-9os7noa7qvcg3nckfu38s3bhob8u6oga.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
const GOOGLE_REFRESH = "1//04GgN8ydoI_ZdCgYIARAAGAQSNwF-L9IrKCOkFE95PncupZNTb3WCiygNcFb1vp20oW-1SMJTKzSWxnWw2B6nf4S85GXSTpgR44M";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });
const url = "https://pickastudio.com";
// const url: string = "http://localhost:5173";
// const url: string = "https://pickstudionow.web.app";
const verifiedEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter2 = nodemailer_1.default.createTransport({
            // service: "gmail",
            // auth: {
            //   type: "OAuth2",
            //   user: "codelabbest@gmail.com",
            //   clientSecret: GOOGLE_SECRET,
            //   clientId: GOOGLE_ID,
            //   refreshToken: GOOGLE_REFRESH,
            //   accessToken,
            // },
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: "90bb5d001@smtp-brevo.com",
                pass: "DEKAVd0tfUC2gHwR",
            },
        });
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "justtnext@gmail.com",
                pass: "wfozkwqcyfohmgfo",
            },
        });
        // wfoz kwqc yfoh mgfo
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            name: user.firstName,
        }, "secretCode");
        let myURL = `${url}/${token}/sign-in`;
        const myPath = path_1.default.join(__dirname, "../views/index.ejs");
        const html = yield ejs_1.default.renderFile(myPath, {
            link: myURL,
            userName: user.firstName,
            code: user.code,
        });
        const mailerOption = {
            from: "Pickastudio🚀🚀🚀 <codelabbest@gmail.com>",
            to: user.email,
            subject: "Account Verification",
            html,
        };
        yield transporter.sendMail(mailerOption).then(() => {
            console.log("send");
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.verifiedEmail = verifiedEmail;
const receiptEmail = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "justtnext@gmail.com",
                pass: "wfozkwqcyfohmgfo",
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            name: user.firstName,
        }, "secretCode");
        let myURL = `${url}/${token}/sign-in`;
        const myPath = path_1.default.join(__dirname, "../views/paymentEmail.ejs");
        const html = yield ejs_1.default.renderFile(myPath, {
            userName: user.firstName,
            receipt: (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.reference,
            amount: (_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.amount,
            channel: (_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.channel,
            currency: (_d = data === null || data === void 0 ? void 0 : data.data) === null || _d === void 0 ? void 0 : _d.currency,
            paid_at: (0, moment_1.default)((_e = data === null || data === void 0 ? void 0 : data.data) === null || _e === void 0 ? void 0 : _e.paid_at).format("LLLL"),
        });
        const mailerOption = {
            from: "Pickastudio🚀🚀🚀 <codelabbest@gmail.com>",
            to: user.email,
            subject: "Payment Receipt",
            html,
        };
        yield transporter.sendMail(mailerOption);
    }
    catch (error) {
        console.log(error);
    }
});
exports.receiptEmail = receiptEmail;
const completePaymentEmail = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const accessToken: any = (await oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "justtnext@gmail.com",
                pass: "wfozkwqcyfohmgfo",
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            name: user.firstName,
        }, "secretCode");
        let myURL = `${url}/${token}/sign-in`;
        const result = Object.entries(data === null || data === void 0 ? void 0 : data.bookedDate)
            .filter(([_, value]) => value !== 0)
            .map(([key, value]) => `${key}:${value}`)[0];
        let x2 = parseFloat(result.split(":")[1]);
        console.log(data === null || data === void 0 ? void 0 : data.bookedDate);
        const myPath = path_1.default.join(__dirname, "../views/completePayment.ejs");
        const html = yield ejs_1.default.renderFile(myPath, {
            userName: user.firstName,
            studioName: data === null || data === void 0 ? void 0 : data.studioName,
            receipt: data === null || data === void 0 ? void 0 : data.paymentRef,
            amount: data === null || data === void 0 ? void 0 : data.cost,
            bookedDate: data === null || data === void 0 ? void 0 : data.calendarDate,
            duration: result.split(":")[1],
            day: result.split(":")[0] === "hourly" ? "hour" : result.split(":")[0],
            currency: data === null || data === void 0 ? void 0 : data.currency,
            paid_at: (0, moment_1.default)(data === null || data === void 0 ? void 0 : data.date).format("LLLL"),
        });
        const mailerOption = {
            from: "Pickastudio🚀🚀🚀 <codelabbest@gmail.com>",
            to: user.email,
            subject: "Payment Receipt",
            html,
        };
        yield transporter.sendMail(mailerOption).then(() => {
            console.log("mail sent...");
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.completePaymentEmail = completePaymentEmail;
const completePaymentEmailForClient = (client, user, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const accessToken: any = (await oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "justtnext@gmail.com",
                pass: "wfozkwqcyfohmgfo",
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            name: user.firstName,
        }, "secretCode");
        let myURL = `${url}/${token}/sign-in`;
        const result = Object.entries(data === null || data === void 0 ? void 0 : data.bookedDate)
            .filter(([_, value]) => value !== 0)
            .map(([key, value]) => `${key}:${value}`)[0];
        let x2 = parseFloat(result.split(":")[1]);
        console.log(client);
        const myPath = path_1.default.join(__dirname, "../views/completePaleteForClient.ejs");
        const html = yield ejs_1.default.renderFile(myPath, {
            userName: user.firstName,
            clientName: client.firstName,
            studioName: data === null || data === void 0 ? void 0 : data.studioName,
            receipt: data === null || data === void 0 ? void 0 : data.paymentRef,
            amount: data === null || data === void 0 ? void 0 : data.cost,
            bookedDate: data === null || data === void 0 ? void 0 : data.calendarDate,
            duration: result.split(":")[1],
            day: result.split(":")[0] === "hourly" ? "hour" : result.split(":")[0],
            currency: data === null || data === void 0 ? void 0 : data.currency,
            paid_at: (0, moment_1.default)(data === null || data === void 0 ? void 0 : data.date).format("LLLL"),
        });
        const mailerOption = {
            from: "Pickastudio🚀🚀🚀 <codelabbest@gmail.com>",
            to: client.email,
            subject: "Payment Receipt",
            html,
        };
        yield transporter.sendMail(mailerOption);
    }
    catch (error) {
        console.log(error);
    }
});
exports.completePaymentEmailForClient = completePaymentEmailForClient;
