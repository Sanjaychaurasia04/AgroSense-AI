// src/pages/Community/Community.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Btn from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Videos from '../Videos/Videos';
import { theme } from '../../styles/theme';

// ── same pattern as DiseaseDetection.jsx ─────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TAG_OPTIONS = ['Disease Help', 'Crop Care', 'Success Story', 'Market Info', 'General'];

const tagColors = {
  'Disease Help':  '#e53e3e',
  'Crop Care':     '#38a169',
  'Success Story': '#d69e2e',
  'Market Info':   '#3182ce',
  'General':       '#718096',
};

const timeSince = (dateStr) => {
  if (!dateStr) return 'Just now';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/* ─── PostCard ─────────────────────────────────────────────── */

const PostCard = ({ post, onLike, onDelete, currentUserSub }) => {
  const [showReply, setShowReply]   = useState(false);
  const [replyText, setReplyText]   = useState('');
  const [replies, setReplies]       = useState(
    (post.messages || []).slice(1) // skip the original post message
  );
  const [submitting, setSubmitting] = useState(false);

  const isOwn = post.authorId === currentUserSub;
  const avatarLetter = (name = '') => name.trim()[0]?.toUpperCase() || '?';

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/conversations/${post._id}/messages`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: [{ role: 'user', content: replyText.trim() }],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReplies((data.conversation.messages || []).slice(1));
        setReplyText('');
        setShowReply(false);
      }
    } catch (e) {
      console.error('Reply error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ position: 'relative' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.earth || '#6b4f2a'}, ${theme.leaf || '#38a169'})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: theme.cream || '#fffff0', fontSize: 15,
          }}>
            {avatarLetter(post.author)}
          </div>
          <div>
            <p style={{ color: theme.cream, fontWeight: 600, fontSize: 14, margin: 0 }}>
              {post.author || 'Farmer'}
            </p>
            <p style={{ color: theme.mist, fontSize: 12, margin: 0, opacity: 0.8 }}>
              {post.location || 'Your Farm'} · {timeSince(post.createdAt)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge color={tagColors[post.topic] || theme.wheat}>{post.topic || 'General'}</Badge>
          {isOwn && (
            <button
              onClick={() => onDelete(post._id)}
              title="Delete post"
              style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: 16, padding: '2px 6px', lineHeight: 1 }}
            >✕</button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <p style={{ color: theme.cream, lineHeight: 1.75, marginBottom: 14, fontSize: 14 }}>
        {post.messages?.[0]?.content || ''}
      </p>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => onLike(post._id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 13,
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
            color: post.liked ? '#e53e3e' : theme.mist,
          }}
        >
          {post.liked ? '❤️' : '♥'} {post.likes || 0} Helpful
        </button>
        <button
          onClick={() => setShowReply(v => !v)}
          style={{ background: 'none', border: 'none', color: theme.mist, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          💬 {replies.length} Replies
        </button>
      </div>

      {/* ── Replies ── */}
      {replies.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {replies.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                background: r.role === 'assistant' ? '#3182ce' : '#38a169',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: '#fff', fontWeight: 700,
              }}>
                {r.role === 'assistant' ? 'AI' : 'U'}
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: '8px 12px', fontSize: 13,
                color: theme.mist, lineHeight: 1.6, flex: 1,
              }}>
                {r.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Reply input ── */}
      {showReply && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply()}
            placeholder="Write a reply…"
            style={{
              flex: 1, background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
              padding: '8px 12px', color: theme.cream, fontSize: 13,
              fontFamily: 'inherit', outline: 'none',
            }}
          />
          <button
            onClick={handleReply}
            disabled={submitting || !replyText.trim()}
            style={{
              background: theme.leaf || '#38a169', border: 'none', borderRadius: 8,
              color: '#fff', padding: '8px 16px', fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 600, opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? '…' : 'Send'}
          </button>
        </div>
      )}
    </Card>
  );
};

/* ─── Main Community ───────────────────────────────────────── */

const Community = ({ user }) => {
  // user = { name, email, sub, picture } passed from App after OTP / Google login
  const isLoggedIn = !!user?.sub;

  const [posts, setPosts]           = useState([]);
  const [newPost, setNewPost]       = useState('');
  const [selTag, setSelTag]         = useState('Crop Care');
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter]         = useState('all');
  const [likedIds, setLikedIds]     = useState(new Set());

  /* ── fetch community posts ── */
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/community`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Community fetch error:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  /* ── create new post ── */
  const handlePost = async () => {
    if (!newPost.trim() || !isLoggedIn) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/conversations`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth0Id:  user.sub,
          messages: [{ role: 'user', content: newPost.trim() }],
          topic:    selTag,
          isSaved:  true,
          author:   user.name || user.email || 'Farmer',
          location: 'Your Farm',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => [{
          ...data.conversation,
          author:   user.name || user.email || 'Farmer',
          location: 'Your Farm',
          authorId: user.sub,
          likes:    0,
          liked:    false,
        }, ...prev]);
        setNewPost('');
      }
    } catch (e) {
      console.error('Post error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── delete post ── */
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/api/conversations/${id}`, { method: 'DELETE' });
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  /* ── like (optimistic + persist) ── */
  const handleLike = async (id) => {
    const alreadyLiked = likedIds.has(id);
    const delta = alreadyLiked ? -1 : 1;

    setLikedIds(prev => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(id) : next.add(id);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p._id === id
        ? { ...p, likes: Math.max(0, (p.likes || 0) + delta), liked: !alreadyLiked }
        : p
    ));

    try {
      await fetch(`${API_BASE}/api/conversations/${id}/like`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ delta }),
      });
    } catch (e) {
      console.error('Like error:', e);
    }
  };

  /* ── filter view ── */
  const filtered = posts.filter(p => {
    if (filter === 'mine')  return p.authorId === user?.sub;
    if (filter === 'saved') return p.isSaved;
    return true;
  });

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Videos />
      </div>

      <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 4 }}>
        Farmer Community
      </h2>
      <p style={{ color: theme.mist, marginBottom: 20, opacity: 0.8, fontSize: 14 }}>
        Connect with farmers, share knowledge, get peer advice
      </p>

      {/* ── Composer ── */}
      {isLoggedIn ? (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {TAG_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => setSelTag(t)}
                style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit',
                  border:     `1px solid ${selTag === t ? (tagColors[t] || '#d69e2e') : 'rgba(255,255,255,0.15)'}`,
                  background: selTag === t ? `${tagColors[t]}22` : 'transparent',
                  color:      selTag === t ? (tagColors[t] || '#d69e2e') : theme.mist,
                  cursor: 'pointer', transition: 'all .15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Share a problem, tip, or success story with the farming community…"
            style={{
              width: '100%', minHeight: 88,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              color: theme.cream, fontFamily: 'inherit', fontSize: 14,
              resize: 'none', outline: 'none', padding: '10px 14px',
              boxSizing: 'border-box', lineHeight: 1.65,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <Btn icon="send" disabled={!newPost.trim() || submitting} onClick={handlePost}>
              {submitting ? 'Posting…' : 'Post to Community'}
            </Btn>
          </div>
        </Card>
      ) : (
        <Card style={{ marginBottom: 20, textAlign: 'center', padding: '18px 24px' }}>
          <p style={{ color: theme.mist, fontSize: 14 }}>
            Please <strong style={{ color: theme.wheat }}>sign in</strong> to post in the community.
          </p>
        </Card>
      )}

      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center' }}>
        {[['all', 'All Posts'], ['mine', 'My Posts'], ['saved', 'Saved']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontFamily: 'inherit',
              border:     `1px solid ${filter === val ? theme.wheat : 'rgba(255,255,255,0.12)'}`,
              background: filter === val ? `${theme.wheat}18` : 'transparent',
              color:      filter === val ? theme.wheat : theme.mist,
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            {label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: theme.mist, fontSize: 13 }}>
          {filtered.length} post{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Feed ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: theme.mist, fontSize: 14 }}>
          Loading community posts…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: theme.mist, fontSize: 14 }}>
          {filter === 'mine' ? "You haven't posted yet." : 'No posts yet — be the first to share!'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(p => (
            <PostCard
              key={p._id}
              post={{ ...p, liked: likedIds.has(p._id) }}
              onLike={handleLike}
              onDelete={handleDelete}
              currentUserSub={user?.sub}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;