import { Router } from "express";
import {
  createArticle,
  viewArticles,
  viewOneArticle,
} from "../controller/articleControlling";
import multer from "multer";

const upload = multer().single("articleImage");

const router: Router = Router();

router.route("/create-article").post(upload, createArticle);
router.route("/read-article").get(viewArticles);
router.route("/read-one-article").get(viewOneArticle);

export default router;
