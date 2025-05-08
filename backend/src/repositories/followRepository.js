const Follow = require('../models/Follow');

const FollowRepository = {
    addFollow: async (followerEmail, followedEmail) => {
        const follow = new Follow({ followerEmail, followedEmail });
        return await follow.save();
    },

    getFollowing: async (followerEmail) => {
        const follows = await Follow.find({ followerEmail });
        return follows.map(follow => follow.followedEmail);
    },

    getFollowers: async (followedEmail) => {
        const follows = await Follow.find({ followedEmail });
        return follows.map(follow => follow.followerEmail);
    },

    removeFollow: async (followerEmail, followedEmail) => {
        return await Follow.findOneAndDelete({ followerEmail, followedEmail });
    }
};

module.exports = FollowRepository;