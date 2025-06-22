const chatModel = require('../models/chatModel');

exports.saveChatMessage = async (req, res) => {
  const { roomId, senderId, message } = req.body;
  try {
    const newMessage = await chatModel.insertChatMessage(roomId, senderId, message);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoomMessages = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const messages = await chatModel.getMessagesByRoom(roomId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
