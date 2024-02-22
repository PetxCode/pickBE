import axios from "axios";
import { Request, Response } from "express";
import https from "https";

export const makeTransaction = async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;

    const data = {
      email,
      amount,
      callback: "http://localhost:5173/payment/successful",
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
        console.log(resp.data);
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

    const params = JSON.stringify({
      email,
      amount: (parseInt(amount) * 100).toString(),
      callback_url: "https://pickastudionow.web.app/payment/successful",
      metadata: {
        cancel_action: "https://pickastudionow.web.app/payment/failed",
      },
      channels: ["card"],
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization:
          "Bearer sk_test_ec1b0ccabcb547fe0efbd991f3b64b485903c88e",
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
        console.error(error);
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
    const { trxref } = req.params;

    await axios
      .get(`https://api.paystack.co/transaction/verify/${trxref}`, {
        headers: {
          authorization:
            "Bearer sk_test_ec1b0ccabcb547fe0efbd991f3b64b485903c88e",

          "content-type": "application/json",
          "cache-control": "no-cache",
        },
      })
      .then((resp) => {
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
