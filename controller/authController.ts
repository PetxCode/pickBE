import { Request, Response } from "express";
import { status } from "../utils/statusEnums";
import bcrypt from "bcrypt";
import crypto from "crypto";
import authModel from "../model/authModel";
import { verifiedEmail } from "../utils/email";
import jwt from "jsonwebtoken";
import { streamUpload } from "../utils/streamifier";

export const createUserAuth = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let token = crypto.randomBytes(25).toString("hex");
    let code = crypto.randomBytes(3).toString("hex");

    const user = await authModel.create({
      email,
      password: hash,
      verifyToken: token,
      firstName,
      lastName,
      code,
      status: "user",
    });

    verifiedEmail(user);

    return res.status(status.CREATED).json({
      message: "account created but check your email for further verification",
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error creating user",
      data: error.message,
    });
  }
};

export const createAdminAuth = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let token = crypto.randomBytes(25).toString("hex");
    let code = crypto.randomBytes(3).toString("hex");

    const user = await authModel.create({
      email,
      password: hash,
      verifyToken: token,
      firstName,
      lastName,
      code,
      status: "admin",
    });

    verifiedEmail(user);

    return res.status(status.CREATED).json({
      message: "account created but check your email for further verification",
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error creating user",
      data: error.message,
    });
  }
};

export const createArtistAuth = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let token = crypto.randomBytes(25).toString("hex");
    let code = crypto.randomBytes(3).toString("hex");

    const user = await authModel.create({
      email,
      password: hash,
      verifyToken: token,
      firstName,
      lastName,
      code,
      status: "artist",
    });

    verifiedEmail(user);

    return res.status(status.CREATED).json({
      message: "account created but check your email for further verification",
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error creating user",
      data: error.message,
    });
  }
};

export const readAllAuth = async (req: Request, res: Response) => {
  try {
    const user = await authModel.find();

    return res.status(status.OK).json({
      message: "all users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const readOneAuth = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await authModel.findById(userID);

    return res.status(status.OK).json({
      message: "one users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const updateOneAuthInfo = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { userName, fullName } = req.body;
    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        userName,
        fullName,
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: "one users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const updateOneAuthInfoContact = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { contact } = req.body;
    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        contact,
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: "one users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const updateOneAuthInfoPhone = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { phone } = req.body;
    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        phone,
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: "one users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const updateOneAuthInfoProfession = async (
  req: Request,
  res: Response
) => {
  try {
    const { userID } = req.params;
    const { profession } = req.body;
    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        profession,
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: "one users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const updateOneAuthInfoBio = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { bio } = req.body;
    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        bio,
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: "one users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const updateOneAuthInfoLang = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { lang } = req.body;
    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        lang,
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: "one users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const updateOneAuthAvatar = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        avatar: streamUpload(req),
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: "one users read",
      data: user,
    });
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error creating user",
    });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { code } = req.body;

    const user: any = await authModel.findOne({ code });

    if (user) {
      if (user.verifyToken !== "") {
        await authModel.findByIdAndUpdate(
          user._id,
          {
            verifyToken: "",
            verify: true,
          },
          { new: true }
        );

        return res.status(status.CREATED).json({
          message: "Account verified",
        });
      } else {
        return res.status(status.BAD).json({
          message: "user haven't been verified",
        });
      }
    } else {
      return res.status(status.BAD).json({
        message: "user doesn't exist",
      });
    }
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error",
    });
  }
};

export const signInUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findOne({ email });

    if (user) {
      const passwordCheck = await bcrypt.compare(password, user.password);

      if (passwordCheck) {
        if (user.verify && user.verifyToken === "") {
          const token = jwt.sign(
            { id: user._id, email: user.email },
            "thisIsAwesome"
          );

          return res.status(status.CREATED).json({
            message: "welcome back",
            data: token,
          });
        } else {
          return res.status(status.BAD).json({
            message: "user haven't been verified",
          });
        }
      } else {
        return res.status(status.BAD).json({
          message: "password is incorrect",
        });
      }
    } else {
      return res.status(status.BAD).json({
        message: "user doesn't exist",
      });
    }
  } catch (error) {
    return res.status(status.BAD).json({
      message: "Error",
    });
  }
};
