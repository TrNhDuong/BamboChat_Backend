import { useState } from 'react';
import { UserIcon, SearchIcon, PaletteIcon, XIcon, ChevronRightIcon, UsersIcon } from './Icons';
import { conversationAPI } from '../services/api';
import ConfirmModal from './ConfirmModal';
import './DetailPane.css';

interface Participant {
    _id: string;
    displayName: string | null;
    avatar?: { url: string; public_id: string } | null;
    bio?: string | null;
    role?: string;
}

interface DetailPaneProps {
    isOpen: boolean;
    onClose: () => void;
    conversationId: string | null;
    conversationName: string;
    isDirectMessage: boolean;
    participants: Participant[];
    userId: string;
    messages: { _id: string; content: string; senderId: string; createdAt: string }[];
    onOpenProfile: () => void;
    onOpenSearch: () => void;
    onParticipantsChange: () => void; // callback to reload conversations after kick
}

const DetailPane = ({
    isOpen,
    onClose,
    conversationId,
    conversationName,
    isDirectMessage,
    participants,
    userId,
    onOpenProfile,
    onOpenSearch,
    onParticipantsChange,
}: DetailPaneProps) => {
    // Is the current user an admin of this group?
    const isAdmin = participants.find((p) => p._id === userId)?.role === 'admin';
    const [expandCustom, setExpandCustom] = useState(false);
    const [expandMembers, setExpandMembers] = useState(true);
    const [kickingId, setKickingId] = useState<string | null>(null);
    const [kickError, setKickError] = useState('');
    const [pendingKick, setPendingKick] = useState<Participant | null>(null);

    // For DM: get the other user
    const otherUser = isDirectMessage
        ? participants.find((p) => p._id !== userId)
        : null;

    const avatarUrl = otherUser?.avatar?.url;
    const displayName = otherUser?.displayName || conversationName;

    const handleKick = async () => {
        if (!conversationId || !pendingKick) return;
        setKickingId(pendingKick._id);
        setKickError('');
        try {
            await conversationAPI.kickParticipant(conversationId, pendingKick._id);
            setPendingKick(null);
            onParticipantsChange();
        } catch (err: any) {
            setKickError(err.response?.data?.message || 'Không thể kick thành viên');
            setTimeout(() => setKickError(''), 3000);
        } finally {
            setKickingId(null);
        }
    };

    return (
        <>
            <div className={`detail-pane ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="detail-pane-header">
                    <span className="detail-pane-title">Chi tiết</span>
                    <button className="detail-pane-close" onClick={onClose} title="Đóng">
                        <XIcon size={18} />
                    </button>
                </div>

                {/* Profile summary */}
                <div className="detail-pane-profile">
                    <div className="detail-pane-avatar">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={displayName} />
                        ) : (
                            <span>{displayName.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="detail-pane-name">{displayName}</div>
                    {otherUser?._id && (
                        <div className="detail-pane-sub">{otherUser._id}</div>
                    )}
                    {!isDirectMessage && (
                        <div className="detail-pane-sub">{participants.length} thành viên</div>
                    )}
                </div>

                {/* Quick action buttons */}
                <div className="detail-pane-actions">
                    {isDirectMessage && (
                        <button className="detail-action-btn" onClick={onOpenProfile}>
                            <div className="detail-action-icon"><UserIcon size={18} /></div>
                            <span>Trang cá nhân</span>
                        </button>
                    )}
                    <button className="detail-action-btn" onClick={onOpenSearch}>
                        <div className="detail-action-icon"><SearchIcon size={18} /></div>
                        <span>Tìm kiếm</span>
                    </button>
                </div>

                {/* Sections */}
                <div className="detail-pane-sections">

                    {/* Members section (group only) */}
                    {!isDirectMessage && (
                        <div className="detail-section">
                            <button
                                className="detail-section-header"
                                onClick={() => setExpandMembers((v) => !v)}
                            >
                                <div className="detail-section-icon"><UsersIcon size={16} /></div>
                                <span>Thành viên ({participants.length})</span>
                                <ChevronRightIcon
                                    size={16}
                                    style={{
                                        marginLeft: 'auto',
                                        transition: 'transform 0.2s',
                                        transform: expandMembers ? 'rotate(90deg)' : 'none',
                                    }}
                                />
                            </button>
                            {expandMembers && (
                                <div className="detail-section-body" style={{ padding: '4px 8px 12px' }}>
                                    {kickError && (
                                        <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: 8, paddingLeft: 8 }}>
                                            {kickError}
                                        </p>
                                    )}
                                    {participants.map((p) => (
                                        <div key={p._id} className="detail-member-row">
                                            <div className="detail-member-avatar">
                                                {p.avatar?.url ? (
                                                    <img src={p.avatar.url} alt={p.displayName || p._id} />
                                                ) : (
                                                    (p.displayName || p._id).charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="detail-member-info">
                                                <div className="detail-member-name">
                                                    {p.displayName || p._id}
                                                    {p._id === userId && (
                                                        <span className="detail-member-you"> (bạn)</span>
                                                    )}
                                                </div>
                                                {p.displayName && (
                                                    <div className="detail-member-id">{p._id}</div>
                                                )}
                                            </div>
                                            {isAdmin && p._id !== userId && (
                                                <button
                                                    className="detail-kick-btn"
                                                    title="Kick thành viên"
                                                    onClick={() => setPendingKick(p)}
                                                >
                                                    <XIcon size={13} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Chat customization */}
                    <div className="detail-section">
                        <button
                            className="detail-section-header"
                            onClick={() => setExpandCustom((v) => !v)}
                        >
                            <div className="detail-section-icon"><PaletteIcon size={16} /></div>
                            <span>Tùy chỉnh đoạn chat</span>
                            <ChevronRightIcon
                                size={16}
                                style={{
                                    marginLeft: 'auto',
                                    transition: 'transform 0.2s',
                                    transform: expandCustom ? 'rotate(90deg)' : 'none',
                                }}
                            />
                        </button>
                        {expandCustom && (
                            <div className="detail-section-body">
                                <p className="detail-section-hint">Tính năng đang phát triển...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Kick confirmation modal */}
            <ConfirmModal
                open={!!pendingKick}
                title="Kick thành viên"
                message={`Bạn có chắc muốn kick "${pendingKick?.displayName || pendingKick?._id}" ra khỏi nhóm?`}
                confirmLabel="Kick"
                cancelLabel="Hủy"
                danger
                loading={kickingId === pendingKick?._id}
                onConfirm={handleKick}
                onCancel={() => setPendingKick(null)}
            />
        </>
    );
};

export default DetailPane;

