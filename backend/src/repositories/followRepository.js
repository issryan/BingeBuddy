const dynamoDb = require('../utils/db');

const FollowRepository = {
    addFollow: async (followerEmail, followedEmail) => {
        const params = {
            TableName: process.env.FOLLOW_TABLE,
            Item: { followerEmail, followedEmail },
        };
        await dynamoDb.put(params).promise();
    },

    getFollowing: async (followerEmail) => {
        const params = {
            TableName: process.env.FOLLOW_TABLE,
            KeyConditionExpression: 'followerEmail = :followerEmail',
            ExpressionAttributeValues: { ':followerEmail': followerEmail },
        };
        const result = await dynamoDb.query(params).promise();
        return result.Items.map((item) => item.followedEmail);
    },

    getFollowers: async (followedEmail) => {
        const params = {
            TableName: process.env.FOLLOW_TABLE,
            IndexName: 'followedEmail-index', // Ensure the index name matches
            KeyConditionExpression: 'followedEmail = :followedEmail',
            ExpressionAttributeValues: { ':followedEmail': followedEmail },
        };
        const result = await dynamoDb.query(params).promise();
        return result.Items.map((item) => item.followerEmail);
    },

    removeFollow: async (followerEmail, followedEmail) => {
        const params = {
            TableName: process.env.FOLLOW_TABLE,
            Key: { followerEmail, followedEmail },
        };
        await dynamoDb.delete(params).promise();
    },
};

module.exports = FollowRepository;