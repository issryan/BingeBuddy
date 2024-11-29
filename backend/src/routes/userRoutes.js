const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');


// Profile-related routes
router.patch('/update-profile', authenticateToken, userController.updateProfile);
router.get('/profile', authenticateToken, userController.getProfile);
router.delete('/delete', authenticateToken, userController.deleteUser);

// User suggestions and follow functionality
router.get('/users', authenticateToken, userController.getAvailableUsers);
router.post('/follow', authenticateToken, userController.followUser);
router.post('/unfollow', authenticateToken, userController.unfollowUser);
router.get('/follow-stats', authenticateToken, userController.getFollowStats);

module.exports = router;