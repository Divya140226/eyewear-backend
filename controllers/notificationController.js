const notificationModel = require('../models/notificationModel');

exports.sendNotification = async (req, res) => {
  const { toUserId, message, type } = req.body;
  try {
    const newNotification = await notificationModel.insertNotification(toUserId, message, type);
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  const toUserId = req.params.userId;
  try {
    const notifications = await notificationModel.getNotificationsByUser(toUserId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
