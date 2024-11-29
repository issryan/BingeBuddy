const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository');
const WatchlistRepository = require('../repositories/watchlistRepository');
const FollowRepository = require('../repositories/followRepository');
const dynamoDb = require('../utils/db');

// Update profile with password verification
exports.updateProfile = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userEmail = req.user.email;

    try {
        // Fetch user
        const user = await UserRepository.findByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in the database
        await UserRepository.updatePassword(userEmail, hashedPassword);

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ message: 'Failed to update profile.', error: err.message });
    }
};

// Fetch user profile details
exports.getProfile = async (req, res) => {
    try {
        const { email, username } = req.user;

        // Fetch followers and following
        const following = await FollowRepository.getFollowing(email);
        const followers = await FollowRepository.getFollowers(email);

        res.status(200).json({
            email,
            username,
            followers,
            following,
            followersCount: followers.length,
            followingCount: following.length,
        });
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Fetch available users to follow
exports.getAvailableUsers = async (req, res) => {
    try {
        const { email } = req.user;

        const availableUsers = await UserRepository.getAvailableUsers(email);
        res.status(200).json(availableUsers);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// Follow a user
exports.followUser = async (req, res) => {
    const { followedEmail } = req.body;
    const { email: followerEmail } = req.user;

    try {
        await FollowRepository.addFollow(followerEmail, followedEmail);
        res.status(200).json({ message: `You are now following ${followedEmail}` });
    } catch (error) {
        console.error('Error following user:', error.message);
        res.status(500).json({ message: 'Error following user', error: error.message });
    }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    const { followedEmail } = req.body;
    const { email: followerEmail } = req.user;

    try {
        await FollowRepository.removeFollow(followerEmail, followedEmail); // Implement this in the repository
        res.status(200).json({ message: `You have unfollowed ${followedEmail}` });
    } catch (error) {
        console.error('Error unfollowing user:', error.message);
        res.status(500).json({ message: 'Error unfollowing user', error: error.message });
    }
};

// Get followers and following for the profile
exports.getFollowStats = async (req, res) => {
    const { email } = req.user;

    try {
        const followers = await FollowRepository.getFollowers(email);
        const following = await FollowRepository.getFollowing(email);

        res.status(200).json({ followers, following });
    } catch (error) {
        console.error('Error fetching follow stats:', error.message);
        res.status(500).json({ message: 'Error fetching follow stats', error: error.message });
    }
};

// Delete user and their watchlist
exports.deleteUser = async (req, res) => {
    const userEmail = req.user.email;

    try {
        // Delete user's watchlist
        const watchlistItems = await WatchlistRepository.getShowsByUser(userEmail);
        for (const item of watchlistItems) {
            await WatchlistRepository.removeShow(userEmail, item.showId);
        }

        // Delete the user
        await UserRepository.deleteUser(userEmail);

        res.status(200).json({ message: 'User and their watchlist deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user and their watchlist:', err.message);
        res.status(500).json({ message: 'Failed to delete user.', error: err.message });
    }
};