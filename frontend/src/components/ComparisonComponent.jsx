import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComparisonComponent = ({ newShow, onRankingComplete }) => {
    const [comparisonShow, setComparisonShow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [low, setLow] = useState(0); // Start of the ranking range
    const [high, setHigh] = useState(0); // End of the ranking range
    const [watchlist, setWatchlist] = useState([]); // Full watchlist for comparisons

    // Fetch the watchlist and initialize the range
    const fetchWatchlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/watchlist', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const items = response.data;
            setWatchlist(items);

            if (items.length > 0) {
                setLow(0);
                setHigh(items.length - 1);
                setComparisonShow(items[Math.floor((0 + items.length - 1) / 2)]); // Compare with middle show first
            }
        } catch (err) {
            console.error('Error fetching watchlist:', err);
            setComparisonShow(null);
        }
    };

    // Handle user preference for the comparison
    const handleComparison = async (preference) => {
        if (!comparisonShow || !newShow) {
            console.error('Comparison or new show missing.');
            return;
        }

        if (loading) return; // Prevent multiple requests
        setLoading(true);

        try {
            const mid = Math.floor((low + high) / 2);

            if (preference === 'new') {
                // User prefers the new show over the current comparison
                setHigh(mid - 1);
            } else {
                // User prefers the existing comparison show
                setLow(mid + 1);
            }

            // Check if the range is narrowed down to one position
            if (low > high) {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');

                // Finalize the ranking in the backend
                await axios.post(
                    'http://localhost:4000/watchlist/compare',
                    {
                        email,
                        newShow,
                        comparisonShowId: comparisonShow.showId,
                        preference,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                alert(`${newShow.name} has been added to your watchlist!`);
                onRankingComplete(); // Notify parent that ranking is complete
            } else {
                // Continue to the next comparison
                const nextMid = Math.floor((low + high) / 2);
                setComparisonShow(watchlist[nextMid]);
            }
        } catch (err) {
            console.error('Error ranking show:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    if (!newShow) {
        return <p>Error: No new show selected.</p>;
    }

    if (!comparisonShow) {
        return (
            <div>
                <p>{newShow.name} will be added to your watchlist as the first show.</p>
                <button onClick={onRankingComplete}>Confirm</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Compare Shows</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div onClick={() => handleComparison('new')} style={{ cursor: 'pointer' }}>
                    <img
                        src={`https://image.tmdb.org/t/p/w500${newShow.poster_path}`}
                        alt={newShow.name}
                        style={{ width: '150px' }}
                    />
                    <p>{newShow.name}</p>
                </div>
                <div onClick={() => handleComparison('existing')} style={{ cursor: 'pointer' }}>
                    <img
                        src={`https://image.tmdb.org/t/p/w500${comparisonShow.poster}`}
                        alt={comparisonShow.title}
                        style={{ width: '150px' }}
                    />
                    <p>{comparisonShow.title}</p>
                </div>
            </div>
            {loading && <p>Saving your preference...</p>}
        </div>
    );
};

export default ComparisonComponent;