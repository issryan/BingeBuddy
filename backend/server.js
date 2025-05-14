const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./src/utils/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/watchlist', require('./src/routes/watchlistRoutes'));
app.use('/api/search', require('./src/routes/searchRoutes'));

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});