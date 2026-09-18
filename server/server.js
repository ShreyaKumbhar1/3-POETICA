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
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
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

// Production Static Serving
if (process.env.NODE_ENV === 'production') {
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

app.listen(PORT, () => {
  console.log(`🌸 POETICA Studio Backend running at http://localhost:${PORT}`);
  console.log(`📖 Tagline: "Turn feelings into words."`);
  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    console.log(`✨ Note: Running with POETICA Intelligent Offline Demo Engine (Add GEMINI_API_KEY or OPENAI_API_KEY in .env for live AI provider)`);
  }
});
