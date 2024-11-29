const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');
const { UserRegisterDTO, UserLoginDTO } = require('../dtos/userDTO');

// Register a new user
exports.register = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Map input data to a DTO
        const userRegisterDTO = new UserRegisterDTO(email, username, password);

        // Check if the user already exists
        const existingUser = await UserRepository.findByEmail(userRegisterDTO.email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userRegisterDTO.password, 10);

        // Save the user in the database
        const newUser = {
            email: userRegisterDTO.email,
            username: userRegisterDTO.username,
            password: hashedPassword,
        };

        await UserRepository.create(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Map input data to a DTO
        const userLoginDTO = new UserLoginDTO(email, password);

        // Fetch user from repository
        const user = await UserRepository.findByEmail(userLoginDTO.email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(userLoginDTO.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
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