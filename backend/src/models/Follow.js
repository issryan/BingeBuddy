const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    followerEmail: {
        type: String,
        required: true,
        ref: 'User'
    },
    followedEmail: {
        type: String,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Create a compound index to ensure unique follow relationships
followSchema.index({ followerEmail: 1, followedEmail: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema); 