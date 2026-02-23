const { verifyAccessToken } = require('../utils/jwt');
const messageService = require('../services/MessageService');
const participantRepository = require('../repositories/ParticipantRepository');

/**
 * Initialize Socket.IO event handlers.
 * JWT authentication is performed at connection time.
 */
const initializeSocket = (io) => {
    // ─────────────────────────────────────────────
    // Connection Middleware: JWT Authentication
    // ─────────────────────────────────────────────
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = verifyAccessToken(token);
            socket.user = decoded; // { userId, email }
            next();
        } catch (error) {
            next(new Error('Invalid or expired token'));
        }
    });

    // ─────────────────────────────────────────────
    // Connection Handler
    // ─────────────────────────────────────────────
    io.on('connection', async (socket) => {
        const userId = socket.user.userId;
        console.log(`[Socket] User connected: ${userId}`);

        // Auto-join user to all their conversation rooms
        try {
            const participations = await participantRepository.findByUser(userId);
            for (const p of participations) {
                socket.join(p.conversationId.toString());
            }
        } catch (error) {
            console.error(`[Socket] Error joining rooms for ${userId}:`, error);
        }

        // ───────────────────────────────────────────
        // Event: send_message
        // Client → Server
        // ───────────────────────────────────────────
        socket.on('send_message', async ({ conversationId, content }, callback) => {
            try {
                const message = await messageService.createMessage(userId, {
                    conversationId,
                    content,
                });

                // Broadcast to all users in the conversation room
                io.to(conversationId.toString()).emit('receive_message', {
                    id: message._id,
                    conversationId: message.conversationId,
                    senderId: message.senderId,
                    content: message.content,
                    createdAt: message.createdAt,
                });

                if (callback) callback({ success: true, message });
            } catch (error) {
                console.error('[Socket] send_message error:', error);
                if (callback) callback({ success: false, error: error.message });
            }
        });

        // ───────────────────────────────────────────
        // Event: mark_read
        // Client → Server
        // ───────────────────────────────────────────
        socket.on('mark_read', async ({ conversationId, messageId }, callback) => {
            try {
                const result = await messageService.markAsRead(userId, conversationId, messageId);

                // Broadcast read receipt to conversation room
                io.to(conversationId.toString()).emit('message_read_update', {
                    conversationId,
                    userId,
                    messageId,
                });

                if (callback) callback({ success: true });
            } catch (error) {
                console.error('[Socket] mark_read error:', error);
                if (callback) callback({ success: false, error: error.message });
            }
        });

        // ───────────────────────────────────────────
        // Event: typing
        // Client → Server (no DB, direct broadcast)
        // ───────────────────────────────────────────
        socket.on('typing', ({ conversationId, isTyping }) => {
            socket.to(conversationId.toString()).emit('typing', {
                conversationId,
                userId,
                isTyping,
            });
        });

        // ───────────────────────────────────────────
        // Disconnect
        // ───────────────────────────────────────────
        socket.on('disconnect', () => {
            console.log(`[Socket] User disconnected: ${userId}`);
        });
    });
};

module.exports = initializeSocket;
