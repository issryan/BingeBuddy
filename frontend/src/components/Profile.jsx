import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const [watchlist, setWatchlist] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedPassword, setUpdatedPassword] = useState('');
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
            setWatchlist(response.data.slice(0, 5));
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
            fetchAvailableUsers();
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleViewFullWatchlist = () => {
        navigate('/watchlist');
    };

    // Open edit profile modal
    const openEditModal = () => {
        setIsEditModalOpen(true);
        setUpdatedEmail(profileData.email || '');
        setUpdatedPassword(''); // Clear password input
    };

    // Close edit profile modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    // Handle profile update
    const handleProfileUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                'http://localhost:4000/users/update-profile',
                { email: updatedEmail, password: updatedPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            closeEditModal();
            fetchProfileData(); // Refresh profile data
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-details">
                    <img
                        className="profile-avatar"
                        src="https://via.placeholder.com/120"
                        alt={profileData.username}
                    />
                    <h2>{profileData.username || 'Username'}</h2>
                    <p>{profileData.email || 'user@example.com'}</p>
                    <div className="profile-stats">
                        <span>{profileData.followersCount || 0} Followers</span>
                        <span>{profileData.followingCount || 0} Following</span>
                        <span>{profileData.showsWatched || watchlist.length} Shows Watched</span>
                    </div>
                    <button className="edit-profile-button" onClick={openEditModal}>
                        Edit Profile
                    </button>
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

            {isEditModalOpen && (
                <div className="edit-modal">
                    <div className="edit-modal-content">
                        <h3>Edit Profile</h3>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={updatedEmail}
                                onChange={(e) => setUpdatedEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                type="password"
                                value={updatedPassword}
                                onChange={(e) => setUpdatedPassword(e.target.value)}
                            />
                        </label>
                        <button onClick={handleProfileUpdate}>Save Changes</button>
                        <button onClick={closeEditModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;