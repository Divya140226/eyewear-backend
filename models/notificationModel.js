const pool = require('./db');

const insertNotification = async (toUserId, message, type) => {
  const result = await pool.query(
    `INSERT INTO notifications (to_user_id, message, type) VALUES ($1, $2, $3) RETURNING *`,
    [toUserId, message, type]
  );
  return result.rows[0];
};

const getNotificationsByUser = async (toUserId) => {
  const result = await pool.query(
    `SELECT * FROM notifications WHERE to_user_id = $1 ORDER BY added_date DESC`,
    [toUserId]
  );
  return result.rows;
};

module.exports = {
  insertNotification,
  getNotificationsByUser,
};
