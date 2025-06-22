const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.sendNotification); // Send notification
router.get('/:userId', notificationController.getUserNotifications); // Get notifications

module.exports = router;
