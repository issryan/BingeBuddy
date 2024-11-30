import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Watchlist.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/watchlist`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWatchlist(response.data);
            } catch (err) {
                console.error('Error fetching watchlist:', err.response?.data || err.message);
                setError('Failed to fetch watchlist. Please try again.');
            }
        };

        fetchWatchlist();
    }, [API_BASE_URL]);

    const handleDelete = async (showId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/watchlist/${showId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the watchlist after deletion
            setWatchlist((prevWatchlist) => prevWatchlist.filter((show) => show.showId !== showId));
            alert('Show removed from your watchlist.');
        } catch (err) {
            console.error('Error deleting show:', err.response?.data || err.message);
            alert('Failed to delete show. Please try again.');
        }
    };

    const handleShowDetails = (showId) => {
        navigate(`/show/${showId}`); // Navigate to the details page
    };

    return (
        <div className="watchlist-page">
            <h1 className="watchlist-title">Your Watchlist</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="watchlist-grid">
                {watchlist.map((show) => (
                    <div
                        key={show.showId}
                        className="show-card"
                        onClick={() => handleShowDetails(show.showId)} // Navigate to details page
                    >
                        <img
                            src={show.poster}
                            alt={show.title}
                            className="show-card-poster"
                        />
                        <div className="show-card-details">
                            <h3 className="show-title">{show.title}</h3>
                            <p className="show-rating">User Rating: {show.rating}/10</p>
                        </div>
                        <button
                            className="delete-button"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering card click
                                handleDelete(show.showId);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watchlist;