import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const [watchlist, setWatchlist] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState(false);
    const [updatedOldPassword, setUpdatedOldPassword] = useState(''); // Add this line
    const [updatedNewPassword, setUpdatedNewPassword] = useState(''); // Rename variable for clarity
    const [updatedConfirmPassword, setUpdatedConfirmPassword] = useState(''); // Add confirmation field
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
            setWatchlist(response.data.slice(0, 5)); // Only display the top 5 shows
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
            fetchAvailableUsers(); // Refresh the available users list
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        localStorage.removeItem('email'); // Clear email from localStorage (if stored)
        navigate('/login'); // Redirect to the login page
    };

    const handleDeleteUser = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:4000/users/delete', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Your account has been deleted.');
                handleLogout(); // Logout user after deletion
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
        setUpdatedOldPassword(''); // Clear old password input
        setUpdatedNewPassword(''); // Clear new password input
        setUpdatedConfirmPassword(''); // Clear confirm password input
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleProfileUpdate = async () => {
        if (updatedNewPassword !== updatedConfirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                'http://localhost:4000/users/update-profile',
                {
                    oldPassword: updatedOldPassword,
                    newPassword: updatedNewPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message); // Notify user of success
            closeEditModal(); // Close the modal
            fetchProfileData(); // Refresh profile data
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
        }
    };

    const handleViewFullWatchlist = () => {
        navigate('/watchlist'); // Redirect to the watchlist page
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-details">
                    <img
                        className="profile-avatar"
                        src="https://via.placeholder.com/120"
                        alt={profileData.username || 'User Avatar'}
                    />
                    <h2>{profileData.username || 'Username'}</h2>
                    <p>{profileData.email || 'user@example.com'}</p>
                    <div className="profile-stats">
                        <span>{profileData.followersCount || 0} Followers</span>
                        <span>{profileData.followingCount || 0} Following</span>
                        <span>{profileData.showsWatched || watchlist.length} Shows Watched</span>
                    </div>
                    <div className="profile-buttons">
                        <button className="edit-profile-button" onClick={openEditModal}>
                            Edit Profile
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                        <button className="delete-account-button" onClick={handleDeleteUser}>
                            Delete Account
                        </button>
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
                    <h3>Available Users</h3>
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
                            Old Password:
                            <input
                                type="password"
                                value={updatedOldPassword}
                                onChange={(e) => setUpdatedOldPassword(e.target.value)}
                            />
                        </label>
                        <label>
                            New Password:
                            <input
                                type="password"
                                value={updatedNewPassword}
                                onChange={(e) => setUpdatedNewPassword(e.target.value)}
                            />
                        </label>
                        <label>
                            Confirm New Password:
                            <input
                                type="password"
                                value={updatedConfirmPassword}
                                onChange={(e) => setUpdatedConfirmPassword(e.target.value)}
                            />
                        </label>
                        <div className="modal-buttons">
                            <button onClick={handleProfileUpdate}>Save Changes</button>
                            <button onClick={closeEditModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;