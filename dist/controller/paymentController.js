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
exports.viewVerifyTransaction = exports.makePayment = exports.makeTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const authModel_1 = __importDefault(require("../model/authModel"));
const testPublicKey = "pk_test_308c16cdd6d785f5b308a8f6bc06ef96069327a8";
const testSecretKey = "sk_test_5ce8884a32a608b1f4d72536630b19abde0613f7";
// sk_test_ec1b0ccabcb547fe0efbd991f3b64b485903c88e
const makeTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, amount } = req.body;
        const data = {
            email,
            amount,
            callback: "https://pickastudio.com/payment/successful",
        };
        yield axios_1.default
            .post(`https://api.paystack.co/transaction/initialize`, data, {
            headers: {
                authorization: "Bearer sk_test_ec1b0ccabcb547fe0efbd991f3b64b485903c88e",
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
        })
            .then((resp) => {
            return res.status(201).json({
                message: "transaction initialize",
                data: resp.data,
                status: 201,
            });
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            data: error.message,
            status: 404,
        });
    }
});
exports.makeTransaction = makeTransaction;
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, email } = req.body;
        // const URL = "http://localhost:5173";
        const URL = "https://pickastudio.com";
        const params = JSON.stringify({
            email,
            amount: (parseInt(amount) * 100).toString(),
            callback_url: `${URL}/payment/successful`,
            metadata: {
                cancel_action: `${URL}/payment/failed`,
            },
            channels: ["card"],
        });
        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization: `Bearer ${testSecretKey}`,
                "Content-Type": "application/json",
            },
        };
        const request = https_1.default
            .request(options, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                return res.status(201).json({
                    message: "Processing Payments...",
                    data: JSON.parse(data),
                    status: 201,
                });
            });
        })
            .on("error", (error) => {
            console.log(error);
        });
        request.write(params);
        request.end();
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            data: error.message,
            status: 404,
        });
    }
});
exports.makePayment = makePayment;
const viewVerifyTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trxref, userID } = req.params;
        const user = yield authModel_1.default.findById(userID);
        yield axios_1.default
            .get(`https://api.paystack.co/transaction/verify/${trxref}`, {
            headers: {
                authorization: `Bearer ${testSecretKey}`,
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
        })
            .then((resp) => {
            // completePaymentEmail(user, resp.data);
            return res.status(201).json({
                message: "payment verified successfully",
                data: resp.data,
                status: 201,
            });
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            data: error.message,
            error: error,
            status: 404,
        });
    }
});
exports.viewVerifyTransaction = viewVerifyTransaction;
