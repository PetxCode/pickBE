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
exports.viewOneArticle = exports.viewArticles = exports.createArticle = void 0;
const articleModel_1 = __importDefault(require("../model/articleModel"));
const statusEnums_1 = require("../utils/statusEnums");
const streamifier_1 = require("../utils/streamifier");
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleTitle, articleContent, articleDescription } = req.body;
        const { secure_url } = yield (0, streamifier_1.streamUpload)(req);
        const article = yield articleModel_1.default.create({
            articleTitle,
            articleImage: secure_url,
            articleContent,
            articleDescription,
        });
        return res.status(statusEnums_1.status.CREATED).json({
            message: "aerticle has been created",
            status: 201,
            data: article,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error creating article",
            data: error.message,
        });
    }
});
exports.createArticle = createArticle;
const viewArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield articleModel_1.default.find();
        return res.status(statusEnums_1.status.OK).json({
            message: "aerticle has found",
            status: 200,
            data: article,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error founding article",
            data: error.message,
        });
    }
});
exports.viewArticles = viewArticles;
const viewOneArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleID } = req.params;
        const article = yield articleModel_1.default.findById(articleID);
        return res.status(statusEnums_1.status.OK).json({
            message: "aerticle has found",
            status: 200,
            data: article,
        });
    }
    catch (error) {
        return res.status(statusEnums_1.status.BAD).json({
            message: "Error founding article",
            data: error.message,
        });
    }
});
exports.viewOneArticle = viewOneArticle;
// export const viewOneArticle = async (req: Request, res: Response) => {
//   try {
//     const { articleID } = req.params;
//     const article = await articleModel.findById(articleID);
//     return res.status(status.OK).json({
//       message: "aerticle has found",
//       status: 200,
//       data: article,
//     });
//   } catch (error: any) {
//     return res.status(status.BAD).json({
//       message: "Error founding article",
//       data: error.message,
//     });
//   }
// };
