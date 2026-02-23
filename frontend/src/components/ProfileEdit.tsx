import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../services/api';
import './ProfileEdit.css';

interface ProfileEditProps {
    onClose: () => void;
}

const ProfileEdit = ({ onClose }: ProfileEditProps) => {
    const { user, updateUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { data } = await userAPI.updateProfile({ displayName, bio });
            updateUser(data);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="profile-edit-overlay" onClick={onClose}>
            <div className="profile-edit-card" onClick={(e) => e.stopPropagation()}>
                <div className="profile-edit-header">
                    <h2>Edit Profile</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>User ID</label>
                        <input className="input" type="text" value={user?._id} disabled />
                        <span className="input-hint">Your unique identifier cannot be changed.</span>
                    </div>

                    <div className="form-group">
                        <label>Display Name</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="How others see you"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            className="input"
                            placeholder="Tell us about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={160}
                            rows={3}
                        />
                    </div>

                    <div className="settings-divider">App Settings</div>

                    <div className="form-group setting-row">
                        <div className="setting-info">
                            <label>Dark Mode</label>
                            <span className="input-hint">Change the look of BamboChat</span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className="form-group setting-row">
                        <div className="setting-info">
                            <label>Session</label>
                            <span className="input-hint">Log out from this device</span>
                        </div>
                        <button type="button" className="btn btn-danger btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">Profile updated successfully!</p>}

                    <div className="profile-edit-actions">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;
