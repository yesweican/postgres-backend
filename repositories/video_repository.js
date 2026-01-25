import { pool } from "../db/pool.js";

export const create = async ({
  title,
  description,
  video_url,
  creator,
  channel_id
}) => {
  const { rows } = await pool.query(
    `
    INSERT INTO videos (title, description, video_url, creator, channel_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [title, description, video_url, creator, channel_id]
  );

  return rows[0];
};

export const findByCreator = async (creatorId) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM videos
    WHERE creator = $1
    ORDER BY created_at DESC
    `,
    [creatorId]
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

export const update = async (id, { title, description, channel_id }) => {
  const { rows } = await pool.query(
    `
    UPDATE videos
    SET
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      channel_id = COALESCE($4, channel_id),
      updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [id, title, description, channel_id]
  );

  return rows[0];
};

export const search = async (query) => {
  const { rows } = await pool.query(
    `
    SELECT
      v.*,
      ts_rank(
        to_tsvector('english', coalesce(v.title, '') || ' ' || coalesce(v.description, '')),
        plainto_tsquery('english', $1)
      ) AS rank
    FROM videos v
    WHERE
      to_tsvector('english', coalesce(v.title, '') || ' ' || coalesce(v.description, ''))
      @@ plainto_tsquery('english', $1)
    ORDER BY rank DESC, created_at DESC
    `,
    [query]
  );

  return rows;
};


export const remove = async (id) => {
  await pool.query(
    `DELETE FROM videos WHERE id = $1`,
    [id]
  );
};
