import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim() === '') return;
        onSearch(query); 
        navigate('/search');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">SHOWTRACKR</Link>
            </div>
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">🔍</button>
            </form>
            <ul className="navbar-links">
                <li>
                    <Link to="/watchlist">My Shows</Link>
                </li>
                <li>
                    <Link to="/discover">Discover</Link>
                </li>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;