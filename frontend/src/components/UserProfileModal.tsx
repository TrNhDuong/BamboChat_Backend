import { XIcon } from './Icons';
import './Modal.css';

interface Participant {
    _id: string;
    displayName: string | null;
    avatar?: { url: string; public_id: string } | null;
    bio?: string | null;
}

interface UserProfileModalProps {
    open: boolean;
    onClose: () => void;
    user: Participant | null;
}

const UserProfileModal = ({ open, onClose, user }: UserProfileModalProps) => {
    if (!open || !user) return null;

    const displayName = user.displayName || user._id;
    const avatarUrl = user.avatar?.url;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card profile-modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} title="Đóng">
                    <XIcon size={18} />
                </button>

                {/* Avatar */}
                <div className="profile-modal-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} />
                    ) : (
                        <span>{displayName.charAt(0).toUpperCase()}</span>
                    )}
                </div>

                <div className="profile-modal-name">{displayName}</div>
                <div className="profile-modal-id">ID: {user._id}</div>

                <div className="profile-modal-divider" />

                <div className="profile-modal-info-row">
                    <span className="profile-modal-label">Trạng thái</span>
                    <span className="profile-modal-value online-dot">Đang hoạt động</span>
                </div>

                {user.bio && (
                    <div className="profile-modal-info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                        <span className="profile-modal-label">Bio</span>
                        <span className="profile-modal-bio">{user.bio}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileModal;
