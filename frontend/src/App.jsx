import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Search from './components/Search';
import Watchlist from './components/Watchlist';
import ShowDetails from './components/ShowDetails';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Profile from './components/Profile';

const App = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const location = useLocation();

    // Define paths where Navbar should not be visible
    const hideNavbarPaths = ['/', '/login', '/register'];

    return (
        <>
            {!hideNavbarPaths.includes(location.pathname) && <Navbar onSearch={handleSearch} />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search searchQuery={searchQuery} />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/show/:id" element={<ShowDetails />} />
            </Routes>
        </>
    );
};

const WrappedApp = () => (
    <Router>
        <App />
    </Router>
);

export default WrappedApp;