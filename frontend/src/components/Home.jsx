import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>BingeBuddy</h1>
                <p>Your Ultimate TV Show Companion</p>
            </header>
            <div className="home-content">
                <p>
                    Discover, track, and rate your favorite TV shows. Organize your watchlist
                    and never miss an episode. Join now and take your TV viewing experience to the next level!
                </p>
                <div className="home-buttons">
                    <button className="sign-in-button" onClick={() => navigate('/login')}>
                        Sign In
                    </button>
                    <button className="sign-up-button" onClick={() => navigate('/register')}>
                        Sign Up
                    </button>
                </div>
            </div>
            <div className="home-footer">
                <p>Start your journey with BingeBuddy today!</p>
            </div>
        </div>
    );
};

export default Home;