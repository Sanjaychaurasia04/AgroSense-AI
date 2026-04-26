// src/models/Conversation.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      default: 'General',
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    isSaved: {
      type: Boolean,
      default: false,
      index: true,           // indexed — community feed filters on this
    },
    // Denormalised author info so the community feed is fast (no join needed)
    author: {
      type: String,
      default: 'Farmer',
    },
    location: {
      type: String,
      default: 'Unknown',
    },
    // Simple like counter
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ isSaved: 1, createdAt: -1 }); // community feed index

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;