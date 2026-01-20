import { pool } from "../db/pool.js";

export const create = async ({
  title,
  details,
  attachment,
  author,
}) => {
  const { rows } = await pool.query(
    `
    INSERT INTO articles (title, details, attachment, author)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, details, attachment, author]
  );

  return rows[0];
};

export const findByAuthor = async (authorId) => {
  const { rows } = await pool.query(
    `SELECT * FROM articles WHERE author = $1 ORDER BY created_at DESC`,
    [authorId]
  );
  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM articles WHERE id = $1`,
    [id]
  );
  return rows[0];
};

export const update = async (id, { title, details, attachment }) => {
  const { rows } = await pool.query(
    `
    UPDATE articles
    SET
      title = COALESCE($2, title),
      details = COALESCE($3, details),
      attachment = COALESCE($4, attachment),
      updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [id, title, details, attachment]
  );

  return rows[0];
};

export const remove = async (id) => {
  await pool.query(
    `DELETE FROM Articles WHERE id = $1`,
    [id]
  );
};
