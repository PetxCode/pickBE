import nodemail from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import jwt from "jsonwebtoken";

// const GOOGLE_ID =
//   "199704572461-g84htr0if8p5ej23l2ukvsgtq2rh288g.apps.googleusercontent.com";
// const GOOGLE_SECRET = "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";
// const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
// const GOOGLE_REFRESH =
//   "1//04YjCKwj61rd0CgYIARAAGAQSNwF-L9Ir3vxuuMwtJOuDWBxTPBmmcxcX1F6FWMEYBtSPx-_aU6N5_dXKT4zarEfisB5XRHVkz2c";

const GOOGLE_ID =
  "848542784186-9os7noa7qvcg3nckfu38s3bhob8u6oga.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
const GOOGLE_REFRESH =
  "1//04GgN8ydoI_ZdCgYIARAAGAQSNwF-L9IrKCOkFE95PncupZNTb3WCiygNcFb1vp20oW-1SMJTKzSWxnWw2B6nf4S85GXSTpgR44M";

const oAuth = new google.auth.OAuth2(
  GOOGLE_ID,
  GOOGLE_SECRET,
  GOOGLE_REDIRECT_URL
);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });

// const url: string = "https://pick-be.onrender.com";
const url: string = "http://localhost:5173";

export const verifiedEmail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "codelabbest@gmail.com",
        clientSecret: GOOGLE_SECRET,
        clientId: GOOGLE_ID,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.firstName,
      },
      "secretCode"
    );

    let myURL = `${url}/${token}/sign-in`;

    const myPath = path.join(__dirname, "../views/index.ejs");
    const html = await ejs.renderFile(myPath, {
      link: myURL,
      userName: user.firstName,
      code: user.code,
    });

    const mailerOption = {
      from: "Pick a Studio🚀🚀🚀 <codelabbest@gmail.com>",
      to: user.email,
      subject: "Account Verification",
      html,
    };

    await transporter.sendMail(mailerOption);

    console.log("done", user);
  } catch (error) {
    console.log(error);
  }
};
