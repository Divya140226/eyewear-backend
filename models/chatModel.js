const pool = require('./db');

const insertChatMessage = async (roomId, senderId, message) => {
  const result = await pool.query(
    `INSERT INTO chat_messages (room_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *`,
    [roomId, senderId, message]
  );
  return result.rows[0];
};

const getMessagesByRoom = async (roomId) => {
  const result = await pool.query(
    `SELECT * FROM chat_messages WHERE room_id = $1 ORDER BY added_date ASC`,
    [roomId]
  );
  return result.rows;
};

module.exports = {
  insertChatMessage,
  getMessagesByRoom,
};
