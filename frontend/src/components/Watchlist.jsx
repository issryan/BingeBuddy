import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Watchlist.css';
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/watchlist', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWatchlist(response.data);
            } catch (err) {
                console.error('Error fetching watchlist:', err.response?.data || err.message);
                setError('Failed to fetch watchlist. Please try again.');
            }
        };

        fetchWatchlist();
    }, []);

    return (
        <div className="watchlist-page">
            <h1 className="watchlist-title">Your Show Ratings</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="watchlist-grid">
                {watchlist.map((show) => (
                    <div key={show.showId} className="show-card">
                        <img
                            src={show.poster}
                            alt={show.title}
                            className="show-card-poster"
                        />
                        <div className="show-card-details">
                            <h3 className="show-title">{show.title}</h3>
                            <p className="show-rating">User Rating: {show.rating}/10</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watchlist;