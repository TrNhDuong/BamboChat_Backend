import { useState, useMemo } from 'react';
import { SearchIcon, XIcon } from './Icons';
import './Modal.css';

interface Msg {
    _id: string;
    content: string;
    senderId: string;
    createdAt: string;
}

interface MessageSearchModalProps {
    open: boolean;
    onClose: () => void;
    messages: Msg[];
    participants: { _id: string; displayName: string | null }[];
    userId: string;
}

const MessageSearchModal = ({ open, onClose, messages, participants, userId }: MessageSearchModalProps) => {
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return messages.filter((m) => m.content.toLowerCase().includes(q));
    }, [query, messages]);

    const getSenderName = (senderId: string) => {
        if (senderId === userId) return 'Bạn';
        const p = participants.find((p) => p._id === senderId);
        return p?.displayName || senderId;
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    };

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card search-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="search-modal-header">
                    <h3>Tìm kiếm tin nhắn</h3>
                    <button className="modal-close-btn" onClick={onClose}><XIcon size={18} /></button>
                </div>

                <div className="search-modal-input-row">
                    <SearchIcon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                        autoFocus
                        className="search-modal-input"
                        type="text"
                        placeholder="Nhập nội dung cần tìm..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className="search-clear-btn" onClick={() => setQuery('')}>
                            <XIcon size={14} />
                        </button>
                    )}
                </div>

                <div className="search-modal-results">
                    {!query.trim() ? (
                        <div className="search-modal-empty">Nhập từ khóa để tìm tin nhắn</div>
                    ) : results.length === 0 ? (
                        <div className="search-modal-empty">Không tìm thấy tin nhắn nào</div>
                    ) : (
                        results.map((msg) => (
                            <div key={msg._id} className={`search-result-row ${msg.senderId === userId ? 'sent' : 'recv'}`}>
                                <div className="search-result-meta">
                                    <span className="search-result-sender">{getSenderName(msg.senderId)}</span>
                                    <span className="search-result-time">{formatTime(msg.createdAt)}</span>
                                </div>
                                <div className="search-result-content">
                                    {highlightMatch(msg.content, query)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

/** Wrap matching text in a <mark> span */
function highlightMatch(text: string, query: string) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="highlight">{text.slice(idx, idx + query.length)}</mark>
            {text.slice(idx + query.length)}
        </>
    );
}

export default MessageSearchModal;
