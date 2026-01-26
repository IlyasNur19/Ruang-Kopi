import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import menuRoutes from './routes/menu.routes.js';
import categoryRoutes from './routes/category.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import authRoutes from './routes/auth.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import ideasRoutes from './routes/ideas.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['https://ruang-kopi-web.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'RuangKopi API is running!' });
});

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ideas', ideasRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 RuangKopi API server running on http://localhost:${PORT}`);
    console.log(`📚 Available endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   GET  /api/menu`);
    console.log(`   GET  /api/categories`);
    console.log(`   GET  /api/gallery`);
    console.log(`   POST /api/reservations`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/settings/status`);
    console.log(`   POST /api/upload`);
});

export default app;
