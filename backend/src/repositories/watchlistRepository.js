const dynamoDb = require('../utils/db');
const WatchlistDTO = require('../dtos/watchlistDTO');

const WatchlistRepository = {
    addShow: async (show) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Item: WatchlistDTO.toDatabase(show),
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
        return result.Items.map((item) => WatchlistDTO.fromDatabase(item)) 
            .sort((a, b) => a.rank - b.rank);
    },

    countShowsByUser: async (email) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email },
            Select: 'COUNT', // Only count items
        };
        const result = await dynamoDb.query(params).promise();
        return result.Count; // Returns the number of items
    },

    updateShowRank: async (email, showId, rank) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Key: { email, showId },
            UpdateExpression: 'SET rank = :rank',
            ExpressionAttributeValues: { ':rank': rank },
        };
        await dynamoDb.update(params).promise();
    },

    removeShow: async (email, showId) => {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Key: { email, showId },
        };
        await dynamoDb.delete(params).promise();
    },
};

module.exports = WatchlistRepository;