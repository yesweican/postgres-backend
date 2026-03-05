// routes/channel-video-route.js
import express from "express";
import { getChannelVideos } from "../controllers/channel-controller.js";

const router = express.Router();

router.get("/:id",
  getChannelVideos
);

export default router;
