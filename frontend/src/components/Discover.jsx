import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discover.css';

const Discover = () => {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        const fetchDiscoverShows = async () => {
            try {
                const response = await axios.get('http://localhost:4000/watchlist/discover');
                setShows(response.data);
            } catch (err) {
                console.error('Error fetching discover shows:', err);
            }
        };

        fetchDiscoverShows();
    }, []);

    return (
        <div className="discover-page">
            <div className="discover-header">
                <h1>Discover Trending Shows</h1>
            </div>
            <div className="discover-grid">
                {shows.map((show) => (
                    <div className="discover-card" key={show.id}>
                        <img src={show.poster} alt={show.title} />
                        <h2>{show.title}</h2>
                        <p>{show.description}</p>
                        <p className="rating">Rating: {show.rating}/10</p>
                        <div className="discover-actions">
                            <button>Add to Watchlist</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Discover;