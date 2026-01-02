import { Router } from "express";
import * as channelController from "../controllers/channel-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  channelController.createChannel
);

router.get("/", channelController.getMyChannels);
router.get("/:id", channelController.getChannelById);

router.put(
  "/:id",
  authenticateToken,
  channelController.updateChannel
);

router.delete("/:id", authenticateToken, channelController.deleteChannel);

export default router;