import pool from "../db/pool.js";

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

export async function findByVideoId(videoId) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM comments
    WHERE video_id = $1
      AND deleted = false
    ORDER BY created_at ASC
    `,
    [videoId]
  );

  return rows;
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
