const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/watchlist', watchlistRoutes);

app.get('/', (req, res) => res.send('BingeBuddy API is running!'));

module.exports = app;