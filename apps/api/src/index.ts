import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['https://ruang-kopi-web.vercel.app', 'https://www.ruangkopi.site', 'https://ruangkopi.site', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'RuangKopi API is running!' });
});

// API Routes (consolidated)
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 RuangKopi API server running on http://localhost:${PORT}`);
    console.log(`📚 API Base: /api`);
    console.log(`   Routes: auth, menu, categories, gallery, reservations, settings, upload, ideas`);
});

export default app;
