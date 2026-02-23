import { useState, useEffect } from 'react';
import { userAPI, friendAPI } from '../services/api';
import type { User, Friendship } from '../types';
import { SearchIcon, InboxIcon, OutboxIcon, UsersIcon, ChatIcon } from './Icons';
import './FriendPanel.css';

interface FriendPanelProps {
    onChatWithUser: (userId: string) => void;
}

const FriendPanel = ({ onChatWithUser }: FriendPanelProps) => {
    const [friends, setFriends] = useState<string[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
    const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = () => {
        loadFriends();
        loadPendingRequests();
        loadSentRequests();
    };

    const loadFriends = async () => {
        try {
            const { data } = await friendAPI.getFriends();
            setFriends(data);
        } catch (err) {
            console.error('Failed to load friends:', err);
        }
    };

    const loadPendingRequests = async () => {
        try {
            const { data } = await friendAPI.getPendingRequests();
            setPendingRequests(data);
        } catch (err) {
            console.error('Failed to load pending requests:', err);
        }
    };

    const loadSentRequests = async () => {
        try {
            const { data } = await friendAPI.getSentRequests();
            setSentRequests(data);
        } catch (err) {
            console.error('Failed to load sent requests:', err);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setMessage('');
        try {
            const { data } = await userAPI.search(searchQuery.trim());
            setSearchResults(data);
            if (data.length === 0) {
                setMessage('User ID does not exist');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error('Search failed:', err);
            setMessage('User ID does not exist');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (addresseeId: string) => {
        try {
            await friendAPI.sendRequest(addresseeId);
            setMessage(`Friend request sent to ${addresseeId}`);
            loadSentRequests();
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to send request');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleRespondToRequest = async (requestId: string, action: 'accept' | 'reject') => {
        try {
            await friendAPI.respondToRequest(requestId, action);
            setMessage(action === 'accept' ? 'Friend request accepted!' : 'Friend request rejected');
            loadAll();
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to respond');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleUnfriend = async (friendId: string) => {
        try {
            await friendAPI.unfriend(friendId);
            loadFriends();
        } catch (err) {
            console.error('Unfriend failed:', err);
        }
    };

    return (
        <div className="friend-panel">
            {/* Search */}
            <h3><SearchIcon size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Tìm kiếm người dùng</h3>
            <div className="friend-search">
                <div className="friend-search-row">
                    <input
                        className="input"
                        type="text"
                        placeholder="Search by user ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSearch}
                        disabled={loading || !searchQuery.trim()}
                    >
                        {loading ? '...' : 'Search'}
                    </button>
                </div>
            </div>

            {message && <p className="success-message" style={{ marginBottom: 12 }}>{message}</p>}

            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div key={user._id} className="search-result-item">
                            <span>{user._id} ({user.email})</span>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleSendRequest(user._id)}
                            >
                                + Add
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pending incoming requests */}
            {pendingRequests.length > 0 && (
                <>
                    <h3><InboxIcon size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Yêu cầu đến ({pendingRequests.length})</h3>
                    {pendingRequests.map((req) => (
                        <div key={req._id} className="friend-item">
                            <div className="friend-item-info">
                                <div className="friend-avatar pending">
                                    {req.requesterId.charAt(0).toUpperCase()}
                                </div>
                                <div className="friend-name">{req.requesterId}</div>
                            </div>
                            <div className="friend-actions">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleRespondToRequest(req._id, 'accept')}
                                >
                                    Accept
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRespondToRequest(req._id, 'reject')}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Sent requests */}
            {sentRequests.length > 0 && (
                <>
                    <h3><OutboxIcon size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Yêu cầu đã gửi ({sentRequests.length})</h3>
                    {sentRequests.map((req) => (
                        <div key={req._id} className="friend-item">
                            <div className="friend-item-info">
                                <div className="friend-avatar pending">
                                    {req.addresseeId.charAt(0).toUpperCase()}
                                </div>
                                <div className="friend-name">{req.addresseeId}</div>
                            </div>
                            <div className="friend-actions">
                                <span className="pending-label">Pending...</span>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Friends list */}
            <h3><UsersIcon size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Bạn bè ({friends.length})</h3>
            {friends.length === 0 ? (
                <div className="friend-empty">Chưa có bạn bè. Hãy tìm kiếm người dùng bên trên!</div>
            ) : (
                friends.map((friendId) => (
                    <div key={friendId} className="friend-item">
                        <div className="friend-item-info">
                            <div className="friend-avatar">{friendId.charAt(0).toUpperCase()}</div>
                            <div className="friend-name">{friendId}</div>
                        </div>
                        <div className="friend-actions">
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ marginRight: 8 }}
                                onClick={() => onChatWithUser(friendId)}
                            >
                                <ChatIcon size={16} /> Nhắn tin
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleUnfriend(friendId)}
                            >
                                Unfriend
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendPanel;
