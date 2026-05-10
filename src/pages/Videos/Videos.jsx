// src/pages/Videos/Videos.jsx
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Btn from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { theme } from '../../styles/theme';

// Extract video ID from a YouTube URL
const getVideoId = (url) => {
  const match = url.match(/youtu\.be\/([^?]+)/) || url.match(/v=([^&]+)/);
  return match ? match[1] : null;
};

const videos = [
  {
    crop: "Rice",
    topic: "Cultivation Guide",
    thumb: "",
    url: "https://youtu.be/_sSl86SOfzo?si=PvwcFuR9V2AGB3HW",
    videoId: "_sSl86SOfzo",
    description: "Complete rice cultivation techniques — from seed selection and nursery preparation to transplanting, water management, and harvesting.",
  },
  {
    crop: "Wheat",
    topic: "Sowing & Irrigation",
    thumb: "",
    url: "https://youtu.be/ZkCSGoPxATE?si=kmCdjqMDjb_ryiTs",
    videoId: "ZkCSGoPxATE",
    description: "Step-by-step guide to wheat sowing, irrigation scheduling, fertilizer application, and how to maximize yield in Rabi season.",
  },
  {
    crop: "Tomato",
    topic: "Disease Management",
    thumb: "",
    url: "https://youtu.be/NJJErPfQ-W0?si=er769JL_GcPHEUfZ",
    videoId: "NJJErPfQ-W0",
    description: "Identify and control common tomato diseases like early blight, late blight, and leaf curl virus with organic and chemical methods.",
  },
  {
    crop: "Organic Farming",
    topic: "Techniques & Tips",
    thumb: "",
    url: "https://youtu.be/dV9xmkFmOhU?si=tgHuz6D2fpPFs0EF",
    videoId: "dV9xmkFmOhU",
    description: "Learn organic farming practices — composting, vermicomposting, natural pest repellents, and how to get organic certification in India.",
  },
  {
    crop: "Irrigation System",
    topic: "Drip & Sprinkler",
    thumb: "",
    url: "https://youtu.be/Z9HAy9EYKKs?si=ODgupZqoZeUn3jCK",
    videoId: "Z9HAy9EYKKs",
    description: "How to set up drip and sprinkler irrigation systems on your farm — reduce water usage by 50% and improve crop yield significantly.",
  },
  {
    crop: "Pest Control",
    topic: "IPM Methods",
    thumb: "",
    url: "https://youtu.be/-c6OuXMSWeE?si=vSEPPRLTFMuqqROa",
    videoId: "-c6OuXMSWeE",
    description: "Integrated Pest Management (IPM) techniques — identify common farm pests, use biological controls, and apply pesticides only when necessary.",
  },
];

const Videos = () => {
  const [active, setActive] = useState(null);

  return (
    <div>
      <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 8 }}>
        Educational Videos
      </h2>
      <p style={{ color: theme.mist, marginBottom: 24, opacity: 0.8, fontSize: 14 }}>
        Curated YouTube videos for every crop and farming technique
      </p>

      {/* ── Video Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {videos.map((v, i) => (
          <Card
            key={i}
            onClick={() => setActive(active?.videoId === v.videoId ? null : v)}
            style={{
              cursor: "pointer",
              padding: 0,
              overflow: "hidden",
              border: `1.5px solid ${active?.videoId === v.videoId ? theme.sprout : "rgba(212,168,67,0.2)"}`,
              background: active?.videoId === v.videoId ? `${theme.leaf}22` : "rgba(255,248,238,0.04)",
              transition: "all 0.2s",
            }}
          >
            {/* YouTube thumbnail */}
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000" }}>
              <img
                src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                alt={v.crop}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
              />
              {/* Play button overlay */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,0,0,0.85)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}>
                <span style={{ color: "#fff", fontSize: 14, marginLeft: 3 }}>▶</span>
              </div>
              {/* Emoji badge */}
              <div style={{
                position: "absolute", top: 8, left: 8,
                background: "rgba(0,0,0,0.6)", borderRadius: 6,
                padding: "2px 7px", fontSize: 16,
              }}>
                {v.thumb}
              </div>
            </div>

            {/* Card text */}
            <div style={{ padding: "12px 14px 14px" }}>
              <p style={{ color: theme.cream, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{v.crop}</p>
              <p style={{ color: theme.mist, fontSize: 12, marginBottom: 8 }}>{v.topic}</p>
              <p style={{ color: theme.mist, fontSize: 11, lineHeight: 1.6, opacity: 0.75 }}>{v.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Embedded Player ── */}
      {active && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ color: theme.cream, marginBottom: 2 }}>{active.thumb} {active.crop} — {active.topic}</h3>
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.sprout, fontSize: 12, textDecoration: "none", opacity: 0.8 }}
              >
                ↗ Open on YouTube
              </a>
            </div>
            <Btn variant="ghost" onClick={() => setActive(null)}>
              <Icon name="x" size={16} />
            </Btn>
          </div>

          {/* Responsive iframe */}
          <div style={{ borderRadius: 12, overflow: "hidden", position: "relative", paddingBottom: "56.25%" }}>
            <iframe
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${active.crop} - ${active.topic}`}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Videos;