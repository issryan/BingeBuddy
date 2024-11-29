const dynamoDb = require('../utils/db');
const bcrypt = require('bcrypt');

// Add a friend
exports.addFriend = async (req, res) => {
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
};

// Get friends
exports.getFriends = async (req, res) => {
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
};

// Update profile
// Update profile with password verification
exports.updateProfile = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userEmail = req.user.email;

    try {
        // Fetch the user
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email: userEmail },
        };

        const user = await dynamoDb.get(params).promise();

        if (!user.Item) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.Item.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const updateParams = {
            TableName: process.env.USERS_TABLE,
            Key: { email: userEmail },
            UpdateExpression: 'SET password = :newPassword',
            ExpressionAttributeValues: { ':newPassword': hashedPassword },
        };

        await dynamoDb.update(updateParams).promise();

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ message: 'Failed to update profile.', error: err.message });
    }
};

// Fetch user profile details
exports.getProfile = async (req, res) => {
    try {
        const { username, email } = req.user;

        const watchlistParams = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email },
        };

        const watchlistResponse = await dynamoDb.query(watchlistParams).promise();
        const watchlistCount = watchlistResponse.Items.length;

        res.status(200).json({ username, email, watchlistCount });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// Fetch available users to follow
exports.getAvailableUsers = async (req, res) => {
    try {
        const { email } = req.user;

        const params = {
            TableName: process.env.USERS_TABLE,
            FilterExpression: 'email <> :email',
            ExpressionAttributeValues: { ':email': email },
        };

        const response = await dynamoDb.scan(params).promise();
        res.status(200).json(response.Items);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Follow a user
exports.followUser = async (req, res) => {
    const { followedEmail } = req.body;
    const { email: followerEmail } = req.user;

    try {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email: followerEmail },
            UpdateExpression: 'ADD following :followedEmail',
            ExpressionAttributeValues: {
                ':followedEmail': dynamoDb.createSet([followedEmail]),
            },
        };

        await dynamoDb.update(params).promise();

        res.status(200).json({ message: `You are now following ${followedEmail}` });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Error following user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const userEmail = req.user.email;

    try {
        // Step 1: Delete all items in the user's watchlist
        const watchlistParams = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': userEmail,
            },
        };

        const watchlistItems = await dynamoDb.query(watchlistParams).promise();

        for (const item of watchlistItems.Items) {
            const deleteParams = {
                TableName: process.env.WATCHLIST_TABLE,
                Key: {
                    email: item.email,
                    showId: item.showId,
                },
            };
            await dynamoDb.delete(deleteParams).promise();
        }

        // Step 2: Delete the user from the USERS_TABLE
        const userParams = {
            TableName: process.env.USERS_TABLE,
            Key: { email: userEmail },
        };

        await dynamoDb.delete(userParams).promise();

        res.status(200).json({ message: 'User and their watchlist deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user and their watchlist:', error);
        res.status(500).json({ message: 'Failed to delete user.', error: error.message });
    }
};