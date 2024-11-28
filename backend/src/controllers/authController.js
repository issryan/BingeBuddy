const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { email, password: hashedPassword, username };
        await User.register(user);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

exports.login = async (req, res) => {
    console.log("Login endpoint hit:", req.body);
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, username: user.username });
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};