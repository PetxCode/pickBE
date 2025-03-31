import axios from "axios";
import { Request, Response } from "express";
import https from "https";
import { completePaymentEmail, receiptEmail } from "../utils/email";
import authModel from "../model/authModel";

const testPublicKey = "pk_test_308c16cdd6d785f5b308a8f6bc06ef96069327a8";
const testSecretKey = "sk_test_5ce8884a32a608b1f4d72536630b19abde0613f7";

// sk_test_ec1b0ccabcb547fe0efbd991f3b64b485903c88e
export const makeTransaction = async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;

    const data = {
      email,
      amount,
      callback: "https://pickastudio.com/payment/successful",
    };

    await axios
      .post(`https://api.paystack.co/transaction/initialize`, data, {
        headers: {
          authorization:
            "Bearer sk_test_ec1b0ccabcb547fe0efbd991f3b64b485903c88e",

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
  } catch (error: any) {
    return res.status(404).json({
      message: "Error",
      data: error.message,
      status: 404,
    });
  }
};
export const makePayment = async (req: Request, res: Response) => {
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

    const request = https
      .request(options, (response: any) => {
        let data = "";

        response.on("data", (chunk: any) => {
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
      .on("error", (error: any) => {
        console.log(error);
      });

    request.write(params);
    request.end();
  } catch (error: any) {
    return res.status(404).json({
      message: "Error",
      data: error.message,
      status: 404,
    });
  }
};

export const viewVerifyTransaction = async (req: Request, res: Response) => {
  try {
    const { trxref, userID } = req.params;

    const user = await authModel.findById(userID);
    await axios
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
  } catch (error: any) {
    return res.status(404).json({
      message: "Error",
      data: error.message,
      error: error,
      status: 404,
    });
  }
};
