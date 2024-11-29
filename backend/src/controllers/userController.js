const dynamoDb = require('../utils/db');

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
exports.updateProfile = async (req, res) => {
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
        updates.push('password = :password'); // Ensure it's hashed
        attributeValues[':password'] = password;
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
};

// Fetch user profile details
exports.getProfile = async (req, res) => {
    try {
        const { username, email } = req.user;

        // Count watchlist items
        const watchlistParams = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email },
        };

        const watchlistResponse = await dynamoDb.query(watchlistParams).promise();
        const watchlistCount = watchlistResponse.Items.length;

        // Count followers and following
        const followersParams = {
            TableName: process.env.FOLLOWERS_TABLE,
            KeyConditionExpression: 'followedEmail = :email',
            ExpressionAttributeValues: { ':email': email },
        };

        const followersResponse = await dynamoDb.query(followersParams).promise();
        const followersCount = followersResponse.Items.length;

        const followingParams = {
            TableName: process.env.FOLLOWERS_TABLE,
            KeyConditionExpression: 'followerEmail = :email',
            ExpressionAttributeValues: { ':email': email },
        };

        const followingResponse = await dynamoDb.query(followingParams).promise();
        const followingCount = followingResponse.Items.length;

        res.status(200).json({
            username,
            email,
            watchlistCount,
            followersCount,
            followingCount,
        });
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
            FilterExpression: 'email <> :email', // Exclude current user
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
            TableName: process.env.FOLLOWERS_TABLE,
            Item: { followerEmail, followedEmail },
        };

        await dynamoDb.put(params).promise();
        res.status(200).json({ message: `You are now following ${followedEmail}` });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Error following user' });
    }
};