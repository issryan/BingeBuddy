const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const dynamoDb = require('../utils/db');

// Add a friend
router.post('/add-friend', authenticateToken, async (req, res) => {
    const { friendEmail } = req.body;
    const userEmail = req.user.email;

    try {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email: userEmail },
            UpdateExpression: 'ADD friends :friend',
            ExpressionAttributeValues: {
                ':friend': dynamoDb.createSet([friendEmail]),
            },
            ReturnValues: 'UPDATED_NEW',
        };

        await dynamoDb.update(params).promise();
        res.status(200).json({ message: 'Friend added successfully!' });
    } catch (err) {
        console.error('Error adding friend:', err.message);
        res.status(500).json({ message: 'Failed to add friend.', error: err.message });
    }
});

// Get friends
router.get('/friends', authenticateToken, async (req, res) => {
    const userEmail = req.user.email;

    try {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email: userEmail },
        };

        const result = await dynamoDb.get(params).promise();
        res.status(200).json({ friends: result.Item?.friends?.values || [] });
    } catch (err) {
        console.error('Error fetching friends:', err.message);
        res.status(500).json({ message: 'Failed to fetch friends.', error: err.message });
    }
});

// Update profile
router.patch('/update-profile', authenticateToken, async (req, res) => {
    const { username, email, password } = req.body;
    const userEmail = req.user.email;

    const updates = [];
    const attributeValues = {};
    if (username) {
        updates.push('username = :username');
        attributeValues[':username'] = username;
    }
    if (email) {
        updates.push('email = :email');
        attributeValues[':email'] = email;
    }
    if (password) {
        updates.push('password = :password');
        attributeValues[':password'] = password; // Ensure it's hashed
    }

    try {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email: userEmail },
            UpdateExpression: `SET ${updates.join(', ')}`,
            ExpressionAttributeValues: attributeValues,
            ReturnValues: 'UPDATED_NEW',
        };

        const result = await dynamoDb.update(params).promise();
        res.status(200).json({ message: 'Profile updated successfully!', updatedAttributes: result.Attributes });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ message: 'Failed to update profile.', error: err.message });
    }
});

module.exports = router;