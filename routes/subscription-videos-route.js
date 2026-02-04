// routes/subscription-Routes.js
import express from 'express';
import { getSubscriptionVideos } from "../controllers/video-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = express.Router();

// Route to get all subscriptions videos
router.get('/', authenticateToken, getSubscriptionVideos);

export default router;