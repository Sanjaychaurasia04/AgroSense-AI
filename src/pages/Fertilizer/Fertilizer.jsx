// src/pages/Fertilizer/Fertilizer.jsx
import React, { useState, useCallback, useMemo } from 'react';
import Card from '../../components/common/Card';
import Btn from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Icon from '../../components/common/Icon';
import { theme } from '../../styles/theme';
import './Fertilizer.css';

const cropNPK = {
  Rice:      { N: 120, P: 60,  K: 60,  unit: "kg/ha" },
  Wheat:     { N: 150, P: 60,  K: 40,  unit: "kg/ha" },
  Tomato:    { N: 180, P: 60,  K: 120, unit: "kg/ha" },
  Cotton:    { N: 120, P: 60,  K: 60,  unit: "kg/ha" },
  Maize:     { N: 180, P: 80,  K: 60,  unit: "kg/ha" },
  Sugarcane: { N: 250, P: 80,  K: 120, unit: "kg/ha" },
  Potato:    { N: 200, P: 100, K: 200, unit: "kg/ha" },
};

const crops = ["Rice", "Wheat", "Tomato", "Cotton", "Maize", "Sugarcane", "Potato"];

const getSoilType = (pH) => {
  if (pH < 5.5) return { type: "Acidic Soil",        status: "acidic",   color: theme.alert  };
  if (pH > 7.5) return { type: "Alkaline Soil",       status: "alkaline", color: theme.wheat  };
  return             { type: "Neutral/Ideal Soil",    status: "neutral",  color: theme.sprout };
};

const getFertilizerInfo = (pH) => {
  if (pH < 5.5) return {
    chemical: "Agricultural Lime (CaCO₃)",
    organic:  "Wood ash, Dolomite",
    notes:    "Apply lime 2-3 weeks before sowing. Avoid ammonium sulfate fertilizers. Test soil after 3 months.",
    applicationRate: "2-3 tons/ha for moderate acidity",
  };
  if (pH > 7.5) return {
    chemical: "Elemental Sulfur, Ammonium Sulfate",
    organic:  "Peat moss, Pine needle mulch, Compost",
    notes:    "Incorporate sulfur 6 months before planting. Add organic matter regularly. Use acid-forming fertilizers.",
    applicationRate: "300-500 kg/ha of sulfur for initial treatment",
  };
  return {
    chemical: "Balanced NPK (20-20-20)",
    organic:  "Well-composted farmyard manure, Vermicompost",
    notes:    "Ideal pH range. Focus on balanced nutrition based on crop stage. Maintain organic matter.",
    applicationRate: "As per crop requirement",
  };
};

const getSeverityLevel = (pH) => {
  if (pH < 4.5 || pH > 9)   return 'critical';
  if (pH < 5.0 || pH > 8.5) return 'high';
  if (pH < 5.5 || pH > 7.5) return 'moderate';
  return 'optimal';
};

const getCropIcon = (crop) => {
  const icons = { Rice:"🌾", Wheat:"🌾", Tomato:"🍅", Cotton:"🌿", Maize:"🌽", Sugarcane:"🎋", Potato:"🥔" };
  return icons[crop] || "🌱";
};

