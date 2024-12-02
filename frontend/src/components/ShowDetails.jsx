import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ShowDetails.css';


const ShowDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    if (!TMDB_API_KEY) {
        console.error("REACT_APP_TMDB_API_KEY is not defined in the environment variables.");
    }

    useEffect(() => {
        const fetchShowDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/tv/${id}`,
                    {
                        params: { api_key: TMDB_API_KEY },
                    }
                );
                setShow(response.data);
            } catch (error) {
                console.error('Error fetching show details:', error.message);
                setError('Failed to fetch show details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchShowDetails();
    }, [id, TMDB_API_KEY]);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading show details...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>{show.name}</h1>
            <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <p style={{ marginTop: '20px', fontSize: '18px' }}>{show.overview}</p>
            <p style={{ fontWeight: 'bold' }}>Rating: {show.vote_average}/10</p>
            <p>Genres: {show.genres.map((g) => g.name).join(', ')}</p>
            <p>Number of Seasons: {show.number_of_seasons}</p>
            <p>Number of Episodes: {show.number_of_episodes}</p>
        </div>
    );
};

export default ShowDetails;