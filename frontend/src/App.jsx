import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Search from './components/Search';
import Watchlist from './components/Watchlist';
import ShowDetails from './components/ShowDetails';
import Register from './components/Register';
import Navbar from './components/Navbar';

const App = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <Router>
             <Navbar onSearch={handleSearch} />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<Search />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/show/:id" element={<ShowDetails />} />
            </Routes>
        </Router>
    );
};

export default App;