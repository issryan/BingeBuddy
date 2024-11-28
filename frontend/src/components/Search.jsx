import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);
    const [rating, setRating] = useState(10);

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/search/search', {
                headers: { Authorization: `Bearer ${token}` },
                params: { q: query },
            });
            setResults(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching search results:', err.response?.data || err.message);
            setError('Error fetching search results.');
        }
    };

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

    const openModal = (show) => {
        setSelectedShow(show);
        setRating(10); // Default rating
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedShow(null);
    };

    return (
        <div>
            <h1>Search TV Shows</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for a show..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
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
                    onChange={(e) => setRating(e.target.value)}
                />
                <button onClick={handleAddToWatchlist}>Add</button>
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default Search;