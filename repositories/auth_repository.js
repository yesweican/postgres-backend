// repositories/auth.repository.js
import { pool } from "../db/pool.js";

/* ---------- Users ---------- */
export const findByUsernameOrEmail = async (identifier) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM users
    WHERE username = $1
       OR email = $1
    LIMIT 1
    `,
    [identifier]
  );

  return rows[0];
};

export const createUser = async ({ username, email, passwordHash }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at
    `,
    [username, email, passwordHash]
  );
  return rows[0];
};

export const deleteUserById = async (userId) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
};

/* ---------- Refresh Tokens ---------- */

export const createRefreshToken = async ({
  userId,
  token,
  expiresAt,
  client,
}) => {
  const executor = client ?? pool;

  await executor.query(
    `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    `,
    [userId, token, expiresAt]
  );
};

export const findValidRefreshToken = async (token) => {
  const { rows } = await pool.query(
    `
    SELECT rt.id, rt.user_id, u.email
    FROM refresh_tokens rt
    JOIN users u ON u.id = rt.user_id
    WHERE rt.token = $1
      AND rt.revoked_at IS NULL
      AND rt.expires_at > NOW()
    `,
    [token]
  );
  return rows[0];
};

export const revokeRefreshTokenById = async (id, client) => {
  const executor = client ?? pool;

  await executor.query(
    `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE id = $1
    `,
    [id]
  );
};

export const revokeAllRefreshTokensForUser = async (userId) => {
  await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = $1 AND revoked_at IS NULL
    `,
    [userId]
  );
};

export const saveRefreshToken = async (userId, token) => {
  await pool.query(
    `
    INSERT INTO refresh_tokens (user_id, token)
    VALUES ($1, $2)
    `,
    [userId, token]
  );
};


export const findRefreshToken = async (token) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM refresh_tokens
    WHERE token = $1 AND revoked = false
    `,
    [token]
  );

  return rows[0];
};


export const revokeRefreshToken = async (token) => {
  await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked = true
    WHERE token = $1
    `,
    [token]
  );
};


export const revokeAllUserTokens = async (userId) => {
  await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked = true
    WHERE user_id = $1
    `,
    [userId]
  );
};

