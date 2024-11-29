const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/add-friend', authenticateToken, userController.addFriend);
router.get('/friends', authenticateToken, userController.getFriends);
router.patch('/update-profile', authenticateToken, userController.updateProfile);

module.exports = router;