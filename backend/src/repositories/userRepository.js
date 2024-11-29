const dynamoDb = require('../utils/db');

const UserRepository = {
    // Create a new user
    create: async (user) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Item: user,
        };
        await dynamoDb.put(params).promise();
    },

    // Find a user by email
    findByEmail: async (email) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email },
        };
        const result = await dynamoDb.get(params).promise();
        return result.Item || null;
    },

    // Add a friend
    addFriend: async (userEmail, friendEmail) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email: userEmail },
            UpdateExpression: 'ADD friends :friend',
            ExpressionAttributeValues: {
                ':friend': dynamoDb.createSet([friendEmail]),
            },
        };
        await dynamoDb.update(params).promise();
    },

    // Get friends of a user
    getFriends: async (userEmail) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email: userEmail },
        };
        const result = await dynamoDb.get(params).promise();
        return result.Item?.friends?.values || [];
    },

    // Update user's password
    updatePassword: async (email, hashedPassword) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email },
            UpdateExpression: 'SET password = :password',
            ExpressionAttributeValues: { ':password': hashedPassword },
        };
        await dynamoDb.update(params).promise();
    },

    // Delete a user
    deleteUser: async (email) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email },
        };
        await dynamoDb.delete(params).promise();
    },

    // Get all users except the current user
    getAvailableUsers: async (currentUserEmail) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            FilterExpression: 'email <> :email',
            ExpressionAttributeValues: { ':email': currentUserEmail },
        };
        const result = await dynamoDb.scan(params).promise();
        return result.Items || [];
    },

    // Follow another user
    followUser: async (followerEmail, followedEmail) => {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: { email: followerEmail },
            UpdateExpression: 'ADD following :followedEmail',
            ExpressionAttributeValues: {
                ':followedEmail': dynamoDb.createSet([followedEmail]),
            },
        };
        await dynamoDb.update(params).promise();
    },
};

module.exports = UserRepository;