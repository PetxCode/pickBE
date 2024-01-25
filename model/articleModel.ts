import mongoose, { Document, Schema, model } from "mongoose";

interface iArticle {
  articleTitle: string;
  articleImage: string;
  articleContent: string;
  articleDescription: string;
}

interface iArticleData extends iArticle, Document {}

const articleModel = new Schema<iArticleData>(
  {
    articleTitle: {
      type: String,
    },
    articleImage: {
      type: String,
    },
    articleContent: {
      type: String,
    },
    articleDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model<iArticleData>("articles", articleModel);
