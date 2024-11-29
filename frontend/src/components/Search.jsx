import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const Search = ({ searchQuery }) => {
    const [query, setQuery] = useState(searchQuery || ''); 
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);
    const [rating, setRating] = useState(10);

    // Function to fetch search results
    const fetchSearchResults = async (query) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to search for shows.');
                return;
            }

            const response = await axios.get('http://localhost:4000/search/search', {
                headers: { Authorization: `Bearer ${token}` },
                params: { q: query },
            });

            setResults(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching search results:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error fetching search results.');
        }
    };

    // Handle search button click
    const handleSearch = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to search for shows.');
                return;
            }
    
            const response = await axios.get('http://localhost:4000/search/search', {
                headers: { Authorization: `Bearer ${token}` },
                params: { q: query }, // Ensure `query` is not empty
            });
    
            setResults(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching search results:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error fetching search results.');
        }
    };

    // Automatically search if `searchQuery` is passed as a prop
    useEffect(() => {
        if (searchQuery) {
            fetchSearchResults(searchQuery);
        }
    }, [searchQuery]);

    // Add show to the watchlist
    const handleAddToWatchlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');

            if (!token || !email) {
                alert('You must be logged in to add shows to your watchlist.');
                return;
            }

            const payload = {
                email,
                showId: selectedShow.id.toString(),
                title: selectedShow.name,
                description: selectedShow.overview,
                poster: `https://image.tmdb.org/t/p/w500${selectedShow.poster_path}`,
                rating,
            };

            await axios.post('http://localhost:4000/watchlist', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(`${selectedShow.name} added to your watchlist with a rating of ${rating}!`);
            setModalIsOpen(false);
        } catch (err) {
            console.error('Error adding to watchlist:', err.response?.data || err.message);
            alert('Failed to add show to watchlist. Please try again.');
        }
    };

    // Open the modal to rate the show before adding to the watchlist
    const openModal = (show) => {
        setSelectedShow(show);
        setRating(10); // Default rating
        setModalIsOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedShow(null);
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <ul>
                {results.map((show) => (
                    <li key={show.id}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                            alt={show.name}
                            style={{ width: '100px' }}
                        />
                        <h3>{show.name}</h3>
                        <p>{show.overview}</p>
                        <p>Rating: {show.vote_average}</p>
                        <button onClick={() => openModal(show)}>Add to Watchlist</button>
                    </li>
                ))}
            </ul>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>Rate the Show</h2>
                <p>{selectedShow?.name}</p>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(Math.min(10, Math.max(1, Number(e.target.value))))}
                />
                <button onClick={handleAddToWatchlist}>Add</button>
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default Search;