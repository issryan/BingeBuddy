import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discover.css';

const Discover = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const API_KEY = process.env.REACT_APP_API_KEY;

    if (!API_BASE_URL) {
        console.error("API_BASE_URL is not defined in the .env file.");
    }

    if (!API_KEY) {
        console.error("REACT_APP_API_KEY is not defined in the .env file.");
    }

    useEffect(() => {
        const fetchDiscoverShows = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/watchlist/discover`, {
                    params: { apikey: API_KEY },
                });
                setShows(response.data);
            } catch (err) {
                console.error('Error fetching discover shows:', err);
                setError('Failed to fetch discover shows. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDiscoverShows();
    }, [API_BASE_URL, API_KEY]);

    if (loading) {
        return <p className="loading-message">Loading trending shows...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (shows.length === 0) {
        return <p className="empty-message">No shows found. Please check back later!</p>;
    }

    return (
        <div className="discover-page">
            <div className="discover-header">
                <h1>Discover Trending Shows</h1>
            </div>
            <div className="discover-grid">
                {shows.map((show) => (
                    <div className="discover-card" key={show.id}>
                        <img src={show.poster} alt={show.title} className="discover-poster" />
                        <h2 className="discover-title">{show.title}</h2>
                        <p className="discover-description">{show.description}</p>
                        <p className="rating">Rating: {show.rating}/10</p>
                        <div className="discover-actions">
                            <button className="add-to-watchlist-button">Add to Watchlist</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Discover;