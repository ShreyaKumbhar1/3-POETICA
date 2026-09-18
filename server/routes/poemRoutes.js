import express from 'express';
import { db } from '../data/db.js';
import { AIService } from '../services/aiService.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Generate a poem
router.post('/generate', async (req, res) => {
  try {
    const poemData = await AIService.generatePoem(req.body);
    return res.json(poemData);
  } catch (err) {
    console.error('Poem generation error:', err);
    return res.status(500).json({ error: 'Failed to generate poem. Please try again.' });
  }
});

// Title Lab: Generate alternative titles
router.post('/titles', async (req, res) => {
  try {
    const { poem } = req.body;
    if (!poem) {
      return res.status(400).json({ error: 'Poem is required for Title Lab' });
    }
    const titles = await AIService.generateTitles(poem);
    return res.json(titles);
  } catch (err) {
    console.error('Title lab error:', err);
    return res.status(500).json({ error: 'Failed to generate title variations' });
  }
});

// Line Lab: Targeted line variations
router.post('/line-lab', async (req, res) => {
  try {
    const { line, mode = 'improve' } = req.body;
    if (!line) {
      return res.status(400).json({ error: 'Line is required for Line Lab' });
    }
    const result = await AIService.analyzeLine(line, mode);
    return res.json(result);
  } catch (err) {
    console.error('Line lab error:', err);
    return res.status(500).json({ error: 'Failed to analyze line' });
  }
});

// Complete the Thought generator
router.post('/complete-thought', async (req, res) => {
  try {
    const { seed } = req.body;
    const result = await AIService.completeThought(seed);
    return res.json(result);
  } catch (err) {
    console.error('Complete thought error:', err);
    return res.status(500).json({ error: 'Failed to complete thought' });
  }
});

// Remix a poem
router.post('/remix', async (req, res) => {
  try {
    const { poem, remixType } = req.body;
    if (!poem || !remixType) {
      return res.status(400).json({ error: 'Poem and remixType are required' });
    }
    const remixed = await AIService.remixPoem(poem, remixType);
    return res.json(remixed);
  } catch (err) {
    console.error('Poem remix error:', err);
    return res.status(500).json({ error: 'Failed to remix poem' });
  }
});

// Translate a poem
router.post('/translate', async (req, res) => {
  try {
    const { poem, targetLanguage } = req.body;
    if (!poem || !targetLanguage) {
      return res.status(400).json({ error: 'Poem and targetLanguage are required' });
    }
    const translation = await AIService.translatePoem(poem, targetLanguage);
    return res.json(translation);
  } catch (err) {
    console.error('Poem translation error:', err);
    return res.status(500).json({ error: 'Failed to translate poem' });
  }
});

// Explain a poem
router.post('/explain', async (req, res) => {
  try {
    const { poem } = req.body;
    if (!poem) {
      return res.status(400).json({ error: 'Poem is required' });
    }
    const explanation = await AIService.explainPoem(poem);
    return res.json(explanation);
  } catch (err) {
    console.error('Poem explanation error:', err);
    return res.status(500).json({ error: 'Failed to analyze poem' });
  }
});

// AI Assistant for Poem Editor
router.post('/assist', async (req, res) => {
  try {
    const { action, text, context } = req.body;
    if (!action) {
      return res.status(400).json({ error: 'Assistant action is required' });
    }
    const result = await AIService.assistPoem(action, text, context);
    return res.json(result);
  } catch (err) {
    console.error('AI assistant error:', err);
    return res.status(500).json({ error: 'AI assistant unavailable' });
  }
});

// List poems for the current logged in author
router.get('/', requireAuth, async (req, res) => {
  try {
    const { language, mood, style, theme, search, sort, isPublic } = req.query;
    const filters = {
      userId: req.user.id,
      language,
      mood,
      style,
      theme,
      search,
      sort
    };
    if (isPublic !== undefined) filters.isPublic = isPublic === 'true';

    const poems = await db.getPoems(filters);
    const favoriteIds = await db.getUserFavoritePoemIds(req.user.id);

    const enriched = poems.map(p => ({
      ...p,
      isFavorited: favoriteIds.includes(p.id)
    }));

    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch library poems' });
  }
});

// Get user's favorited poems
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const favoriteIds = await db.getUserFavoritePoemIds(req.user.id);
    const allPoems = await db.getPoems({});
    const favPoems = allPoems.filter(p => favoriteIds.includes(p.id)).map(p => ({ ...p, isFavorited: true }));
    return res.json(favPoems);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Get single poem by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const poem = await db.getPoemById(req.params.id);
    if (!poem) {
      return res.status(404).json({ error: 'Poem not found' });
    }

    if (!poem.isPublic && (!req.user || req.user.id !== poem.userId)) {
      return res.status(403).json({ error: 'This poem is private to its author' });
    }

    let isFavorited = false;
    let isLiked = false;
    if (req.user) {
      isFavorited = await db.isFavoritedByUser(poem.id, req.user.id);
      isLiked = await db.isLikedByUser(poem.id, req.user.id);
    }

    return res.json({
      ...poem,
      isFavorited,
      isLiked
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch poem' });
  }
});

