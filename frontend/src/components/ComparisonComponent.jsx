import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComparisonComponent = ({ newShow, onRankingComplete }) => {
    const [comparisonShow, setComparisonShow] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchComparisonShow = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/watchlist', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const watchlist = response.data;

            if (watchlist.length === 0) {
                setComparisonShow(null); // No comparison needed for the first show
                return;
            }

            const middleIndex = Math.floor(watchlist.length / 2);
            setComparisonShow(watchlist[middleIndex]);
        } catch (err) {
            console.error('Error fetching comparison show:', err);
            setComparisonShow(null);
        }
    };

    const handleAddFirstShow = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');

            await axios.post(
                'http://localhost:4000/watchlist',
                {
                    email,
                    showId: newShow.id.toString(),
                    title: newShow.name,
                    description: newShow.overview,
                    poster: `https://image.tmdb.org/t/p/w500${newShow.poster_path}`,
                    rating: 10, // Automatically assign the first show a 10
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(`${newShow.name} added as your first show with a rating of 10!`);
            onRankingComplete();
        } catch (err) {
            console.error('Error adding first show:', err.response?.data || err.message);
            alert('Failed to add the first show. Please try again.');
        }
    };

    const handleComparison = async (preference) => {
        if (!newShow || !comparisonShow) {
            console.error('Comparison data missing.');
            return;
        }

        setLoading(true);
        try {
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

            onRankingComplete();
        } catch (err) {
            console.error('Error ranking show:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComparisonShow();
    }, []);

    if (!newShow) {
        return <p>Error: No new show selected.</p>;
    }

    if (!comparisonShow) {
        return (
            <div>
                <p>{newShow.name} will be added as your first show!</p>
                <button onClick={handleAddFirstShow}>Confirm</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Which show do you prefer?</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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