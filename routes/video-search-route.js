import { Router } from "express";
import { searchVideos } from "../controllers/video-controller.js";

const router = Router();

router.get("/", searchVideos);

export default router;