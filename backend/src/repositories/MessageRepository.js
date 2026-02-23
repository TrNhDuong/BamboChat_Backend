const Message = require('../models/Message');

class MessageRepository {
    async create({ id, conversationId, senderId, content }) {
        return Message.create({ _id: id, conversationId, senderId, content });
    }

    /**
     * Cursor-based pagination for message history.
     * Uses UUIDv7 _id as cursor — messages are sorted newest first.
     *
     * @param {string} conversationId
     * @param {string|null} cursor - UUIDv7 of the last message seen (for pagination)
     * @param {number} limit - Number of messages to return
     */
    async findByConversation(conversationId, cursor = null, limit = 20) {
        const query = { conversationId };

        // If cursor provided, get messages older than cursor
        if (cursor) {
            query._id = { $lt: cursor };
        }

        return Message.find(query)
            .sort({ _id: -1 }) // Newest first (UUIDv7 is time-sortable)
            .limit(limit);
    }
}

module.exports = new MessageRepository();
