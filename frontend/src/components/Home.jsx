import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome to ShowTrackr!</h1>
            <p>
                Discover, track, and rate your favorite TV shows. Organize your watchlist and
                keep track of the shows you've watched or plan to watch. Join now and
                elevate your TV viewing experience!
            </p>
            <button
                onClick={() => navigate('/login')}
                style={{
                    margin: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#6200EE',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px',
                }}
            >
                Sign In
            </button>
            <button
                onClick={() => navigate('/register')}
                style={{
                    margin: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#03DAC6',
                    color: 'black',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px',
                }}
            >
                Sign Up
            </button>
        </div>
    );
};

export default Home;