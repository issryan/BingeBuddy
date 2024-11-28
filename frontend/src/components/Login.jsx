import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/auth/login', {
                email,
                password,
            });

            // Save token and other details to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);
            localStorage.setItem('username', response.data.username);

            setErrorMessage('');
            alert('Login successful! Redirecting to search...');
            // Redirect to search or watchlist
            window.location.href = '/search';
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error logging in');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default Login;