import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                email,
                username,
                password,
            });

            setSuccessMessage('Registration successful! You can now log in.');
            setErrorMessage('');
            setEmail('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            navigate('/login');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error registering user');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">Register</h1>
                <p className="auth-subtitle">New here? Create an account.</p>
                <form onSubmit={handleRegister} className="auth-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <button type="submit" className="auth-button">Register</button>
                </form>
                {errorMessage && <p className="auth-error">{errorMessage}</p>}
                {successMessage && <p className="auth-success">{successMessage}</p>}
                <p className="auth-footer">
                    Already have an account?{' '}
                    <span
                        className="auth-link"
                        onClick={() => navigate('/login')}
                    >
                        Log In
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;