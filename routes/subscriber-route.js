// routes/subscriber-Routes.js
import express from 'express';
import { getChannelSubscribers } from "../controllers/subscription-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = express.Router();

// Get all my subscribers or a specific subscriber by channel ID
router.get("/:id?", authenticateToken, getChannelSubscribers);


export default router;