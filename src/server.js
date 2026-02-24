require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const initializeSocket = require('./sockets/socketHandler');
const passport = require('./config/passport');
const logger = require('./utils/logger');
const morgan = require('morgan');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const friendRoutes = require('./routes/friend.routes');
const conversationRoutes = require('./routes/conversation.routes');

// ─────────────────────────────────────────────
// Initialize Express App
// ─────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─────────────────────────────────────────────
// Initialize Socket.IO
// ─────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Configure Redis adapter if REDIS_URL is provided
if (process.env.REDIS_URL) {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient));
        logger.info('Socket.io Redis adapter connected');
    }).catch((err) => {
        logger.error('Socket.io Redis adapter error:', err);
    });
}

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(morgan('combined', { stream: logger.stream }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/conversations', conversationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────
// Global Error Handler (must be last middleware)
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
// Initialize WebSocket
// ─────────────────────────────────────────────
initializeSocket(io);

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        logger.info(`REST API: http://localhost:${PORT}/api`);
        logger.info(`WebSocket: ws://localhost:${PORT}`);
    });
};

startServer();
