import { pool } from "../db/pool.js";

export const createSubscription = async (channelId, userId) => {
  const { rows } = await pool.query(
    `
    INSERT INTO subscriptions (channel, subscriber)
    VALUES ($1, $2)
    ON CONFLICT (channel, subscriber) DO NOTHING
    RETURNING *
    `,
    [channelId, userId]
  );

  return rows[0]; // undefined if already exists
};

export const deleteSubscription = async (channelId, userId) => {
  await pool.query(
    `
    DELETE FROM subscriptions
    WHERE channel = $1 AND subscriber = $2
    `,
    [channelId, userId]
  );
};

export const getSubscriptionsByUser = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT
      s.id,
      s.created_at,
      c.id AS channel_id,
      c.name,
      c.description,
      c.owner
    FROM subscriptions s
    JOIN channels c ON c.id = s.channel
    WHERE s.subscriber = $1
    ORDER BY s.created_at DESC
    `,
    [userId]
  );

  return rows;
};

export const getSubscribersByChannel = async (channelId) => {
  const { rows } = await pool.query(
    `
    SELECT
      s.id,
      s.created_at,
      u.id AS user_id,
      u.username,
      u.email
    FROM subscriptions s
    JOIN users u ON u.id = s.subscriber
    WHERE s.channel = $1
    ORDER BY s.created_at DESC
    `,
    [channelId]
  );

  return rows;
};

export const existsSubscription = async (channelId, userId) => {
  const { rowCount } = await pool.query(
    `
    SELECT 1
    FROM subscriptions
    WHERE channel = $1 AND subscriber = $2
    `,
    [channelId, userId]
  );

  return rowCount > 0;
};
