import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComparisonComponent = ({ newShow, onRankingComplete }) => {
    const [comparisonShow, setComparisonShow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(0);
    const [watchlist, setWatchlist] = useState([]);

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
                setComparisonShow(items[Math.floor((0 + items.length - 1) / 2)]);
            }
        } catch (err) {
            console.error('Error fetching watchlist:', err);
            setComparisonShow(null);
        }
    };

    const handleComparison = async (preference) => {
        if (!comparisonShow || !newShow) {
            console.error('Comparison or new show missing.');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const mid = Math.floor((low + high) / 2);

            if (preference === 'new') {
                setHigh(mid - 1);
            } else {
                setLow(mid + 1);
            }

            if (low > high) {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');

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
                onRankingComplete();
            } else {
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
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        const payload = {
            email,
            showId: newShow.id.toString(),
            title: newShow.name,
            description: newShow.overview,
            poster: `https://image.tmdb.org/t/p/w500${newShow.poster_path}`,
            rating: 10,
        };

        console.log("Adding first show payload:", payload);

        return (
            <div>
                <button
                    onClick={async () => {
                        try {
                            await axios.post('http://localhost:4000/watchlist', payload, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            alert(`${newShow.name} has been added to your watchlist!`);
                            onRankingComplete();
                        } catch (err) {
                            console.error('Error adding first show:', err.response?.data || err.message);
                            alert('Failed to add the first show. Please try again.');
                        }
                    }}
                >
                    Confirm
                </button>
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