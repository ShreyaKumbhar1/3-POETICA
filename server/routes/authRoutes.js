import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../data/db.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = express.Router();

// Register new author
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await db.findUserByUsernameOrEmail(username) || await db.findUserByUsernameOrEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An author with this username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      displayName: displayName || username,
      bio: bio || 'Author wandering through verses, dusk, and morning light.',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      favoriteGenres: ['Free Verse', 'Romantic'],
      favoriteLanguages: ['English'],
      isPublic: true,
      createdAt: new Date().toISOString()
    };

    await db.createUser(newUser);
    const token = signToken(newUser);

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create author account' });
  }
});

// Login author
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const user = await db.findUserByUsernameOrEmail(identifier);
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = signToken(user);
    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Get current author profile & metadata
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { passwordHash: _, ...safeUser } = req.user;
    const favoriteIds = await db.getUserFavoritePoemIds(req.user.id);
    const collections = await db.getCollections(req.user.id);
    const userPoems = await db.getPoems({ userId: req.user.id });

    return res.json({
      user: safeUser,
      favoriteIds,
      collections,
      stats: {
        totalPoems: userPoems.length,
        publishedPoems: userPoems.filter(p => p.isPublic).length,
        totalFavorites: favoriteIds.length,
        totalCollections: collections.length
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch author profile' });
  }
});

// Update author profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { displayName, bio, avatar, favoriteGenres, favoriteLanguages, isPublic } = req.body;
    const updates = {};
    if (displayName !== undefined) updates.displayName = displayName.trim();
    if (bio !== undefined) updates.bio = bio.trim();
    if (avatar !== undefined) updates.avatar = avatar.trim();
    if (favoriteGenres !== undefined) updates.favoriteGenres = favoriteGenres;
    if (favoriteLanguages !== undefined) updates.favoriteLanguages = favoriteLanguages;
    if (isPublic !== undefined) updates.isPublic = !!isPublic;

    const updated = await db.updateUser(req.user.id, updates);
    const { passwordHash: _, ...safeUser } = updated;
    return res.json({ user: safeUser });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update author profile' });
  }
});

// Forgot password simulated handler
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    // Return friendly simulated recovery message
    return res.json({
      message: `If an author account is associated with ${email}, a password reset sanctuary link has been dispatched.`
    });
  } catch (err) {
    return res.status(500).json({ error: 'Password recovery request failed' });
  }
});

export default router;
