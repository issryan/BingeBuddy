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

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        localStorage.removeItem('email'); // Clear email from localStorage (if stored)
        navigate('/login'); // Redirect to the login page
    };
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">BINGEBUDDY</Link>
            </div>
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search for shows..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </form>
            <ul className="navbar-links">
                <li>
                    <Link to="/discover">Discover</Link>
                </li>
                <li>
                    <Link to="/watchlist">My Shows</Link>
                </li>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
                <button className="navbar-logout" onClick={handleLogout}>
                    Logout
                </button>
            </ul>
        </nav>
    );
};

export default Navbar;