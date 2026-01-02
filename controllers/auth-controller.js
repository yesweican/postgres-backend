// controllers/auth.controller.js
import * as authService from "../services/auth_service.js";

/* ---------- Register ---------- */
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await authService.register({
      username,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.message === "USER_ALREADY_EXISTS") {
      return res.status(409).json({ message: "User already exists" });
    }
    next(err);
  }
};

/* ---------- Login ---------- */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const tokens = await authService.login({ username, password });

    res.status(200).json(tokens);
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    next(err);
  }
};

/* ---------- Refresh Token ---------- */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshTokens(refreshToken);

    res.status(200).json(tokens);
  } catch (err) {
    if (err.message === "INVALID_REFRESH_TOKEN") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    next(err);
  }
};

/* ---------- Logout ---------- */
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

/* ---------- Delete User ---------- */
export const deleteUser = async (req, res, next) => {
  try {
    // req.user is set by auth middleware (JWT access token)
    await authService.deleteUser(req.user.sub);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

