// src/pages/Community/Community.jsx
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Btn from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Videos from '../Videos/Videos';
import { theme } from '../../styles/theme';

const Community = () => {
  const [posts, setPosts] = useState([
    { user: "Ramesh Kumar", location: "Punjab", time: "2h ago", content: "Found these yellow spots on my wheat leaves. Is this Yellow Rust? Rain has been heavy this week.", likes: 12, replies: 5, tag: "Disease Help" },
    { user: "Sunita Patel", location: "Gujarat", time: "5h ago", content: "My tomato plants suddenly started wilting despite regular watering. Soil seems fine. Any advice?", likes: 8, replies: 3, tag: "Crop Care" },
    { user: "Mohan Singh", location: "Haryana", time: "1d ago", content: "After using vermicompost on my 10 acres, yield increased by 30% compared to last season! Highly recommend.", likes: 45, replies: 12, tag: "Success Story" },
  ]);
  const [newPost, setNewPost] = useState("");

  const tagColors = {
    "Disease Help": theme.alert,
    "Crop Care": theme.leaf,
    "Success Story": theme.wheat,
    "Market Info": theme.rain
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Videos />
      </div>
      <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 8 }}>
        Farmer Community
      </h2>
      <p style={{ color: theme.mist, marginBottom: 24, opacity: 0.8, fontSize: 14 }}>
        Connect with farmers, share knowledge, get peer advice
      </p>

      <Card style={{ marginBottom: 20 }}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share a problem, tip, or success story with the farming community..."
          style={{
            width: "100%",
            minHeight: 80,
            background: "transparent",
            border: "none",
            color: theme.cream,
            fontFamily: "inherit",
            fontSize: 14,
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Btn
            icon="send"
            onClick={() => {
              if (newPost.trim()) {
                setPosts([
                  { user: "You", location: "Your Farm", time: "Just now", content: newPost, likes: 0, replies: 0, tag: "Crop Care" },
                  ...posts
                ]);
                setNewPost("");
              }
            }}
          >
            Post to Community
          </Btn>
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.map((p, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.earth}, ${theme.leaf})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: theme.cream
                }}>
                  {p.user[0]}
                </div>
                <div>
                  <p style={{ color: theme.cream, fontWeight: 600, fontSize: 14 }}>{p.user}</p>
                  <p style={{ color: theme.mist, fontSize: 12 }}>{p.location} • {p.time}</p>
                </div>
              </div>
              <Badge color={tagColors[p.tag] || theme.wheat}>{p.tag}</Badge>
            </div>
            <p style={{ color: theme.cream, lineHeight: 1.7, marginBottom: 12 }}>{p.content}</p>
            <div style={{ display: "flex", gap: 16 }}>
              <button style={{ background: "none", border: "none", color: theme.mist, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                ♥ {p.likes} Helpful
              </button>
              <button style={{ background: "none", border: "none", color: theme.mist, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                💬 {p.replies} Replies
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;