import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { errorHandler } from './middleware/error.middleware.js';
import { initSocketServer } from './services/socket.service.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server (required for Socket.io)
const httpServer = http.createServer(app);

// Initialize Socket.io on the HTTP server
const io = initSocketServer(httpServer);

// Middleware
app.use(cors({
    origin: [
        'https://ruang-kopi-web.vercel.app',
        'https://www.ruangkopi.site',
        'https://ruangkopi.site',
        'http://localhost:5173',
        'http://localhost:3000',
    ],
    credentials: true,
}));
app.use(express.json());

// Root endpoint to prevent 404 on base URL
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to RuangKopi API',
        status: 'running',
        docs: '/api/health'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'RuangKopi API is running!',
        socketIO: io ? 'connected' : 'disabled',
        uptime: process.uptime(),
    });
});

// API Routes (consolidated)
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server with Socket.io (Only if NOT in serverless environment)
if (!process.env.VERCEL) {
    httpServer.listen(PORT, () => {
        console.log(`🚀 RuangKopi API server running on http://localhost:${PORT}`);
        console.log(`🔌 Socket.io server attached`);
        console.log(`📚 API Base: /api`);
        console.log(`   Routes: auth, menu, categories, gallery, reservations, settings, upload, ideas`);
        console.log(`   Routes: meja, transaksi, dashboard, payment`);
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received. Shutting down gracefully...');
    httpServer.close(() => {
        console.log('[Server] HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('[Server] SIGINT received. Shutting down gracefully...');
    httpServer.close(() => {
        console.log('[Server] HTTP server closed');
        process.exit(0);
    });
});

export default app;
