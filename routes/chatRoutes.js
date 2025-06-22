const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.saveChatMessage); // save message
router.get('/:roomId', chatController.getRoomMessages); // get all messages in a room

module.exports = router;
