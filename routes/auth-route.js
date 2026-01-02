import express from "express";
import { /* getMe,*/ login, logout, register, refreshToken, deleteUser } from "../controllers/auth-controller.js";
import { authenticateToken }  from "../middleware/auth_middleware.js";

const router = express.Router();

//router.get("/me", authenticateToken, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshtoken", refreshToken);
router.delete("/me", authenticateToken, deleteUser);

export default router;
