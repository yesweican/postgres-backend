import { Router } from "express";
import * as videoController from "../controllers/video-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";
import { uploadVideo } from "../middleware/video_middleware.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  uploadVideo.single("file"),
  videoController.createVideo
);

router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById);

router.put(
  "/:id",
  authenticateToken,
  uploadVideo.single("file"),
  videoController.updateVideo
);

router.delete("/:id", authenticateToken, videoController.deleteVideo);

export default router;