// Save a poem (create new)
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      title,
      content,
      language = 'English',
      theme = 'Nature',
      mood = 'Peaceful',
      emotion = 'Wonder',
      style = 'Free Verse',
      structure = 'Stanzaic',
      tone = 'Contemplative',
      atmosphere = 'minimal',
      atmosphereProfile = {},
      dna = {},
      stats = {},
      explanation = {},
      translation = '',
      vocabulary = [],
      tags = [],
      isPublic = false,
      versions = [],
      journey = []
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const now = new Date().toISOString();
    const initialJourney = journey && journey.length > 0 ? journey : [
      { action: 'Saved', timestamp: now, detail: 'Preserved in author sanctuary' }
    ];
    const initialVersions = versions && versions.length > 0 ? versions : [
      { version: 1, title: title.trim(), content: content.trim(), timestamp: now, action: 'Initial Save' }
    ];

    const newPoem = {
      id: `poem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user.id,
      authorName: req.user.displayName || req.user.username,
      authorUsername: req.user.username,
      title: title.trim(),
      content: content.trim(),
      language,
      theme,
      mood,
      emotion,
      style,
      structure,
      tone,
      atmosphere,
      atmosphereProfile,
      dna,
      stats,
      explanation,
      translation,
      vocabulary,
      tags: Array.isArray(tags) ? tags : [],
      isPublic: !!isPublic,
      likesCount: 0,
      favoritesCount: 0,
      versions: initialVersions,
      journey: initialJourney,
      createdAt: now,
      updatedAt: now
    };

    const saved = await db.createPoem(newPoem);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Save poem error:', err);
    return res.status(500).json({ error: 'Failed to save poem' });
  }
});

// Update a poem (with version history and journey tracking)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const poem = await db.getPoemById(req.params.id);
    if (!poem) {
      return res.status(404).json({ error: 'Poem not found' });
    }

    if (poem.userId !== req.user.id) {
      return res.status(403).json({ error: 'You may only edit poems you created' });
    }

    const now = new Date().toISOString();
    const existingVersions = Array.isArray(poem.versions) ? [...poem.versions] : [
      { version: 1, title: poem.title, content: poem.content, timestamp: poem.createdAt, action: 'Original' }
    ];
    const existingJourney = Array.isArray(poem.journey) ? [...poem.journey] : [
      { action: 'Created', timestamp: poem.createdAt, detail: 'Initial creation' }
    ];

    const updates = {};
    const contentChanged = req.body.content !== undefined && req.body.content.trim() !== poem.content;
    const titleChanged = req.body.title !== undefined && req.body.title.trim() !== poem.title;

    if (titleChanged) updates.title = req.body.title.trim();
    if (contentChanged) updates.content = req.body.content.trim();
    if (req.body.language !== undefined) updates.language = req.body.language;
    if (req.body.theme !== undefined) updates.theme = req.body.theme;
    if (req.body.mood !== undefined) updates.mood = req.body.mood;
    if (req.body.style !== undefined) updates.style = req.body.style;
    if (req.body.atmosphere !== undefined) updates.atmosphere = req.body.atmosphere;
    if (req.body.isPublic !== undefined) updates.isPublic = !!req.body.isPublic;
    if (req.body.explanation !== undefined) updates.explanation = req.body.explanation;
    if (req.body.translation !== undefined) updates.translation = req.body.translation;
    if (req.body.tags !== undefined) updates.tags = req.body.tags;

    // If content or title changed, push to version history
    if (contentChanged || titleChanged) {
      const nextVersionNumber = existingVersions.length + 1;
      existingVersions.push({
        version: nextVersionNumber,
        title: updates.title || poem.title,
        content: updates.content || poem.content,
        timestamp: now,
        action: req.body.versionAction || 'Edited in Studio'
      });
      updates.versions = existingVersions;

      existingJourney.push({
        action: req.body.versionAction || 'Edited',
        timestamp: now,
        detail: `Version ${nextVersionNumber}`
      });
      updates.journey = existingJourney;
    }

    const updated = await db.updatePoem(req.params.id, updates);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update poem' });
  }
});

// Delete a poem
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const poem = await db.getPoemById(req.params.id);
    if (!poem) {
      return res.status(404).json({ error: 'Poem not found' });
    }

    if (poem.userId !== req.user.id) {
      return res.status(403).json({ error: 'You may only delete your own poems' });
    }

    await db.deletePoem(req.params.id);
    return res.json({ success: true, message: 'Poem deleted from sanctuary' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete poem' });
  }
});

// Toggle Favorite
router.post('/:id/favorite', requireAuth, async (req, res) => {
  try {
    const result = await db.toggleFavorite(req.params.id, req.user.id);
    if (result.error) return res.status(404).json(result);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// Toggle Like
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const result = await db.toggleLike(req.params.id, req.user.id);
    if (result.error) return res.status(404).json(result);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle like' });
  }
});

export default router;
