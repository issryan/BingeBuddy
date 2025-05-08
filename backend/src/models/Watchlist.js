const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        ref: 'User'
    },
    showId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    poster: String,
    rank: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Create a compound index to ensure unique show entries per user
watchlistSchema.index({ email: 1, showId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema); 