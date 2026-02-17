// routes/channel-subscriber-route.js
import express from "express";
import { getChannelSubscribers } from "../controllers/channel-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = express.Router();

router.get("/:id",
  authenticateToken,
  getChannelSubscribers
);

export default router;
