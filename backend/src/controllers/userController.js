const UserRepository = require('../repositories/userRepository');
const WatchlistRepository = require('../repositories/watchlistRepository');
const UserDTO = require('../dtos/userDTO');
const bcrypt = require('bcrypt');

// Add a friend
exports.addFriend = async (req, res) => {
    const { friendEmail } = req.body;
    const userEmail = req.user.email;

    try {
        await UserRepository.addFriend(userEmail, friendEmail);
        res.status(200).json({ message: 'Friend added successfully!' });
    } catch (err) {
        console.error('Error adding friend:', err.message);
        res.status(500).json({ message: 'Failed to add friend.', error: err.message });
    }
};

// Get friends
exports.getFriends = async (req, res) => {
    const userEmail = req.user.email;

    try {
        const friends = await UserRepository.getFriends(userEmail);
        res.status(200).json({ friends });
    } catch (err) {
        console.error('Error fetching friends:', err.message);
        res.status(500).json({ message: 'Failed to fetch friends.', error: err.message });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userEmail = req.user.email;

    try {
        const user = await UserRepository.findByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
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
        const userEmail = req.user.email;
        const user = await UserRepository.findByEmail(userEmail);
        const watchlistCount = await WatchlistRepository.getWatchlistCount(userEmail);

        const userProfile = UserDTO.toResponse(user, watchlistCount);
        res.status(200).json(userProfile);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ message: 'Error fetching profile.' });
    }
};

// Fetch available users to follow
exports.getAvailableUsers = async (req, res) => {
    const { email } = req.user;

    try {
        const users = await UserRepository.getAvailableUsers(email);
        const userDTOs = users.map(UserDTO.toResponse);
        res.status(200).json(userDTOs);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Error fetching users.' });
    }
};

// Follow a user
exports.followUser = async (req, res) => {
    const { followedEmail } = req.body;
    const followerEmail = req.user.email;

    try {
        await UserRepository.followUser(followerEmail, followedEmail);
        res.status(200).json({ message: `You are now following ${followedEmail}` });
    } catch (err) {
        console.error('Error following user:', err.message);
        res.status(500).json({ message: 'Error following user.', error: err.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const userEmail = req.user.email;

    try {
        await WatchlistRepository.clearUserWatchlist(userEmail);
        await UserRepository.deleteUser(userEmail);

        res.status(200).json({ message: 'User and their watchlist deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user and their watchlist:', err.message);
        res.status(500).json({ message: 'Failed to delete user.', error: err.message });
    }
};