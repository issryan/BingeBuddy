const WatchlistRepository = require('../repositories/watchlistRepository');
const WatchlistDTO = require('../dtos/watchlistDTO');

// Add a show to the watchlist
exports.addShow = async (req, res) => {
    const { email, showId, title, description, poster } = req.body;

    try {
        const watchlist = await WatchlistRepository.getShowsByUser(email);
        let rank = 1; // Default rank for the first show

        if (watchlist.length > 0) {
            // If not the first show, return a message to trigger comparison
            return res.status(400).json({ message: 'Comparison required for additional shows.' });
        }

        const newShow = new WatchlistDTO(email, showId.toString(), title, description, poster, rank);
        await WatchlistRepository.addShow(WatchlistDTO.toDatabase(newShow));

        res.status(201).json({ message: 'First show added to watchlist successfully!' });
    } catch (err) {
        console.error('Error adding show to watchlist:', err.message);
        res.status(500).json({ message: 'Error adding show to watchlist', error: err.message });
    }
};

// Get all shows in the watchlist
exports.getWatchlist = async (req, res) => {
    const email = req.user.email;

    try {
        const watchlistItems = await WatchlistRepository.getShowsByUser(email);

        // Sort and normalize ranks
        const totalRanks = watchlistItems.length;
        const highestRank = 10;
        const lowestRank = watchlistItems.length > 1 ? 1 : 10;

        const watchlist = watchlistItems.map((item, index) => {
            const normalizedRank = (totalRanks - index) / totalRanks;
            const rating = Math.round((normalizedRank * (highestRank - lowestRank)) + lowestRank);
            const dto = WatchlistDTO.fromDatabase(item);
            return { ...dto, rating };
        });

        res.status(200).json(watchlist);
    } catch (err) {
        console.error('Error retrieving watchlist:', err.message);
        res.status(500).json({ message: 'Error retrieving watchlist', error: err.message });
    }
};

// Remove a show from the watchlist
exports.deleteShow = async (req, res) => {
    const email = req.user.email;
    const { showId } = req.params;

    try {
        await WatchlistRepository.removeShow(email, showId.toString());
        res.status(200).json({ message: 'Show removed from watchlist' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing show from watchlist', error: err.message });
    }
};

// Compare shows for ranking
exports.compareShow = async (req, res) => {
    const { email, newShow, comparisonShowId, preference } = req.body;

    try {
        const watchlist = await WatchlistRepository.getShowsByUser(email);

        // Sort watchlist by rank
        watchlist.sort((a, b) => a.rank - b.rank);

        // Find the comparison show index
        const comparisonIndex = watchlist.findIndex((show) => show.showId === comparisonShowId);

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

        const newShowDTO = new WatchlistDTO(
            email,
            newShow.id.toString(),
            newShow.name,
            newShow.overview,
            newShow.poster_path ? `https://image.tmdb.org/t/p/w500${newShow.poster_path}` : null,
            newRank
        );

        await WatchlistRepository.addShow(WatchlistDTO.toDatabase(newShowDTO));
        res.status(200).json({ message: 'Show successfully ranked!' });
    } catch (err) {
        console.error('Error during ranking:', err.message);
        res.status(500).json({ message: 'Failed to rank show', error: err.message });
    }
};