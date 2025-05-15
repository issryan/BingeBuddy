import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const MAX_BIO_LENGTH = 160;

const Profile = () => {
    const [profileData, setProfileData] = useState({ following: [], followers: [], bio: '', username: '', email: '' });
    const [watchlist, setWatchlist] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedBio, setUpdatedBio] = useState('');
    const [updatedOldPassword, setUpdatedOldPassword] = useState('');
    const [updatedNewPassword, setUpdatedNewPassword] = useState('');
    const [updatedConfirmPassword, setUpdatedConfirmPassword] = useState('');
    const [profilePic, setProfilePic] = useState('https://via.placeholder.com/120');
    const [updatedProfilePic, setUpdatedProfilePic] = useState('');
    const [bioCharCount, setBioCharCount] = useState(0);
    const modalFileInputRef = useRef(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const API_KEY = process.env.REACT_APP_API_KEY;

    if (!API_BASE_URL) {
        console.error("API_BASE_URL is not defined in the .env file.");
    }
    if (!API_KEY) {
        console.error("API_KEY is not defined in the .env file.");
    }

    useEffect(() => {
        fetchProfileData();
        fetchWatchlist();
        fetchAvailableUsers();
    }, []);

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { apikey: API_KEY },
            });
            setProfileData({
                ...response.data,
                followersCount: response.data.followers?.length || 0,
                followingCount: response.data.following?.length || 0,
                following: response.data.following || [],
                followers: response.data.followers || [],
                bio: response.data.bio || '',
                username: response.data.username || '',
                email: response.data.email || '',
            });
            setUpdatedUsername(response.data.username || '');
            setUpdatedBio(response.data.bio || '');
            setBioCharCount((response.data.bio || '').length);
            setProfilePic(response.data.profilePic || 'https://via.placeholder.com/120');
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/watchlist`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { apikey: API_KEY },
            });
            setWatchlist(response.data.slice(0, 5)); // Only display the top 5 shows
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/users/users`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { apikey: API_KEY },
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
                `${API_BASE_URL}/users/follow`,
                { followedEmail },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { apikey: API_KEY },
                }
            );
            setProfileData((prev) => ({
                ...prev,
                following: [...prev.following, followedEmail],
            }));
        } catch (error) {
            console.error('Error following user:', error);
            alert('Failed to follow user. Please try again.');
        }
    };

    const handleUnfollowUser = async (unfollowedEmail) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_BASE_URL}/users/unfollow`,
                { followedEmail: unfollowedEmail },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { apikey: API_KEY },
                }
            );
            setProfileData((prev) => ({
                ...prev,
                following: Array.isArray(prev.following)
                    ? prev.following.filter((email) => email !== unfollowedEmail)
                    : [],
            }));
        } catch (error) {
            console.error('Error unfollowing user:', error);
            alert('Failed to unfollow user. Please try again.');
        }
    };

    const handleDeleteUser = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/users/delete`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { apikey: API_KEY },
                });
                alert('Your account has been deleted.');
                navigate('/');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
        setUpdatedOldPassword('');
        setUpdatedNewPassword('');
        setUpdatedConfirmPassword('');
        setUpdatedUsername(profileData.username || '');
        setUpdatedBio(profileData.bio || '');
        setBioCharCount((profileData.bio || '').length);
        setUpdatedProfilePic(profilePic);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleProfileUpdate = async () => {
        if (updatedNewPassword && updatedNewPassword !== updatedConfirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_BASE_URL}/users/update-profile`,
                {
                    oldPassword: updatedOldPassword,
                    newPassword: updatedNewPassword,
                    username: updatedUsername,
                    bio: updatedBio,
                    profilePic: updatedProfilePic,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { apikey: API_KEY },
                }
            );
            alert(response.data.message);
            closeEditModal();
            fetchProfileData();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
        }
    };

    const handleModalProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBioChange = (e) => {
        const value = e.target.value.slice(0, MAX_BIO_LENGTH);
        setUpdatedBio(value);
        setBioCharCount(value.length);
    };

    // Placeholder banner image
    const bannerUrl = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80';
    const favoriteShows = watchlist.slice(0, 5);

    // Stats mockup
    const stats = [
        { label: 'Shows Watched', value: 150, sub: '+5% this month' },
        { label: 'Genres Explored', value: 12, sub: '+2% this month' },
        { label: 'Average Rating', value: 4.5, sub: '+0.1 this month' },
        { label: 'Total Watch Time', value: '300h', sub: '+10h this month' },
    ];

    return (
        <div className="profile-root profile-row-layout">
            {/* Banner + Avatar + Friends Sidebar */}
            <div className="profile-banner-row">
                <div className="profile-banner" style={{ backgroundImage: `url(${bannerUrl})` }}>
                    <img className="profile-banner-avatar" src={profilePic} alt={profileData.username || 'User Avatar'} />
                </div>
                <aside className="profile-friends-sidebar">
                    <h4>Friends</h4>
                    <ul className="profile-friends-list-sidebar">
                        {profileData.following && profileData.following.length > 0 ? (
                            profileData.following.map((email) => {
                                const user = availableUsers.find((u) => u.email === email);
                                return (
                                    <li key={email} className="profile-friend-sidebar-card">
                                        <img src={user?.profilePic || 'https://via.placeholder.com/40'} alt={user?.username || email} />
                                        <div className="profile-friend-sidebar-info">
                                            <span className="profile-friend-sidebar-username">{user?.username || email}</span>
                                            <span className="profile-friend-sidebar-handle">@{user?.username?.toLowerCase() || email.split('@')[0]}</span>
                                        </div>
                                        <button className="profile-friend-sidebar-visit">Visit</button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="profile-friend-sidebar-card">No friends yet.</li>
                        )}
                    </ul>
                </aside>
            </div>
            {/* Profile Info (centered below avatar) */}
            <div className="profile-info">
                <div className="profile-banner-username">
                    {profileData.username || 'Username'} <span className="profile-banner-verified">✔️</span>
                </div>
                <div className="profile-banner-handle">@{profileData.username?.toLowerCase() || 'username'}</div>
                <div className="profile-banner-stats">
                    <span><strong>{profileData.followersCount || 0}</strong> followers</span>
                    <span><strong>{profileData.followingCount || 0}</strong> following</span>
                </div>
                <button className="profile-info-settings-btn" onClick={openEditModal} title="Edit profile settings">
                    Edit Profile
                </button>
            </div>
            {/* Stats Cards */}
            <div className="profile-stats-cards-row">
                {stats.map((stat, i) => (
                    <div className="profile-stats-card" key={i}>
                        <div className="profile-stats-card-value">{stat.value}</div>
                        <div className="profile-stats-card-label">{stat.label}</div>
                        <div className="profile-stats-card-sub">{stat.sub}</div>
                    </div>
                ))}
            </div>
            {/* Favorite Shows */}
            <div className="profile-section">
                <h3>Favorite Shows</h3>
                <div className="profile-favorites-grid">
                    {favoriteShows.map((show) => (
                        <div className="profile-favorite-card" key={show.showId}>
                            <img src={show.poster} alt={show.title} />
                            <div className="profile-favorite-title">{show.title}</div>
                            {show.genre || show.rating ? (
                                <div className="profile-favorite-meta">
                                    {show.genre && <span>{show.genre}</span>}
                                    {show.genre && show.rating ? ' · ' : ''}
                                    {show.rating && <span>{show.rating}</span>}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="edit-modal">
                    <div className="edit-modal-content">
                        <h3>Edit Profile</h3>
                        <label>
                            Profile Picture:
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img
                                    src={updatedProfilePic}
                                    alt="Profile Preview"
                                    style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #444' }}
                                />
                                <button
                                    type="button"
                                    className="profile-info-avatar-edit"
                                    onClick={() => modalFileInputRef.current.click()}
                                    style={{ position: 'static' }}
                                >
                                    Change
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    ref={modalFileInputRef}
                                    onChange={handleModalProfilePicChange}
                                />
                            </div>
                        </label>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={updatedUsername}
                                onChange={(e) => setUpdatedUsername(e.target.value)}
                            />
                        </label>
                        <label>
                            Bio:
                            <textarea
                                value={updatedBio}
                                onChange={handleBioChange}
                                maxLength={MAX_BIO_LENGTH}
                                rows={3}
                            />
                            <span className="profile-bio-count">{bioCharCount}/{MAX_BIO_LENGTH}</span>
                        </label>
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