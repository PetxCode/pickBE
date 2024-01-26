import { Request, Response } from "express";
import articleModel from "../model/articleModel";
import { status } from "../utils/statusEnums";
import { streamUpload } from "../utils/streamifier";

export const createArticle = async (req: any, res: Response) => {
  try {
    const { articleTitle, articleContent, articleDescription } = req.body;

    const { secure_url }: any = await streamUpload(req);

    const article = await articleModel.create({
      articleTitle,
      articleImage: secure_url,
      articleContent,
      articleDescription,
    });

    return res.status(status.CREATED).json({
      message: "aerticle has been created",
      status: 201,
      data: article,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error creating article",
      data: error.message,
    });
  }
};

export const viewArticles = async (req: Request, res: Response) => {
  try {
    const article = await articleModel.find().sort({ createdAt: -1 });

    return res.status(status.OK).json({
      message: "aerticle has found",
      status: 200,
      data: article,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error founding article",
      data: error.message,
    });
  }
};

export const viewOneArticle = async (req: Request, res: Response) => {
  try {
    const { articleID } = req.params;
    const article = await articleModel.findById(articleID);

    return res.status(status.OK).json({
      message: "aerticle has found",
      status: 200,
      data: article,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: "Error founding article",
      data: error.message,
    });
  }
};
