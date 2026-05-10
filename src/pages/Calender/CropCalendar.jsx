// src/pages/Calendar/CropCalendar.jsx
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { theme, typeColors } from '../../styles/theme';

const typeIcons = {
  water:     "W",
  fertilize: "F",
  disease:   "D",
  pest:      "P",
  harvest:   "H",
  sow:       "S",
  prune:     "Pr",
  spray:     "Sp",
};

const priorityColors = {
  high:   "#FF6B6B",
  medium: "#FFD93D",
  low:    "#6BCB77",
};

const cropDatabase = {
  Wheat: {
    duration: 135,
    stages: [
      { name: "Germination",   upTo: 10  },
      { name: "Seedling",      upTo: 25  },
      { name: "Tillering",     upTo: 55  },
      { name: "Jointing",      upTo: 80  },
      { name: "Heading",       upTo: 100 },
      { name: "Grain Filling", upTo: 120 },
      { name: "Maturity",      upTo: 135 },
    ],
    events: [
      { day: 0,   task: "Sowing",             detail: "Sow certified wheat seeds at 100 kg/ha, depth 5-6 cm.",             type: "sow",       priority: "high"   },
      { day: 15,  task: "First Irrigation",    detail: "Crown root initiation stage. Critical irrigation required.",         type: "water",     priority: "high"   },
      { day: 21,  task: "Urea Application",    detail: "Apply 1/3rd of total Nitrogen dose (65 kg/ha).",                   type: "fertilize", priority: "medium" },
      { day: 35,  task: "Weed Control",        detail: "Apply isoproturon or clodinafop for weed management.",             type: "pest",      priority: "medium" },
      { day: 45,  task: "Second Irrigation",   detail: "Tillering stage irrigation. Do not over-irrigate.",                type: "water",     priority: "medium" },
      { day: 60,  task: "Disease Watch",       detail: "Watch for Rust (yellow/brown). Apply Propiconazole if needed.",    type: "disease",   priority: "high"   },
      { day: 75,  task: "Third Irrigation",    detail: "Jointing stage - most critical for yield.",                        type: "water",     priority: "high"   },
      { day: 90,  task: "Micronutrient Spray", detail: "Spray ZnSO4 + Urea foliar to boost grain filling.",               type: "spray",     priority: "medium" },
      { day: 110, task: "Fourth Irrigation",   detail: "Grain filling stage. Last irrigation.",                            type: "water",     priority: "low"    },
      { day: 135, task: "Harvest Ready",       detail: "Moisture 14%. Use combine harvester.",                             type: "harvest",   priority: "high"   },
    ],
  },

  Rice: {
    duration: 150,
    stages: [
      { name: "Nursery",       upTo: 25  },
      { name: "Transplanting", upTo: 35  },
      { name: "Tillering",     upTo: 65  },
      { name: "Panicle Init.", upTo: 95  },
      { name: "Flowering",     upTo: 115 },
      { name: "Grain Filling", upTo: 135 },
      { name: "Maturity",      upTo: 150 },
    ],
    events: [
      { day: 0,   task: "Nursery Sowing",      detail: "Sow pre-soaked seeds in nursery beds at 25 kg/ha.",               type: "sow",       priority: "high"   },
      { day: 25,  task: "Transplanting",        detail: "Transplant 25-day-old seedlings at 20x15 cm spacing.",            type: "sow",       priority: "high"   },
      { day: 30,  task: "Basal Fertilizer",     detail: "Apply DAP 50 kg/ha + MOP 40 kg/ha at transplanting.",            type: "fertilize", priority: "high"   },
      { day: 40,  task: "Weed Control",         detail: "Apply butachlor or pretilachlor within 5 days of transplanting.", type: "pest",      priority: "medium" },
      { day: 55,  task: "Top Dressing",         detail: "Apply 50 kg urea/ha at active tillering stage.",                  type: "fertilize", priority: "medium" },
      { day: 70,  task: "Irrigation Check",     detail: "Maintain 5 cm standing water. Check bunds for leakage.",          type: "water",     priority: "medium" },
      { day: 85,  task: "Blast Disease Watch",  detail: "Apply Tricyclazole 0.1% if blast symptoms appear.",               type: "disease",   priority: "high"   },
      { day: 95,  task: "Panicle Irrigation",   detail: "Critical irrigation at panicle initiation. Ensure water standing.",type: "water",    priority: "high"   },
      { day: 110, task: "Potassium Spray",      detail: "Spray 2% KCl for better grain setting.",                          type: "spray",     priority: "low"    },
      { day: 135, task: "Drain Field",          detail: "Stop irrigation 2 weeks before harvest. Drain field.",            type: "water",     priority: "medium" },
      { day: 150, task: "Harvest",              detail: "Harvest when 80% grains turn golden. Moisture 20-22%.",           type: "harvest",   priority: "high"   },
    ],
  },

  Tomato: {
    duration: 120,
    stages: [
      { name: "Germination", upTo: 10  },
      { name: "Seedling",    upTo: 25  },
      { name: "Vegetative",  upTo: 55  },
      { name: "Flowering",   upTo: 75  },
      { name: "Fruit Set",   upTo: 95  },
      { name: "Ripening",    upTo: 120 },
    ],
    events: [
      { day: 0,   task: "Nursery / Transplant", detail: "Sow seeds in nursery trays. Transplant at 25-30 days.",           type: "sow",       priority: "high"   },
      { day: 10,  task: "First Irrigation",      detail: "Light irrigation after transplanting. Avoid waterlogging.",       type: "water",     priority: "high"   },
      { day: 20,  task: "Nitrogen Top Dress",    detail: "Apply 30 kg urea/ha to promote vegetative growth.",              type: "fertilize", priority: "medium" },
      { day: 30,  task: "Staking",               detail: "Provide bamboo stakes 1.2 m tall. Tie plants loosely.",          type: "prune",     priority: "medium" },
      { day: 40,  task: "Pest Scouting",         detail: "Check for aphids, whitefly, and fruit borers. Apply neem oil.",  type: "pest",      priority: "high"   },
      { day: 50,  task: "Phosphorus Spray",      detail: "Foliar spray of 0.5% DAP solution to encourage flowering.",      type: "spray",     priority: "medium" },
      { day: 60,  task: "Irrigation Boost",      detail: "Increase irrigation frequency at flowering. 2 times per week.",  type: "water",     priority: "medium" },
      { day: 70,  task: "Blight Watch",          detail: "Early/late blight likely. Spray Mancozeb 0.2% preventively.",   type: "disease",   priority: "high"   },
      { day: 85,  task: "Calcium Spray",         detail: "Spray 0.5% CaCl2 to prevent blossom end rot.",                  type: "spray",     priority: "low"    },
      { day: 100, task: "Ripening Check",        detail: "Monitor fruit color. Begin selective harvesting every 3-4 days.",type: "harvest",   priority: "medium" },
      { day: 120, task: "Final Harvest",         detail: "Complete harvest. Remove plant debris to prevent disease spread.",type: "harvest",   priority: "high"   },
    ],
  },

  Potato: {
    duration: 110,
    stages: [
      { name: "Emergence",   upTo: 15  },
      { name: "Vegetative",  upTo: 40  },
      { name: "Tuber Init.", upTo: 65  },
      { name: "Bulking",     upTo: 90  },
      { name: "Maturation",  upTo: 110 },
    ],
    events: [
      { day: 0,   task: "Seed Planting",     detail: "Plant certified seed tubers 40 g each at 20 cm depth, 60 cm rows.",    type: "sow",       priority: "high"   },
      { day: 15,  task: "First Earthing Up", detail: "Light earthing up around emerging shoots to prevent greening.",         type: "prune",     priority: "medium" },
      { day: 25,  task: "Urea Application",  detail: "Apply half N dose (75 kg urea/ha) + full K at earthing up.",           type: "fertilize", priority: "high"   },
      { day: 35,  task: "Irrigation",        detail: "Irrigate every 8-10 days. Maintain consistent soil moisture.",         type: "water",     priority: "medium" },
      { day: 45,  task: "Late Blight Alert", detail: "Most critical disease. Spray Cymoxanil + Mancozeb preventively.",      type: "disease",   priority: "high"   },
      { day: 55,  task: "Second Earthing",   detail: "Final earthing up to cover tubers and prevent sunlight exposure.",      type: "prune",     priority: "medium" },
      { day: 65,  task: "Tuber Initiation",  detail: "Reduce irrigation slightly. Do not disturb root zone.",                type: "water",     priority: "medium" },
      { day: 80,  task: "Stop Irrigation",   detail: "Stop irrigation 2-3 weeks before harvest for skin hardening.",         type: "water",     priority: "low"    },
      { day: 95,  task: "Haulm Cutting",     detail: "Cut haulms 10 days before harvest to harden skin.",                   type: "prune",     priority: "medium" },
      { day: 110, task: "Harvest",           detail: "Harvest carefully to avoid bruising. Sort and store at 4-6 degrees C.",type: "harvest",   priority: "high"   },
    ],
  },

  Maize: {
    duration: 110,
    stages: [
      { name: "Germination", upTo: 10  },
      { name: "Seedling",    upTo: 25  },
      { name: "Vegetative",  upTo: 60  },
      { name: "Tasseling",   upTo: 75  },
      { name: "Grain Fill",  upTo: 95  },
      { name: "Maturity",    upTo: 110 },
    ],
    events: [
      { day: 0,   task: "Sowing",           detail: "Sow 20 kg/ha hybrid seed at 5-7 cm depth, 60x20 cm spacing.",     type: "sow",       priority: "high"   },
      { day: 10,  task: "Thinning",          detail: "Thin to one plant per hill. Remove weaker seedlings.",            type: "prune",     priority: "medium" },
      { day: 20,  task: "Nitrogen Split 1",  detail: "Apply 60 kg urea/ha for early vegetative growth.",               type: "fertilize", priority: "high"   },
      { day: 35,  task: "Weed Control",      detail: "Inter-row cultivation + atrazine for broad-spectrum weed control.",type: "pest",     priority: "medium" },
      { day: 45,  task: "Nitrogen Split 2",  detail: "Apply 60 kg urea/ha at knee-high stage.",                        type: "fertilize", priority: "high"   },
      { day: 55,  task: "Irrigation",        detail: "Critical irrigation at tasseling. Moisture stress kills yield.",  type: "water",     priority: "high"   },
      { day: 65,  task: "Pest Watch",        detail: "Monitor for Fall Armyworm. Apply chlorpyrifos if found.",        type: "pest",      priority: "high"   },
      { day: 75,  task: "Silking Irrigation",detail: "Irrigate at silking - most yield-sensitive growth stage.",       type: "water",     priority: "high"   },
      { day: 90,  task: "Grain Fill Check",  detail: "Check kernel dent stage. Monitor for ear rot fungal disease.",   type: "disease",   priority: "medium" },
      { day: 110, task: "Harvest",           detail: "Harvest when husk turns brown. Moisture should be 20-25%.",      type: "harvest",   priority: "high"   },
    ],
  },

  Mustard: {
    duration: 120,
    stages: [
      { name: "Germination", upTo: 8   },
      { name: "Vegetative",  upTo: 35  },
      { name: "Budding",     upTo: 55  },
      { name: "Flowering",   upTo: 75  },
      { name: "Pod Fill",    upTo: 100 },
      { name: "Maturity",    upTo: 120 },
    ],
    events: [
      { day: 0,   task: "Sowing",               detail: "Sow 4-5 kg/ha at 2-3 cm depth in rows 30-45 cm apart.",            type: "sow",       priority: "high"   },
      { day: 12,  task: "Thinning",              detail: "Thin plants to 15 cm within rows at 2-leaf stage.",               type: "prune",     priority: "medium" },
      { day: 20,  task: "Basal Fertilizer",      detail: "Apply sulfur 40 kg/ha - critical for mustard oil content.",       type: "fertilize", priority: "high"   },
      { day: 30,  task: "First Irrigation",      detail: "Irrigate at rosette stage. Avoid standing water.",                type: "water",     priority: "medium" },
      { day: 40,  task: "Aphid Alert",           detail: "Mustard aphids peak in winter. Spray Dimethoate 30 EC if more than 50 per plant.", type: "pest", priority: "high" },
      { day: 55,  task: "Boron Spray",           detail: "Spray 0.2% Borax solution at bud stage for better pod set.",     type: "spray",     priority: "medium" },
      { day: 65,  task: "Flowering Irrigation",  detail: "Critical irrigation at 50% flowering for pod development.",       type: "water",     priority: "high"   },
      { day: 80,  task: "Alternaria Watch",      detail: "Dark spots on leaves indicate Alternaria blight. Spray Mancozeb.",type: "disease",   priority: "high"   },
      { day: 100, task: "Pod Fill Irrigation",   detail: "Last irrigation. Avoid at maturity to prevent shattering.",       type: "water",     priority: "medium" },
      { day: 120, task: "Harvest",               detail: "Harvest when 75% pods turn yellow-brown. Thresh promptly.",       type: "harvest",   priority: "high"   },
    ],
  },

  Cotton: {
    duration: 180,
    stages: [
      { name: "Germination",  upTo: 10  },
      { name: "Seedling",     upTo: 30  },
      { name: "Squaring",     upTo: 65  },
      { name: "Flowering",    upTo: 100 },
      { name: "Boll Setting", upTo: 130 },
      { name: "Boll Opening", upTo: 160 },
      { name: "Harvest",      upTo: 180 },
    ],
    events: [
      { day: 0,   task: "Sowing",               detail: "Sow Bt cotton at 2.5 kg/ha, 75x60 cm spacing. Depth 3-4 cm.",    type: "sow",       priority: "high"   },
      { day: 15,  task: "Gap Filling",           detail: "Fill gaps within 2 weeks using nursery-raised seedlings.",       type: "sow",       priority: "medium" },
      { day: 25,  task: "Basal N Dose",          detail: "Apply 50 kg urea + 100 kg DAP per ha as basal.",                type: "fertilize", priority: "high"   },
      { day: 40,  task: "Irrigation",            detail: "First irrigation at squaring initiation. Use flood or drip.",    type: "water",     priority: "medium" },
      { day: 55,  task: "Top Dress N",           detail: "Split urea application - 50 kg/ha at squaring stage.",          type: "fertilize", priority: "medium" },
      { day: 70,  task: "Whitefly / Thrips",     detail: "Major vectors for leaf curl virus. Spray Imidacloprid 17.8 SL.",type: "pest",      priority: "high"   },
      { day: 85,  task: "Flowering Irrigation",  detail: "Maintain moisture at flowering. Drip preferred.",                type: "water",     priority: "high"   },
      { day: 100, task: "Bollworm Scout",        detail: "Monitor American bollworm. Release Trichogramma cards.",        type: "pest",      priority: "high"   },
      { day: 120, task: "Potassium Spray",       detail: "Spray 1% MOP to improve boll weight and fiber quality.",        type: "spray",     priority: "low"    },
      { day: 150, task: "Defoliation",           detail: "Apply Ethephon to accelerate boll opening if needed.",          type: "spray",     priority: "medium" },
      { day: 180, task: "Final Harvest",         detail: "Harvest fully open bolls. 3-4 pickings over 4-6 weeks.",        type: "harvest",   priority: "high"   },
    ],
  },
};

