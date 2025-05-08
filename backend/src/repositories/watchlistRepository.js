const Watchlist = require('../models/Watchlist');
const WatchlistDTO = require('../dtos/watchlistDTO');
const axios = require('axios');

const WatchlistRepository = {
    addShow: async (show) => {
        const watchlistItem = new Watchlist(WatchlistDTO.toDatabase(show));
        return await watchlistItem.save();
    },

    getShowsByUser: async (email) => {
        const shows = await Watchlist.find({ email }).sort({ rank: 1 });
        return shows.map(item => WatchlistDTO.fromDatabase(item));
    },

    countShowsByUser: async (email) => {
        return await Watchlist.countDocuments({ email });
    },

    updateShowRank: async (email, showId, rank) => {
        return await Watchlist.findOneAndUpdate(
            { email, showId },
            { rank },
            { new: true }
        );
    },

    removeShow: async (email, showId) => {
        return await Watchlist.findOneAndDelete({ email, showId });
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
    }
};

module.exports = WatchlistRepository;