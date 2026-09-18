import express from 'express';
import { db } from '../data/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all collections for current author
router.get('/', requireAuth, async (req, res) => {
  try {
    const collections = await db.getCollections(req.user.id);
    return res.json(collections);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Create new collection
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description = '', poemIds = [] } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const newCollection = {
      id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user.id,
      name: name.trim(),
      description: description.trim(),
      poemIds: Array.isArray(poemIds) ? poemIds : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.createCollection(newCollection);
    return res.status(201).json(newCollection);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create collection' });
  }
});

// Update collection
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name.trim();
    if (req.body.description !== undefined) updates.description = req.body.description.trim();
    if (req.body.poemIds !== undefined) updates.poemIds = req.body.poemIds;

    const updated = await db.updateCollection(req.params.id, req.user.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Collection not found or unauthorized' });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update collection' });
  }
});

// Delete collection
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const success = await db.deleteCollection(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ error: 'Collection not found or unauthorized' });
    }
    return res.json({ success: true, message: 'Collection removed' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete collection' });
  }
});

export default router;