const getRecommendations = (crop, daysPassed, currentStage) => {
  const recs = [];
  const db = cropDatabase[crop];
  if (!db) return recs;

  const upcoming = db.events.filter(e => e.day > daysPassed && e.day <= daysPassed + 7);
  if (upcoming.length > 0) {
    recs.push({
      text: "Upcoming in the next 7 days: " + upcoming.map(e => e.task).join(", ") + ". Prepare resources in advance.",
      level: "info",
    });
  }

  if (currentStage) {
    const stageName = currentStage.name.toLowerCase();
    if (stageName.includes("flower")) {
      recs.push({
        text: "Flowering stage detected. Avoid pesticide sprays during peak flowering hours (6 AM to 10 AM) to protect pollinators.",
        level: "warning",
      });
    }
    if (stageName.includes("grain") || stageName.includes("bulking")) {
      recs.push({
        text: "Grain or bulking stage: maintain consistent soil moisture. Water stress at this point directly reduces final yield.",
        level: "info",
      });
    }
  }

  if (daysPassed > db.duration - 15 && daysPassed <= db.duration) {
    recs.push({
      text: "Approaching harvest window. Check moisture levels and book harvesting machinery in advance.",
      level: "success",
    });
  }

  if (recs.length === 0) {
    recs.push({
      text: crop + " crop is progressing normally. Follow the scheduled tasks and monitor field conditions daily.",
      level: "info",
    });
  }

  return recs;
};

