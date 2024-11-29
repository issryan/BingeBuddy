import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const [watchlist, setWatchlist] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfileData();
        fetchWatchlist();
        fetchAvailableUsers();
    }, []);

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/users/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfileData(response.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/watchlist', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatchlist(response.data.slice(0, 5)); // Only show top 5 shows
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/users/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailableUsers(response.data);
        } catch (error) {
            console.error('Error fetching available users:', error);
        }
    };

    const handleFollowUser = async (followedEmail) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:4000/users/follow',
                { followedEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`You are now following ${followedEmail}`);
            fetchAvailableUsers(); // Refresh available users list
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleViewFullWatchlist = () => {
        navigate('/watchlist'); // Redirect to the full watchlist page
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-details">
                    <img
                        className="profile-avatar"
                        src="https://via.placeholder.com/120" // Replace with user's avatar if available
                        alt={profileData.username}
                    />
                    <h2>{profileData.username || 'Username'}</h2>
                    <p>{profileData.email || 'user@example.com'}</p>
                    <div className="profile-stats">
                        <span>{profileData.followersCount || 0} Followers</span>
                        <span>{profileData.followingCount || 0} Following</span>
                        <span>{profileData.showsWatched || watchlist.length} Shows Watched</span>
                    </div>
                </div>
            </div>
            <div className="profile-content">
                <div className="watchlist-section">
                    <h3>Top Shows in My Watchlist</h3>
                    <div className="watchlist-grid">
                        {watchlist.map((show) => (
                            <div className="watchlist-card" key={show.showId}>
                                <img
                                    src={show.poster}
                                    alt={show.title}
                                    className="watchlist-card-poster"
                                />
                                <h4>{show.title}</h4>
                                <p>Rating: {show.rating}/10</p>
                            </div>
                        ))}
                    </div>
                    <button className="view-full-watchlist-button" onClick={handleViewFullWatchlist}>
                        View Full Watchlist
                    </button>
                </div>
                <div className="friends-list">
                    <h3>Friends</h3>
                    <ul>
                        {availableUsers.map((user) => (
                            <li key={user.email} className="friend-card">
                                <p>{user.username}</p>
                                <button onClick={() => handleFollowUser(user.email)}>Follow</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;