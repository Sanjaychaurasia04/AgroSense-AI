// src/routes/conversation.routes.js
import express from 'express';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * POST /api/conversations
 * Create a new conversation (or community post when isSaved=true).
 * Body: { auth0Id, messages, topic?, isSaved?, author?, location? }
 */
router.post('/', async (req, res) => {
  try {
    const { auth0Id, messages, topic, isSaved, author, location } = req.body;

    if (!auth0Id || !messages?.length) {
      return res.status(400).json({ error: 'auth0Id and messages are required' });
    }

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found. Sync user first.' });

    const conversation = await Conversation.create({
      userId:   user._id,
      messages,
      topic:    topic    || 'General',
      isSaved:  isSaved  ?? false,
      // author / location stored directly so community feed doesn't need
      // a separate User lookup for every render
      author:   author   || user.name || user.nickname || 'Farmer',
      location: location || user.location || 'Unknown',
      likes:    0,
    });

    res.status(201).json({ success: true, conversation });
  } catch (err) {
    console.error('Save conversation error:', err);
    res.status(500).json({ error: 'Failed to save conversation' });
  }
});

/**
 * PATCH /api/conversations/:id/messages
 * Append messages (replies) to an existing conversation.
 * Body: { messages: [{role, content}] }
 */
router.patch('/:id/messages', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages?.length) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { $push: { messages: { $each: messages } } },
      { new: true }
    );

    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    res.json({ success: true, conversation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

/**
 * PATCH /api/conversations/:id/save
 * Toggle isSaved (bookmark).
 */
router.patch('/:id/save', async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });

    conv.isSaved = !conv.isSaved;
    await conv.save();
    res.json({ success: true, isSaved: conv.isSaved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle save' });
  }
});

/**
 * PATCH /api/conversations/:id/like
 * Increment or decrement likes.
 * Body: { delta: 1 | -1 }
 */
router.patch('/:id/like', async (req, res) => {
  try {
    const delta = req.body.delta === -1 ? -1 : 1;
    const conv  = await Conversation.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: delta } },
      { new: true }
    );
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    res.json({ success: true, likes: conv.likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

/**
 * GET /api/conversations/:auth0Id
 * Fetch conversations for a user (optionally only saved ones).
 */
router.get('/:auth0Id', async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const filter = { userId: user._id };
    if (req.query.saved === 'true') filter.isSaved = true;

    const conversations = await Conversation.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

/**
 * DELETE /api/conversations/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;