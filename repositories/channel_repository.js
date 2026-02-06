import { pool } from "../db/pool.js";

export const createChannel = async ({ name, description, owner }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO channels (name, description, owner)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [name, description, owner]
  );

  return rows[0];
};

export const getChannelById = async (id) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM channels
    WHERE id = $1
    `,
    [id]
  );

  return rows[0];
};

export const getChannelsByOwner = async (ownerId) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM channels
    WHERE owner = $1
    ORDER BY created_at DESC
    `,
    [ownerId]
  );

  return rows;
};

export const findSubscribersByChannelId = async (
  channelId,
  page,
  pageSize
) => {
  const offset = page * pageSize;

  const { rows } = await pool.query(
    `
    SELECT
      u.id,
      u.username,
      u.fullname,
      u.email,
      s.created_at
    FROM subscriptions s
    JOIN users u ON u.id = s.subscriber
    WHERE s.channel = $1
    ORDER BY s.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [channelId, pageSize, offset]
  );

  return rows;
};


export const updateChannel = async (id, name, description) => {
  const { rows } = await pool.query(
    `
    UPDATE channels
    SET
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      updated_at = now()
    WHERE id = $3
    RETURNING *
    `,
    [name, description, id]
  );

  return rows[0];
};

export const deleteChannel = async (id) => {
  await pool.query(
    `
    DELETE FROM channels
    WHERE id = $1
    `,
    [id]
  );
};

