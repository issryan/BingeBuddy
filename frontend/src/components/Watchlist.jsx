import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [sortedWatchlist, setSortedWatchlist] = useState([]);
    const [error, setError] = useState('');
    const [sortOption, setSortOption] = useState('rating'); 

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/watchlist', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWatchlist(response.data);
                setSortedWatchlist(response.data); 
                setError('');
            } catch (err) {
                console.error('Error fetching watchlist:', err);
                setError('Failed to fetch watchlist. Please try again.');
            }
        };

        fetchWatchlist();
    }, []);

    const handleSort = (option) => {
        setSortOption(option);
        const sorted = [...watchlist].sort((a, b) => {
            if (option === 'rating') return b.rating - a.rating;
            if (option === 'title') return a.title.localeCompare(b.title);
        });
        setSortedWatchlist(sorted);
    };

    return (
        <div>
            <h1>Your Watchlist</h1>
            {error && <p>{error}</p>}
            <div>
                <label>Sort by: </label>
                <select value={sortOption} onChange={(e) => handleSort(e.target.value)}>
                    <option value="rating">Rating</option>
                    <option value="title">Title</option>
                </select>
            </div>
            <ul>
                {watchlist.length > 0 ? (
                    watchlist.map((show) => (
                        <li key={show.showId}>
                            <img src={show.poster} alt={show.title} style={{ width: '100px' }} />
                            <h3>{show.title}</h3>
                            <p>{show.description}</p>
                            <p>Rating: {show.rating}</p>
                        </li>
                    ))
                ) : (
                    <p>Your watchlist is empty. Add some shows to get started!</p>
                )}
            </ul>
        </div>
    );
};

export default Watchlist;