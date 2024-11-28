const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const Watchlist = require('../models/watchlistModel');
const dynamoDb = require('../utils/db'); 

// Add a show to the watchlist
router.post('/', authenticateToken, async (req, res) => {
    const { email, showId, title, rating, description, poster } = req.body;

    // Log incoming request
    console.log('Incoming watchlist request:', req.body);

    try {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Item: {
                email,
                showId: showId.toString(), // Convert showId to string
                title,
                rating,
                description,
                poster,
            },
        };

        // Log DynamoDB params
        console.log('DynamoDB params:', params);

        await dynamoDb.put(params).promise();
        res.status(201).json({ message: 'Show added to watchlist' });
    } catch (err) {
        console.error('Error adding show to watchlist:', err.message);
        res.status(500).json({ message: 'Error adding show to watchlist', error: err.message });
    }
});

// Get all shows in the watchlist
router.get('/', authenticateToken, async (req, res) => {
    const email = req.user.email;

    try {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        };

        const result = await dynamoDb.query(params).promise();

        // Sort results by rating if requested
        const { sort } = req.query;
        const items = result.Items;
        if (sort === 'rating') {
            items.sort((a, b) => b.rating - a.rating); // Descending order
        }

        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving watchlist', error: err.message });
    }
});

// Remove a show from the watchlist
router.delete('/:showId', authenticateToken, async (req, res) => {
    const email = req.user.email;
    const { showId } = req.params;

    try {
        await Watchlist.removeShow(email, showId);
        res.status(200).json({ message: 'Show removed from watchlist' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing show from watchlist', error: err.message });
    }
});

module.exports = router;