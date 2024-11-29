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
        // Fetch the user's current watchlist
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email },
        };

        const response = await dynamoDb.query(params).promise();
        const watchlist = response.Items || [];

        let rank = 1; // Default rank for the first show

        if (watchlist.length > 0) {
            // If not the first show, let the comparison logic handle the ranking
            return res.status(400).json({
                message: 'Comparison required for additional shows.',
            });
        }

        const newShow = {
            email,
            showId: showId.toString(),
            title,
            rating,
            description,
            poster,
            rank,
        };

        const putParams = {
            TableName: process.env.WATCHLIST_TABLE,
            Item: newShow,
        };

        await dynamoDb.put(putParams).promise();
        res.status(201).json({ message: 'First show added to watchlist successfully!' });
    } catch (err) {
        console.error('Error adding show to watchlist:', err.message);
        res.status(500).json({ message: 'Error adding show to watchlist', error: err.message });
    }
});

// Get all shows in the watchlist
// Get all shows in the watchlist with calculated ratings
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

        // Sort the watchlist by rank
        const watchlist = result.Items.sort((a, b) => a.rank - b.rank);

        // Assign ratings based on rank
        const highestRank = 10;
        const lowestRank = watchlist.length > 1 ? 1 : 10; // If only 1 item, it gets a 10/10
        const totalRanks = watchlist.length;

        watchlist.forEach((show, index) => {
            const normalizedRank = (totalRanks - index) / totalRanks;
            show.rating = Math.round((normalizedRank * (highestRank - lowestRank)) + lowestRank);
        });

        res.status(200).json(watchlist);
    } catch (err) {
        console.error('Error retrieving watchlist:', err.message);
        res.status(500).json({ message: 'Error retrieving watchlist', error: err.message });
    }
});

// Remove a show from the watchlist
router.delete('/:showId', authenticateToken, async (req, res) => {
    const email = req.user.email;
    const { showId } = req.params;

    try {
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            Key: {
                email,
                showId: showId.toString(),
            },
        };

        await dynamoDb.delete(params).promise();
        res.status(200).json({ message: 'Show removed from watchlist' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing show from watchlist', error: err.message });
    }
});

// Compare shows for ranking
router.post('/compare', authenticateToken, async (req, res) => {
    const { email, newShow, comparisonShowId, preference } = req.body;

    try {
        // Fetch user's watchlist
        const params = {
            TableName: process.env.WATCHLIST_TABLE,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email },
        };

        const response = await dynamoDb.query(params).promise();
        const watchlist = response.Items;

        // Sort watchlist by rank
        watchlist.sort((a, b) => a.rank - b.rank);

        // Find the comparison show index
        const comparisonIndex = watchlist.findIndex(
            (show) => show.showId === comparisonShowId
        );

        if (comparisonIndex === -1) {
            return res.status(400).json({ message: 'Comparison show not found.' });
        }

        // Determine the new show's rank
        let newRank;
        if (preference === 'new') {
            newRank = watchlist[comparisonIndex].rank - 0.5;
        } else if (preference === 'existing') {
            newRank = watchlist[comparisonIndex].rank + 0.5;
        }

        // Update ranks for all shows below the new position
        for (let i = comparisonIndex + 1; i < watchlist.length; i++) {
            const updateParams = {
                TableName: process.env.WATCHLIST_TABLE,
                Key: {
                    email,
                    showId: watchlist[i].showId,
                },
                UpdateExpression: 'SET #rank = :rank',
                ExpressionAttributeNames: {
                    '#rank': 'rank', // Alias for reserved keyword
                },
                ExpressionAttributeValues: {
                    ':rank': i + 1, // Increment rank
                },
            };

            await dynamoDb.update(updateParams).promise();
        }

        // Add the new show to the watchlist with its rank
        const newShowParams = {
            TableName: process.env.WATCHLIST_TABLE,
            Item: {
                email,
                showId: newShow.id.toString(),
                title: newShow.name,
                description: newShow.overview,
                poster: newShow.poster_path
                    ? `https://image.tmdb.org/t/p/w500${newShow.poster_path}`
                    : null,
                rank: newRank,
            },
        };

        await dynamoDb.put(newShowParams).promise();

        res.status(200).json({ message: 'Show successfully ranked!' });
    } catch (err) {
        console.error('Error during ranking:', err);
        res.status(500).json({ message: 'Failed to rank show', error: err.message });
    }
});

module.exports = router;