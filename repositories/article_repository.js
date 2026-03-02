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

export const findByAuthorPaginated = async (
  authorId,
  offset,
  limit
) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM articles
    WHERE author = $1
    ORDER BY created_at DESC
    OFFSET $2
    LIMIT $3
    `,
    [authorId, offset, limit]
  );

  return rows;
};

export const countByAuthor = async (authorId) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM articles WHERE author = $1`,
    [authorId]
  );

  return Number(rows[0].count);
};


export const countByAuthorCapped = async (
  authorId,
  cap
) => {
  const { rows } = await pool.query(
    `
    SELECT LEAST(COUNT(*), $2) AS count
    FROM articles
    WHERE author = $1
    `,
    [authorId, cap]
  );

  return Number(rows[0].count);
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


// ===== Full Text Search (NOT author restricted) =====
export const searchArticles = async (
  searchTerm,
  limit,
  offset
) => {
  const { rows } = await pool.query(
    `
    SELECT *,
           ts_rank(search_vector, plainto_tsquery('english', $1)) AS rank
    FROM articles
    WHERE search_vector @@ plainto_tsquery('english', $1)
    ORDER BY rank DESC, created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [searchTerm, limit, offset]
  );

  return rows;
};


export const countSearchArticles = async (searchTerm) => {
  const { rows } = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM articles
    WHERE search_vector @@ plainto_tsquery('english', $1)
    `,
    [searchTerm]
  );

  return rows[0].count;
};