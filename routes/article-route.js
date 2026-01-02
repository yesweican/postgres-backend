import { Router } from "express";
import * as articleController from "../controllers/article-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";
import { uploadImage } from "../middleware/image_middleware.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  uploadImage.single("file"),
  articleController.createArticle
);

router.get("/", articleController.getAllArticles);
router.get("/:id", articleController.getArticleById);

router.put(
  "/:id",
  authenticateToken,
  uploadImage.single("file"),
  articleController.updateArticle
);

router.delete("/:id", authenticateToken, articleController.deleteArticle);

export default router;