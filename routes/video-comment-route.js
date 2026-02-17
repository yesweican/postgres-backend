import express from "express";
import { getCommentsByVideo } from "../controllers/comment-controller.js";

const router = express.Router();

// Get comments for a video (threaded)
router.get("/:videoId", getCommentsByVideo);

export default router;
