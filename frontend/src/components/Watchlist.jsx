import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/watchlist', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWatchlist(response.data);
            } catch (error) {
                console.error('Error fetching watchlist:', error.message);
            }
        };

        fetchWatchlist();
    }, []);

    const handleCardClick = (showId) => {
        navigate(`/show/${showId}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Tracked Shows</h1>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px',
                }}
            >
                {watchlist.map((show) => (
                    <div
                        key={show.showId}
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }}
                        onClick={() => handleCardClick(show.showId)}
                    >
                        <img
                            src={show.poster}
                            alt={show.title}
                            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        />
                        <h3>{show.title}</h3>
                        <p>{show.genre || 'Genre not available'}</p>
                        <p>User Rating: {show.rating}/10</p>
                    </div>
                ))}
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