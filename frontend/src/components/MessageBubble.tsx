import type { Message } from '../types';
import './MessageBubble.css';

interface MessageBubbleProps {
    message: Message;
    isSent: boolean;
    showAvatar: boolean;
    senderName?: string;
}

const MessageBubble = ({ message, isSent, showAvatar, senderName }: MessageBubbleProps) => {
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const avatarLetter = (senderName || message.senderId).charAt(0).toUpperCase();

    return (
        <div className={`message-bubble-wrapper ${isSent ? 'sent' : 'received'} ${showAvatar ? 'has-avatar' : ''}`}>
            {!isSent && (
                <div className="message-avatar-container">
                    {showAvatar ? (
                        <div className="message-avatar" title={senderName || message.senderId}>
                            {avatarLetter}
                        </div>
                    ) : (
                        <div className="message-avatar-spacer" />
                    )}
                </div>
            )}

            <div className="message-bubble">
                <div>{message.content}</div>
                <div className="message-time">{formatTime(message.createdAt)}</div>
            </div>
        </div>
    );
};

export default MessageBubble;
