const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Search for TV shows
router.get('/search', authenticateToken, async (req, res) => {
    const query = req.query.q;

    console.log('Query received:', query); // Debug log
    console.log('Authenticated user:', req.user); // Debug log

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );

        const results = response.data.results.map((show) => ({
            id: show.id,
            name: show.name,
            overview: show.overview,
            poster_path: show.poster_path,
            vote_average: show.vote_average,
        }));

        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching TV shows:', err.message);
        res.status(500).json({ message: 'Error fetching TV shows', error: err.message });
    }
});

module.exports = router;