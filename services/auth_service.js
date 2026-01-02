// services/auth.service.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../db/pool.js";
import * as repo from "../repositories/auth_repository.js";
import {
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt_utils.js";
import { AppError } from "../errors/app_error.js";

const REFRESH_TOKEN_TTL_DAYS = 7;
const SALT_ROUNDS = 10;

/* ---------- Register ---------- */

export const register = async ({ username, email, password }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    return await repo.createUser({
      username,
      email: email.toLowerCase(),
      passwordHash,
    });
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("USER_ALREADY_EXISTS");
    }
    throw err;
  }
};

/* ---------- Login ---------- */
export const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new AppError("Missing credentials", 400);
  }

  const user = await repo.findByUsernameOrEmail(username);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  console.log({
  passwordFromRequest: password,
  passwordFromDb: user?.password_hash,
  });

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // persist refresh token
  await repo.saveRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
};

/* ---------- Refresh Token (rotation) ---------- */

export const refreshTokens = async (refreshToken) => {
  const tokenRow = await repo.findValidRefreshToken(refreshToken);
  if (!tokenRow) throw new Error("INVALID_REFRESH_TOKEN");

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, payload) => {
      if (err || payload.sub !== tokenRow.user_id) {
        throw new Error("INVALID_REFRESH_TOKEN");
      }
    }
  );

  const newAccessToken = signAccessToken({
    id: tokenRow.user_id,
    email: tokenRow.email,
  });

  const newRefreshToken = signRefreshToken({
    id: tokenRow.user_id,
    email: tokenRow.email,
  });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await repo.revokeRefreshTokenById(tokenRow.id, client);

    await repo.createRefreshToken({
      userId: tokenRow.user_id,
      token: newRefreshToken,
      expiresAt: new Date(
        Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
      ),
      client,
    });

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/* ---------- Logout ---------- */

export const logout = async (refreshToken) => {
  if (!refreshToken) return;
  const tokenRow = await repo.findValidRefreshToken(refreshToken);
  if (!tokenRow) return;

  await repo.revokeRefreshTokenById(tokenRow.id);
};

/* ---------- Delete User ---------- */

export const deleteUser = async (userId) => {
  await repo.deleteUserById(userId);
};
