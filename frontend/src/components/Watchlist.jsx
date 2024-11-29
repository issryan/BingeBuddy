import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
        <div>
            <h1>Tracked Shows</h1>
            {error && <p>{error}</p>}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {watchlist.map((show) => (
                    <div key={show.showId} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <img
                            src={show.poster}
                            alt={show.title}
                            style={{ width: '150px', borderRadius: '5px' }}
                        />
                        <h3>{show.title}</h3>
                        <p>User Rating: {show.rating}/10</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watchlist;