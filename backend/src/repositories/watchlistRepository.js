const dynamoDb = require('../utils/db');
const WatchlistDTO = require('../dtos/watchlistDTO');
const axios = require('axios');

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

    fetchTrendingShows: async () => {
        const params = { api_key: process.env.TMDB_API_KEY };
        const response = await axios.get('https://api.themoviedb.org/3/trending/all/day', { params });
        return response.data.results.map((show) => ({
            id: show.id,
            title: show.title || show.name,
            description: show.overview,
            poster: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
            rating: show.vote_average,
        }));
    },
};

module.exports = WatchlistRepository;