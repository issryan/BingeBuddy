const dynamoDb = require('../utils/db');

const Watchlist = {
    addShow: async (show) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Item: show,
        };
        await dynamoDb.put(params).promise();
    },

    getWatchlistByEmail: async (email) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        };
        const result = await dynamoDb.query(params).promise();
        return result.Items;
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