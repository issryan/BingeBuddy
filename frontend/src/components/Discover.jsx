import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discover.css';

const Discover = () => {
    const [shows, setShows] = useState([]);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const apiKey = process.env.REACT_APP_API_KEY;


    if (!API_BASE_URL) {
        console.error("API_BASE_URL is not defined in the .env file.");
    }

    if (!apiKey) {
        console.error("REACT_APP_API_KEY is not defined in the .env file.");
    }

    useEffect(() => {
        const fetchDiscoverShows = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/watchlist/discover?apikey=${apiKey}`);
                setShows(response.data);
            } catch (err) {
                console.error('Error fetching discover shows:', err);
            }
        };

        fetchDiscoverShows();
    }, [API_BASE_URL, apiKey]);

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