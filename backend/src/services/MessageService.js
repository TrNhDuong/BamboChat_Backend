const messageRepository = require('../repositories/MessageRepository');
const participantRepository = require('../repositories/ParticipantRepository');
const { generateUUIDv7 } = require('../utils/uuid');

class MessageService {
    /**
     * Create a new message.
     * Generate UUIDv7, validate room membership, save to DB.
     */
    async createMessage(senderId, { conversationId, content }) {
        // Step 1: Check if sender is a participant of the conversation
        const participant = await participantRepository.findByConversationAndUser(
            conversationId,
            senderId
        );

        if (!participant) {
            throw { status: 403, message: 'You are not a member of this conversation' };
        }

        // Step 2: Generate sortable UUIDv7 as message ID
        const messageId = generateUUIDv7();

        // Step 3: Save message to DB
        const message = await messageRepository.create({
            id: messageId,
            conversationId,
            senderId,
            content,
        });

        return message;
    }

    /**
     * Get message history with cursor-based pagination.
     */
    async getMessages(userId, conversationId, cursor = null, limit = 20) {
        // Validate membership
        const participant = await participantRepository.findByConversationAndUser(
            conversationId,
            userId
        );

        if (!participant) {
            throw { status: 403, message: 'You are not a member of this conversation' };
        }

        return messageRepository.findByConversation(conversationId, cursor, limit);
    }

    /**
     * Mark messages as read (update watermark).
     */
    async markAsRead(userId, conversationId, messageId) {
        const participant = await participantRepository.findByConversationAndUser(
            conversationId,
            userId
        );

        if (!participant) {
            throw { status: 403, message: 'You are not a member of this conversation' };
        }

        await participantRepository.updateLastRead(conversationId, userId, messageId);

        return { conversationId, userId, messageId };
    }
}

module.exports = new MessageService();
