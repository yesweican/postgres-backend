import express from "express";
import {
  toggleVideoLike,
  checkVideoLike,
  countVideoLikes
} from "../controllers/videolike-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = express.Router();

// Toggle like / unlike
router.post("/:videoId", authenticateToken, toggleVideoLike);

// Check if current user liked the video
router.get("/check/:videoId", authenticateToken, checkVideoLike);

// Count likes for a video (public)
router.get("/count/:videoId", countVideoLikes);

export default router;