const dynamoDb = require('../utils/db');

const Watchlist = {
    addShow: async (show) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Item: show,
        };
        await dynamoDb.put(params).promise();
    },

    getShowsByUser: async (email) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email },
        };
        const result = await dynamoDb.query(params).promise();
        return result.Items.sort((a, b) => a.rank - b.rank);
    },
    
    updateShowRank: async (email, showId, rank) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Key: { email, showId },
            UpdateExpression: 'set rank = :rank',
            ExpressionAttributeValues: { ':rank': rank },
        };
        await dynamoDb.update(params).promise();
    },

    removeShow: async (email, showId) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Key: {
                email,
                showId,
            },
        };
        await dynamoDb.delete(params).promise();
    },
};

module.exports = Watchlist;