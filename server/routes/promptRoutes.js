import express from 'express';
import { db } from '../data/db.js';
import { AIService } from '../services/aiService.js';

const router = express.Router();

// Get curated writing prompts & daily inspiration
router.get('/', async (req, res) => {
  try {
    const prompts = await db.getPrompts();
    // Deterministic "Daily Inspiration" based on current day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const dailyPrompt = prompts[dayOfYear % prompts.length] || prompts[0];

    return res.json({
      daily: dailyPrompt,
      all: prompts
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch writing prompts' });
  }
});

// Generate dynamic prompt
router.post('/generate', async (req, res) => {
  try {
    const prompt = await AIService.generatePrompt(req.body);
    return res.json(prompt);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate prompt' });
  }
});

export default router;
