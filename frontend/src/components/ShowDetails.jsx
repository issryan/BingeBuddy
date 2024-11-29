import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ShowDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);

    useEffect(() => {
        const fetchShowDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
                );
                setShow(response.data);
            } catch (error) {
                console.error('Error fetching show details:', error.message);
            }
        };

        fetchShowDetails();
    }, [id]);

    if (!show) return <p>Loading show details...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{show.name}</h1>
            <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
            />
            <p>{show.overview}</p>
            <p>Rating: {show.vote_average}/10</p>
            <p>Genres: {show.genres.map((g) => g.name).join(', ')}</p>
        </div>
    );
};

export default ShowDetails;