const Fertilizer = () => {
  const [ph, setPh]       = useState(6.5);
  const [crop, setCrop]   = useState("Rice");
  const [disease, setDisease] = useState("");
  const [showResults, setShowResults] = useState(false);

  // ── Derived values — computed synchronously, no useEffect needed ──
  const soilInfo    = useMemo(() => getSoilType(ph),      [ph]);
  const fertInfo    = useMemo(() => getFertilizerInfo(ph), [ph]);
  const npkValues   = useMemo(() => cropNPK[crop],         [crop]);
  const severity    = useMemo(() => getSeverityLevel(ph),  [ph]);

  const diseaseInfo = useMemo(() => {
    if (!disease.trim()) return null;
    return {
      adjustment: `Increase Potassium (K) application by 20-30% to boost immunity`,
      foliar:     "Potassium silicate foliar spray (2-3 ml/L water) every 10-14 days",
      organic:    "Neem cake application (200-300 kg/ha) for disease suppression",
      notes:      `${disease} thrives in ${soilInfo.status} soil conditions. Maintain proper spacing for air circulation.`,
    };
  }, [disease, soilInfo.status]);

  const phStatusIcon = soilInfo.status === 'acidic' ? '⚠️' : soilInfo.status === 'alkaline' ? '⚡' : '✅';

  // ── Handlers ──────────────────────────────────────────────────────
  // Slider just updates ph — results re-compute automatically via useMemo
  const handlePhChange = (e) => setPh(parseFloat(e.target.value));

  // "Get Recommendation" button shows the result panel
  const handleGetRecommendation = () => setShowResults(true);

  const handleClear = () => {
    setShowResults(false);
    setDisease("");
  };

  return (
    <div className="fertilizer-container">
      <div className="fertilizer-header">
        <h2 className="fertilizer-title">Fertilizer Recommendation</h2>
        <p className="fertilizer-subtitle">
          pH-based soil analysis with crop-specific fertilizer guidance
        </p>
      </div>

      <div className="fertilizer-grid">
        {/* ── Input Form ── */}
        <Card className="input-card">

          {/* pH Slider */}
          <div className="ph-section">
            <label className="input-label">
              <Icon name="droplet" size={14} color={theme.sage} />
              SOIL pH LEVEL
            </label>
            <div className="ph-value-container">
              <span className={`ph-value ${soilInfo.status}`}>{ph.toFixed(1)}</span>
              <span className="ph-status">{soilInfo.type.split(' ')[0]}</span>
              <span className="ph-icon">{phStatusIcon}</span>
            </div>
            <input
              type="range" min="3" max="10" step="0.1" value={ph}
              onChange={handlePhChange}
              className="ph-slider"
              aria-label="Soil pH level slider"
            />
            <div className="ph-scale">
              <span>Acidic (3)</span>
              <span>Neutral (7)</span>
              <span>Alkaline (10)</span>
            </div>
            {severity === 'critical' && (
              <div className="warning-message">
                <Icon name="alert" size={12} />
                Critical pH level! Immediate amendment required.
              </div>
            )}
          </div>

          {/* Crop Selection */}
          <div className="input-group">
            <label className="input-label">
              <Icon name="seedling" size={14} color={theme.sage} />
              CROP TYPE
            </label>
            <div className="crop-buttons">
              {crops.map(c => (
                <button
                  key={c}
                  onClick={() => setCrop(c)}
                  className={`crop-btn ${crop === c ? 'active' : ''}`}
                >
                  {getCropIcon(c)} {c}
                </button>
              ))}
            </div>
          </div>

          {/* Disease Input */}
          <div className="input-group">
            <label className="input-label">
              <Icon name="bug" size={14} color={theme.sage} />
              DISEASE (if detected)
            </label>
            <input
              value={disease}
              onChange={e => setDisease(e.target.value)}
              placeholder="e.g., Late Blight, Leaf Rust, Powdery Mildew..."
              className="disease-input"
            />
            {disease && (
              <div className="input-hint">
                <Icon name="info" size={12} />
                Disease-specific recommendations will be included
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="action-buttons">
            <Btn icon="flask" onClick={handleGetRecommendation}>
              Get Recommendation
            </Btn>
            {showResults && (
              <button onClick={handleClear} className="clear-btn" aria-label="Clear">
                <Icon name="refresh" size={14} /> Clear
              </button>
            )}
          </div>
        </Card>

        {/* ── Results ── */}
        <div className="results-section">
          {!showResults ? (
            <Card className="empty-state">
              <div className="empty-icon">
                <Icon name="flask" size={48} color={theme.clay} />
              </div>
              <p className="empty-text">
                Adjust pH and select crop<br />to get fertilizer recommendations
              </p>
              <div className="empty-hint">
                <Icon name="arrow" size={12} />
                Start by adjusting the pH slider
              </div>
            </Card>
          ) : (
            <>
              {/* Soil Type */}
              <Card className={`result-card soil-card ${soilInfo.status}`}>
                <Badge className={`soil-badge ${soilInfo.status}`}>{soilInfo.type}</Badge>
                <h3 className="result-title">{crop} Recommendations</h3>
                <p className="result-npk">N:P:K = {npkValues.N}:{npkValues.P}:{npkValues.K} {npkValues.unit}</p>
                {severity === 'critical' && (
                  <div className="severity-badge critical">
                    <Icon name="alert" size={12} /> Critical Condition
                  </div>
                )}
              </Card>

              {/* NPK Breakdown */}
              <Card className="info-card npk-card">
                <div className="info-header">
                  <Icon name="chart" size={16} color={theme.wheat} />
                  <span className="info-label">NPK REQUIREMENT</span>
                </div>
                <div className="npk-breakdown">
                  {[
                    { label: "Nitrogen (N)",   value: npkValues.N, cls: "nitrogen"   },
                    { label: "Phosphorus (P)", value: npkValues.P, cls: "phosphorus" },
                    { label: "Potassium (K)",  value: npkValues.K, cls: "potassium"  },
                  ].map(({ label, value, cls }) => (
                    <div key={cls} className="npk-item">
                      <span className="npk-label">{label}</span>
                      <span className="npk-value">{value} kg/ha</span>
                      <div className="npk-bar">
                        <div className={`npk-fill ${cls}`} style={{ width: `${(value / 300) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Chemical Fertilizers */}
              <Card className="info-card" style={{ borderLeft: `3px solid ${theme.wheat}` }}>
                <div className="info-header">
                  <Icon name="flask" size={16} color={theme.wheat} />
                  <span className="info-label" style={{ color: theme.wheat }}>CHEMICAL FERTILIZERS</span>
                </div>
                <p className="info-value">{fertInfo.chemical}</p>
                <div className="application-rate">
                  <Icon name="timer" size={12} /> {fertInfo.applicationRate}
                </div>
              </Card>

              {/* Organic Alternatives */}
              <Card className="info-card" style={{ borderLeft: `3px solid ${theme.sprout}` }}>
                <div className="info-header">
                  <Icon name="leaf" size={16} color={theme.sprout} />
                  <span className="info-label" style={{ color: theme.sprout }}>ORGANIC ALTERNATIVES</span>
                </div>
                <p className="info-value">{fertInfo.organic}</p>
              </Card>

              {/* Application Notes */}
              <Card className="info-card" style={{ borderLeft: `3px solid ${theme.rain}` }}>
                <div className="info-header">
                  <Icon name="check" size={16} color={theme.rain} />
                  <span className="info-label" style={{ color: theme.rain }}>APPLICATION NOTES</span>
                </div>
                <p className="info-value">{fertInfo.notes}</p>
              </Card>

              {/* Disease-Specific */}
              {diseaseInfo && (
                <Card className="disease-card">
                  <div className="info-header">
                    <Icon name="bug" size={16} color={theme.alert} />
                    <span className="info-label" style={{ color: theme.alert }}>DISEASE-SPECIFIC ADJUSTMENT</span>
                  </div>
                  <div className="disease-content">
                    <p className="disease-text">
                      Since your crop shows <strong>{disease}</strong> symptoms with{' '}
                      <strong>{soilInfo.type.toLowerCase()}</strong> (pH {ph.toFixed(1)}):
                    </p>
                    <ul className="disease-list">
                      <li><Icon name="arrow" size={12} /> {diseaseInfo.adjustment}</li>
                      <li><Icon name="spray" size={12} /> {diseaseInfo.foliar}</li>
                      <li><Icon name="leaf"  size={12} /> {diseaseInfo.organic}</li>
                    </ul>
                    <div className="disease-note">
                      <Icon name="info" size={12} /> {diseaseInfo.notes}
                    </div>
                  </div>
                </Card>
              )}

              {/* Seasonal Tips */}
              <Card className="tips-card">
                <div className="info-header">
                  <Icon name="calendar" size={16} color={theme.sprout} />
                  <span className="info-label">SEASONAL TIPS</span>
                </div>
                <div className="tips-content">
                  <div className="tip-item"><Icon name="sun"   size={14} /><span>Apply fertilizers during early morning or late evening</span></div>
                  <div className="tip-item"><Icon name="water" size={14} /><span>Irrigate immediately after fertilizer application</span></div>
                  <div className="tip-item"><Icon name="test"  size={14} /><span>Test soil every 3-6 months for optimal results</span></div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fertilizer;