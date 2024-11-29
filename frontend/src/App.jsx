import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Search from './components/Search';
import Watchlist from './components/Watchlist';
import ShowDetails from './components/ShowDetails';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/search" element={<Search />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/show/:id" element={<ShowDetails />} />
            </Routes>
        </Router>
    );
};

export default App;