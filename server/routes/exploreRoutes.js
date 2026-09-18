import express from 'express';
import { db } from '../data/db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get public community poems
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { language, mood, style, theme, search, sort = 'newest' } = req.query;
    const filters = {
      isPublic: true,
      language,
      mood,
      style,
      theme,
      search,
      sort
    };

    const poems = await db.getPoems(filters);
    let favoriteIds = [];
    if (req.user) {
      favoriteIds = await db.getUserFavoritePoemIds(req.user.id);
    }

    const enriched = await Promise.all(poems.map(async (p) => {
      let isLiked = false;
      if (req.user) {
        isLiked = await db.isLikedByUser(p.id, req.user.id);
      }
      return {
        ...p,
        isFavorited: favoriteIds.includes(p.id),
        isLiked
      };
    }));

    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch public showcase' });
  }
});

// Report a poem
router.post('/:id/report', optionalAuth, async (req, res) => {
  try {
    const { reason = 'Inappropriate content' } = req.body;
    const report = {
      id: `rep_${Date.now()}`,
      poemId: req.params.id,
      reporterId: req.user ? req.user.id : 'anonymous',
      reason,
      createdAt: new Date().toISOString()
    };

    await db.createReport(report);
    return res.json({ success: true, message: 'Thank you for helping keep POETICA safe and literary.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit report' });
  }
});

export default router;
