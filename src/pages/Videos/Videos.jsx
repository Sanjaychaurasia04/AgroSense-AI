// src/pages/Videos/Videos.jsx
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Btn from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { theme } from '../../styles/theme';

const Videos = () => {
  const playlists = [
    { crop: "Rice", topic: "Cultivation", id: "PLbpi6ZahtOH6Ar_3GPy3lVFfmE6nBot7B", thumb: "🌾" },
    { crop: "Wheat", topic: "Sowing & Irrigation", id: "PLbpi6ZahtOH6Ar_3GPy3lVFfmE6nBot7B", thumb: "🌿" },
    { crop: "Tomato", topic: "Disease Management", id: "PLbpi6ZahtOH6Ar_3GPy3lVFfmE6nBot7B", thumb: "🍅" },
    { crop: "Organic Farming", topic: "Techniques", id: "PLbpi6ZahtOH6Ar_3GPy3lVFfmE6nBot7B", thumb: "🌱" },
    { crop: "Irrigation", topic: "Drip & Sprinkler", id: "PLbpi6ZahtOH6Ar_3GPy3lVFfmE6nBot7B", thumb: "💧" },
    { crop: "Pest Control", topic: "IPM Methods", id: "PLbpi6ZahtOH6Ar_3GPy3lVFfmE6nBot7B", thumb: "🐛" },
  ];

  const [active, setActive] = useState(null);

  return (
    <div>
      <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 8 }}>
        Educational Videos
      </h2>
      <p style={{ color: theme.mist, marginBottom: 24, opacity: 0.8, fontSize: 14 }}>
        Curated YouTube playlists for every crop and farming technique
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {playlists.map((p, i) => (
          <Card
            key={i}
            onClick={() => setActive(p)}
            style={{
              cursor: "pointer",
              background: active?.crop === p.crop ? `${theme.leaf}22` : "rgba(255,248,238,0.04)",
              borderColor: active?.crop === p.crop ? theme.sprout : "rgba(212,168,67,0.2)",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{p.thumb}</div>
            <p style={{ color: theme.cream, fontWeight: 700, marginBottom: 4 }}>{p.crop}</p>
            <p style={{ color: theme.mist, fontSize: 12 }}>{p.topic}</p>
          </Card>
        ))}
      </div>

      {active && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: theme.cream }}>{active.crop} - {active.topic}</h3>
            <Btn variant="ghost" onClick={() => setActive(null)}>
              <Icon name="x" size={16} />
            </Btn>
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", position: "relative", paddingBottom: "56.25%" }}>
            <iframe
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              src={`https://www.youtube.com/embed/videoseries?list=${active.id}`}
              allowFullScreen
              title={`${active.crop} playlist`}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Videos;