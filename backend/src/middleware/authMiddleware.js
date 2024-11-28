const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

    if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user data to the request object
        next(); // Call the next middleware
    } catch (err) {
        console.error('Token validation error:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};