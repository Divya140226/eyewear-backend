const { insertChatMessage } = require('./models/chatModel');
const { insertNotification } = require('./models/notificationModel');
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`🔗 User joined room: ${roomId}`);
    });

    socket.on('chatMessage', async (data) => {
      console.log('💬 chatMessage received:', data);
      const { roomId, senderId, message } = data;
      const saved = await insertChatMessage(roomId, senderId, message);
      io.to(roomId).emit('newMessage', saved);
    });

    socket.on('sendNotification', async (data) => {
      console.log('🔔 sendNotification received:', data); // ✅ Ensure this prints

      const { toUserId, message, type } = data;
      const saved = await insertNotification(toUserId, message, type);
      console.log('📦 Notification saved in DB:', saved);

      io.to(toUserId).emit('receiveNotification', saved);  // Broadcast to user room
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};