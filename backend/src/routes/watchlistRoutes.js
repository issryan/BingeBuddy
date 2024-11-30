const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    addShow,
    getWatchlist,
    deleteShow,
    compareShow,
    getDiscoverShows,
} = require('../controllers/watchlistController');

const router = express.Router();

router.post('/', authenticateToken, addShow);
router.get('/', authenticateToken, getWatchlist);
router.delete('/:showId', authenticateToken, deleteShow);
router.post('/compare', authenticateToken, compareShow);
router.get('/discover', getDiscoverShows); 

module.exports = router;