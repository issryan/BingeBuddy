const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Friend-related routes
router.post('/add-friend', authenticateToken, userController.addFriend);
router.get('/friends', authenticateToken, userController.getFriends);

// Profile-related routes
router.patch('/update-profile', authenticateToken, userController.updateProfile);
router.get('/profile', authenticateToken, userController.getProfile);

// User suggestions and follow functionality
router.get('/users', authenticateToken, userController.getAvailableUsers);
router.post('/follow', authenticateToken, userController.followUser);

module.exports = router;