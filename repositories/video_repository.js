import { pool } from "../db/pool.js";

export const create = async ({
  title,
  description,
  video_url,
  creator,
}) => {
  const { rows } = await pool.query(
    `
    INSERT INTO videos (title, description, video_url, creator)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, video_url, creator]
  );

  return rows[0];
};

export const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM videos ORDER BY created_at DESC`
  );
  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM videos WHERE id = $1`,
    [id]
  );
  return rows[0];
};

export const update = async (id, { title, description, video_url }) => {
  const { rows } = await pool.query(
    `
    UPDATE videos
    SET
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      video_url = COALESCE($4, video_url),
      updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [id, title, description, video_url]
  );

  return rows[0];
};

export const remove = async (id) => {
  await pool.query(
    `DELETE FROM videos WHERE id = $1`,
    [id]
  );
};
