// src/pages/Calendar/CropCalendar.jsx
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { theme, typeColors } from '../../styles/theme';

const CropCalendar = () => {
  const [crop, setCrop] = useState("Wheat");
  const [sowDate, setSowDate] = useState("2025-11-01");

  const calendars = {
    Wheat: [
      { day: 0, task: "Sowing", detail: "Sow certified wheat seeds at 100 kg/ha depth 5-6cm", type: "sow" },
      { day: 15, task: "First Irrigation", detail: "Crown root initiation stage. Critical irrigation required", type: "water" },
      { day: 21, task: "Urea Application", detail: "Apply 1/3rd of total Nitrogen dose (65 kg/ha)", type: "fertilize" },
      { day: 35, task: "Weed Control", detail: "Apply isoproturon or clodinafop for weed management", type: "pest" },
      { day: 45, task: "Second Irrigation", detail: "Tillering stage irrigation. Do not over-irrigate", type: "water" },
      { day: 60, task: "Disease Watch", detail: "Watch for Rust (yellow/brown). Apply Propiconazole if needed", type: "disease" },
      { day: 75, task: "Third Irrigation", detail: "Jointing stage. Most critical for yield", type: "water" },
      { day: 90, task: "Micronutrient Spray", detail: "Spray ZnSO₄ + Urea foliar to boost grain filling", type: "fertilize" },
      { day: 110, task: "Fourth Irrigation", detail: "Grain filling stage. Last irrigation", type: "water" },
      { day: 135, task: "Harvest Ready", detail: "Moisture ~14%. Use combine harvester", type: "harvest" },
    ],
  };

  const events = calendars[crop] || calendars.Wheat;

  const getDate = (days) => {
    const d = new Date(sowDate);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div>
      <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 8 }}>
        Crop Calendar
      </h2>
      <p style={{ color: theme.mist, marginBottom: 24, opacity: 0.8, fontSize: 14 }}>
        Dynamic crop management timeline from sowing to harvest
      </p>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        {["Wheat", "Rice", "Tomato", "Potato"].map(c => (
          <button
            key={c}
            onClick={() => setCrop(c)}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: `1px solid ${crop === c ? theme.wheat : theme.earth}`,
              background: crop === c ? `${theme.wheat}22` : "transparent",
              color: crop === c ? theme.wheat : theme.mist,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
            }}
          >
            {c}
          </button>
        ))}
        <input
          type="date"
          value={sowDate}
          onChange={(e) => setSowDate(e.target.value)}
          style={{
            marginLeft: "auto",
            background: "rgba(255,248,238,0.06)",
            border: `1px solid ${theme.earth}`,
            borderRadius: 10,
            padding: "8px 12px",
            color: theme.cream,
            fontFamily: "inherit",
            fontSize: 13,
            outline: "none",
          }}
        />
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 20, top: 20, bottom: 20, width: 2, background: `${theme.earth}44` }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingLeft: 44, paddingBottom: 20, position: "relative" }}>
              <div style={{
                position: "absolute",
                left: 12,
                top: 4,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: typeColors[e.type],
                border: `2px solid ${theme.soil}`,
                flexShrink: 0,
              }} />
              <Card style={{ flex: 1, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <p style={{ color: typeColors[e.type], fontWeight: 700, fontSize: 14 }}>{e.task}</p>
                  <span style={{ color: theme.mist, fontSize: 12 }}>{getDate(e.day)} (Day {e.day})</span>
                </div>
                <p style={{ color: theme.cream, fontSize: 13, opacity: 0.85 }}>{e.detail}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;