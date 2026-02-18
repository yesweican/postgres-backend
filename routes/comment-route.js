import express from "express";
import { createComment, updateComment, deleteComment } from "../controllers/comment-controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = express.Router();

// Create comment (top-level or reply)
router.post("/", authenticateToken, createComment);

// Update comment
router.put("/:id", authenticateToken, updateComment);

// Soft delete comment
router.delete("/:id", authenticateToken, deleteComment);

export default router;
