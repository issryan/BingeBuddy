const User = require('../models/User');

const UserRepository = {
    // Create a new user
    create: async (user) => {
        const newUser = new User(user);
        return await newUser.save();
    },

    // Find a user by email
    findByEmail: async (email) => {
        return await User.findOne({ email });
    },

    // Get friends of a user
    getFriends: async (userEmail) => {
        const user = await User.findOne({ email: userEmail });
        return user?.friends || [];
    },

    // Update user's password
    updatePassword: async (email, hashedPassword) => {
        return await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );
    },

    // Delete a user
    deleteUser: async (email) => {
        return await User.findOneAndDelete({ email });
    },

    // Get all users except the current user
    getAvailableUsers: async (currentUserEmail) => {
        return await User.find({ email: { $ne: currentUserEmail } });
    }
};

module.exports = UserRepository;