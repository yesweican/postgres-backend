import { pool } from "../db/pool.js";

export async function insertComment(comment) {
  const { rows } = await pool.query(
    `
    INSERT INTO comments (
      id,
      video_id,
      comment_replyto,
      comment_details,
      creator
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      comment.id,
      comment.video_id,
      comment.comment_replyto,
      comment.comment_details,
      comment.creator
    ]
  );

  return rows[0];
}

//===================comment-repository=================

export async function findByVideoId(
  videoId,
  { limit = 20, offset = 0 } = {}
) {

  const totalQuery = `
    SELECT COUNT(*)
    FROM comments
    WHERE video_id = $1
      AND deleted = false
      AND comment_replyto IS NULL
  `;

  const dataQuery = `
    SELECT
      c.id,
      c.video_id,
      c.comment_details,
      c.creator,
      u.username AS creator_username,
      c.comment_replyto,
      c.created_at,
      c.updated_at
    FROM comments c
    JOIN users u ON u.id = c.creator
    WHERE c.video_id = $1
      AND c.deleted = false
      AND c.comment_replyto IS NULL
    ORDER BY c.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const [totalResult, dataResult] = await Promise.all([
    pool.query(totalQuery, [videoId]),
    pool.query(dataQuery, [videoId, limit, offset])
  ]);

  return {
    total: parseInt(totalResult.rows[0].count, 10),
    rows: dataResult.rows
  };
}

export async function findById(id) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM comments
    WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

export async function updateComment(id, commentDetails) {
  await pool.query(
    `
    UPDATE comments
    SET comment_details = $1,
        updated_at = now()
    WHERE id = $2
    `,
    [commentDetails, id]
  );
}

export async function softDelete(id) {
  await pool.query(
    `
    UPDATE comments
    SET deleted = true,
        updated_at = now()
    WHERE id = $1
    `,
    [id]
  );
}
