import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Shared styles with Register

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const API_KEY = process.env.REACT_APP_API_KEY;

    if (!API_BASE_URL) {
        console.error("API_BASE_URL is not defined in the .env file.");
    }
    if (!API_KEY) {
        console.error("API_KEY is not defined in the .env file.");
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/login?apikey=${API_KEY}`,
                {
                    email,
                    password,
                }
            );

            // Save token and other details to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);
            localStorage.setItem('username', response.data.username);

            setErrorMessage('');
            alert('Login successful! Redirecting to your watchlist...');
            navigate('/discover');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error logging in');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">Login</h1>
                <p className="auth-subtitle">Welcome back! Please login to your account.</p>
                <form onSubmit={handleLogin} className="auth-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <button type="submit" className="auth-button">Login</button>
                </form>
                {errorMessage && <p className="auth-error">{errorMessage}</p>}
                <p className="auth-footer">
                    Don’t have an account?{' '}
                    <span
                        className="auth-link"
                        onClick={() => navigate('/register')}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;