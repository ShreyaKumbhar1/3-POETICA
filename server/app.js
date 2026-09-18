import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/authRoutes.js';
import poemRoutes from './routes/poemRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import promptRoutes from './routes/promptRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

// If body was already parsed by a serverless runtime (e.g. Vercel), mark it so express.json() doesn't hang on consumed stream
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req._body = true;
  }
  next();
});
app.use(express.json({ limit: '5mb' }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'POETICA — AI Poem Generator',
    tagline: 'Turn feelings into words.',
    secondaryTagline: 'Every feeling has a poem waiting to be written.',
    aiStatus: {
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
      demoModeAvailable: true
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/prompts', promptRoutes);

// 404 handler for unknown /api/* requests
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl || req.url}` });
});

// Production Static Serving (only when running standalone server, e.g. npm start / Docker)
// On Vercel, static files and SPA fallback are handled natively by Vercel CDN and vercel.json
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({ error: 'An unexpected poetic whisper went unheard. Please try again.' });
});

export default app;
