// src/routes/community.routes.js
import express from 'express';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/community
 * Returns all community posts (conversations where isSaved=true),
 * enriched with author info, sorted newest-first.
 */
router.get('/', async (req, res) => {
  try {
    const { tag, limit = 50, skip = 0 } = req.query;

    const filter = { isSaved: true };
    if (tag) filter.topic = tag;

    const conversations = await Conversation.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    // Attach author info from User collection
    const userIds = [...new Set(conversations.map(c => c.userId.toString()))];
    const users   = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]));

    const posts = conversations.map(c => {
      const u = userMap[c.userId.toString()] || {};
      return {
        ...c,
        author:   c.author   || u.name   || u.nickname || 'Farmer',
        location: c.location || u.location || 'Unknown',
        authorId: u.auth0Id  || null,
        likes:    c.likes    || 0,
      };
    });

    res.json({ success: true, posts });
  } catch (err) {
    console.error('Community fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
});

export default router;