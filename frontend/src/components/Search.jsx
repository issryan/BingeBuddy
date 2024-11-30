import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ComparisonComponent from './ComparisonComponent';
import './Search.css';

const Search = ({ searchQuery }) => {
    const [query, setQuery] = useState(searchQuery || '');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

    // Fetch search results
    const fetchSearchResults = async (query) => {
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
            setError(err.response?.data?.message || 'Error fetching search results.');
        }
    };

    // Handle search submission
    const handleSearch = async (e) => {
        e.preventDefault();
        await fetchSearchResults(query);
    };

    // Auto-fetch if query is passed as prop
    useEffect(() => {
        if (searchQuery) {
            fetchSearchResults(searchQuery);
        }
    }, [searchQuery]);

    // Open modal for adding or ranking a show
    const openModal = (show) => {
        setSelectedShow(show);
        setModalIsOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedShow(null);
    };

    return (
        <div className="search-page">
            {error && <p className="error">{error}</p>}
            <ul className="search-results">
                {results.map((show) => (
                    <li key={show.id} className="search-result-item">
                        <div className="poster-container">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                alt={show.name}
                                className="poster"
                            />
                        </div>
                        <div className="show-details">
                            <h3>{show.name}</h3>
                            <p className="show-genre">
                                Genre: {show.genre_ids?.join(', ') || 'Unknown'}
                            </p>
                            <p className="show-overview">{show.overview}</p>
                            <p className="show-rating">Rating: {show.vote_average || 'N/A'}</p>
                            <div className="action-buttons">
                                <button onClick={() => openModal(show)}>Add to Watchlist</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                {selectedShow ? (
                    <ComparisonComponent
                        newShow={selectedShow}
                        onRankingComplete={() => {
                            alert(`${selectedShow.name} successfully added and ranked!`);
                            closeModal();
                        }}
                    />
                ) : (
                    <p>Loading...</p>
                )}
            </Modal>
        </div>
    );
};

export default Search;