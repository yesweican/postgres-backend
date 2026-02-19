// routes/channel-video-route.js
import express from "express";
import { getChannelVideos } from "../controllers/channel-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = express.Router();

router.get("/:id",
  getChannelVideos
);

export default router;