const getDate = (sowDate, days) => {
  const d = new Date(`${sowDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getDaysPassed = (sowDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sow = new Date(`${sowDate}T00:00:00`);
  return Math.floor((today - sow) / (1000 * 60 * 60 * 24));
};

const getCurrentStage = (stages, daysPassed) => {
  return stages.find(s => daysPassed <= s.upTo) || stages[stages.length - 1];
};

const AlertBanner = ({ text, level }) => {
  const bg     = level === "warning" ? "#FFD93D22" : level === "success" ? "#6BCB7722" : "#4ECDC422";
  const border = level === "warning" ? "#FFD93D"   : level === "success" ? "#6BCB77"   : "#4ECDC4";
  const label  = level === "warning" ? "Note"      : level === "success" ? "Ready"     : "Info";
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: bg, border: `1px solid ${border}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
      <span style={{ color: border, fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>[{label}]</span>
      <p style={{ color: theme.cream, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
};

const ProgressBar = ({ value, color }) => (
  <div style={{ background: `${theme.earth}44`, borderRadius: 999, height: 8, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: "100%", background: color || theme.wheat, borderRadius: 999, transition: "width 0.6s ease" }} />
  </div>
);

const CropCalendar = () => {
  const [crop, setCrop]       = useState("Wheat");
  const [sowDate, setSowDate] = useState("2025-11-01");
  const [filter, setFilter]   = useState("all");

  const db            = cropDatabase[crop] || cropDatabase.Wheat;
  const daysPassed    = getDaysPassed(sowDate);
  const progress      = Math.min(100, Math.max(0, Math.round((daysPassed / db.duration) * 100)));
  const currentStage  = getCurrentStage(db.stages, daysPassed);
  const daysRemaining = Math.max(0, db.duration - daysPassed);
  const cropStarted   = daysPassed >= 0 && daysPassed <= db.duration;
  const cropComplete  = daysPassed > db.duration;

  const filteredEvents = useMemo(() => {
    if (filter === "all") return db.events;
    return db.events.filter(e => e.type === filter);
  }, [db, filter]);

  const todayTasks = useMemo(() =>
    db.events.filter(e => Math.abs(e.day - daysPassed) <= 3 && cropStarted),
    [db, daysPassed, cropStarted]
  );

  const recommendations = useMemo(
    () => getRecommendations(crop, daysPassed, currentStage),
    [crop, daysPassed, currentStage]
  );

  const filterTypes = ["all", "water", "fertilize", "pest", "disease", "harvest", "sow", "spray", "prune"];

  return (
    <div>
      <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 8 }}>
        Crop Calendar
      </h2>
      <p style={{ color: theme.mist, marginBottom: 24, opacity: 0.8, fontSize: 14 }}>
        Dynamic crop management timeline from sowing to harvest
      </p>

      {/* Crop selector + date picker */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.keys(cropDatabase).map(c => (
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

      {/* Progress tracker */}
      <Card style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <p style={{ color: theme.wheat, fontWeight: 700, fontSize: 14, margin: 0 }}>
              {cropComplete
                ? "Harvest Complete"
                : cropStarted
                ? "Stage: " + currentStage.name
                : "Not Started Yet"}
            </p>
            <p style={{ color: theme.mist, fontSize: 12, margin: "4px 0 0" }}>
              {cropStarted && !cropComplete
                ? "Day " + daysPassed + " of " + db.duration
                : cropComplete
                ? "Completed after " + db.duration + " days"
                : "Sowing begins " + getDate(sowDate, 0)}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: theme.wheat, fontWeight: 700, fontSize: 22, margin: 0 }}>{progress}%</p>
            {cropStarted && !cropComplete && (
              <p style={{ color: theme.mist, fontSize: 12, margin: "2px 0 0" }}>{daysRemaining} days to harvest</p>
            )}
          </div>
        </div>
        <ProgressBar value={progress} color={typeColors.harvest || theme.wheat} />

        {/* Stage pills */}
        <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {db.stages.map((s, i) => {
            const passed = daysPassed > s.upTo;
            const active = s.name === currentStage.name;
            return (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: active ? `${theme.wheat}33` : passed ? `${theme.earth}33` : "transparent",
                  border: `1px solid ${active ? theme.wheat : theme.earth}`,
                  color: active ? theme.wheat : theme.mist,
                  fontWeight: active ? 700 : 400,
                }}
              >
                {active ? "Current: " : passed ? "Done - " : ""}{s.name}
              </span>
            );
          })}
        </div>
      </Card>

      {/* Today's tasks */}
      {todayTasks.length > 0 && (
        <Card style={{ padding: 18, marginBottom: 20, border: `1px solid ${theme.wheat}44` }}>
          <p style={{ color: theme.wheat, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
            Tasks Due Now (within 3 days)
          </p>
          {todayTasks.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < todayTasks.length - 1 ? 10 : 0 }}>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: typeColors[e.type],
                background: `${typeColors[e.type]}22`,
                border: `1px solid ${typeColors[e.type]}44`,
                borderRadius: 4,
                padding: "2px 6px",
                flexShrink: 0,
                marginTop: 2,
              }}>
                {typeIcons[e.type]}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <p style={{ color: typeColors[e.type], fontWeight: 700, fontSize: 13, margin: 0 }}>{e.task}</p>
                  <span style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: `${priorityColors[e.priority]}22`,
                    color: priorityColors[e.priority],
                    border: `1px solid ${priorityColors[e.priority]}55`,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    {e.priority}
                  </span>
                </div>
                <p style={{ color: theme.cream, fontSize: 12, margin: 0, opacity: 0.85 }}>{e.detail}</p>
                <p style={{ color: theme.mist, fontSize: 11, margin: "3px 0 0", opacity: 0.6 }}>Day {e.day} - {getDate(sowDate, e.day)}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Recommendations */}
      <Card style={{ padding: 18, marginBottom: 20 }}>
        <p style={{ color: theme.wheat, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Recommendations</p>
        {recommendations.map((r, i) => <AlertBanner key={i} {...r} />)}
      </Card>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: theme.mist, fontSize: 12, opacity: 0.7 }}>Filter:</span>
        {filterTypes.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: `1px solid ${filter === f ? theme.wheat : theme.earth}`,
              background: filter === f ? `${theme.wheat}22` : "transparent",
              color: filter === f ? theme.wheat : theme.mist,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span style={{ marginLeft: "auto", color: theme.mist, fontSize: 12, opacity: 0.6 }}>
          {filteredEvents.length} task{filteredEvents.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 20, top: 20, bottom: 20, width: 2, background: `${theme.earth}44` }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {filteredEvents.map((e, i) => {
            const isPast = daysPassed > e.day;
            const isNow  = Math.abs(e.day - daysPassed) <= 3 && cropStarted;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  paddingLeft: 44,
                  paddingBottom: 20,
                  position: "relative",
                  opacity: isPast && !cropComplete ? 0.55 : 1,
                  transition: "opacity 0.2s",
                }}
              >
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
                  boxShadow: isNow ? `0 0 0 3px ${typeColors[e.type]}55` : "none",
                }} />
                <Card style={{
                  flex: 1,
                  padding: 16,
                  border: isNow ? `1px solid ${typeColors[e.type]}66` : undefined,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <p style={{ color: typeColors[e.type], fontWeight: 700, fontSize: 14, margin: 0 }}>{e.task}</p>
                      <span style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: `${priorityColors[e.priority]}22`,
                        color: priorityColors[e.priority],
                        border: `1px solid ${priorityColors[e.priority]}44`,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}>
                        {e.priority}
                      </span>
                      {isPast && !cropComplete && (
                        <span style={{ fontSize: 10, color: theme.mist, opacity: 0.6 }}>done</span>
                      )}
                      {isNow && (
                        <span style={{
                          fontSize: 10,
                          color: typeColors[e.type],
                          fontWeight: 700,
                          background: `${typeColors[e.type]}22`,
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}>
                          due now
                        </span>
                      )}
                    </div>
                    <span style={{ color: theme.mist, fontSize: 12, whiteSpace: "nowrap", marginLeft: 8 }}>
                      {getDate(sowDate, e.day)} - Day {e.day}
                    </span>
                  </div>
                  <p style={{ color: theme.cream, fontSize: 13, opacity: 0.85, margin: 0 }}>{e.detail}</p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <Card style={{ padding: 24, textAlign: "center" }}>
          <p style={{ color: theme.mist, fontSize: 14, opacity: 0.7 }}>No tasks match the selected filter.</p>
        </Card>
      )}
    </div>
  );
};

export default CropCalendar;