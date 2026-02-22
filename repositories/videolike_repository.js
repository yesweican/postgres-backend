import { pool } from "../db/pool.js";

export const exists = async (videoId, viewerId) => {
  const { rows } = await pool.query(
    `
    SELECT 1
    FROM videolikes
    WHERE video_id = $1 AND viewer_id = $2
    `,
    [videoId, viewerId]
  );

  return rows.length > 0;
};

export const create = async (videoId, viewerId) => {
  await pool.query(
    `
    INSERT INTO videolikes (video_id, viewer_id)
    VALUES ($1, $2)
    ON CONFLICT (video_id, viewer_id) DO NOTHING
    `,
    [videoId, viewerId]
  );
};

export const remove = async (videoId, viewerId) => {
  await pool.query(
    `
    DELETE FROM videolikes
    WHERE video_id = $1 AND viewer_id = $2
    `,
    [videoId, viewerId]
  );
};

export const countByVideo = async (videoId) => {
  const { rows } = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM videolikes
    WHERE video_id = $1
    `,
    [videoId]
  );

  return rows[0].count;
};