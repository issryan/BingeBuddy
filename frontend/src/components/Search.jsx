import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ComparisonComponent from './ComparisonComponent';

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