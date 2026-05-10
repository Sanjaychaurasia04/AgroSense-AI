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

// SVG crop icons — no emojis, clean vector marks
const CropIcon = ({ crop }) => {
  const icons = {
    Rice: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="crop-svg-icon">
        <path d="M10 2 C10 2 7 6 7 10 C7 14 10 18 10 18 C10 18 13 14 13 10 C13 6 10 2 10 2Z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.4"/>
        <line x1="8.2" y1="7" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="11.8" y1="7" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="7.5" y1="10" x2="10" y2="8.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="12.5" y1="10" x2="10" y2="8.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    Wheat: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="crop-svg-icon">
        <line x1="10" y1="18" x2="10" y2="3" stroke="currentColor" strokeWidth="1.4"/>
        <ellipse cx="10" cy="5" rx="2.5" ry="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <ellipse cx="7" cy="8" rx="2.5" ry="1.5" transform="rotate(-30 7 8)" stroke="currentColor" strokeWidth="1.2"/>
        <ellipse cx="13" cy="8" rx="2.5" ry="1.5" transform="rotate(30 13 8)" stroke="currentColor" strokeWidth="1.2"/>
        <ellipse cx="7.5" cy="11.5" rx="2.5" ry="1.5" transform="rotate(-30 7.5 11.5)" stroke="currentColor" strokeWidth="1.2"/>
        <ellipse cx="12.5" cy="11.5" rx="2.5" ry="1.5" transform="rotate(30 12.5 11.5)" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    Tomato: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="crop-svg-icon">
        <circle cx="10" cy="12" r="6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M10 6 C10 6 10 3 10 2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 4 C8 4 6.5 2.5 6 2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M12 4 C12 4 13.5 2.5 14 2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 4.5 C7 4.5 8 5.5 10 6" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M13 4.5 C13 4.5 12 5.5 10 6" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    Cotton: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="crop-svg-icon">
        <line x1="10" y1="18" x2="10" y2="8" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="10" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="6"  cy="9" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="14" cy="9" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="6"  y1="7.2" x2="8" y2="6.5" stroke="currentColor" strokeWidth="1"/>
        <line x1="14" y1="7.2" x2="12" y2="6.5" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    Maize: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="crop-svg-icon">
        <rect x="7.5" y="5" width="5" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="10" y1="5" x2="10" y2="15" stroke="currentColor" strokeWidth="1"/>
        <line x1="7.5" y1="8"  x2="12.5" y2="8"  stroke="currentColor" strokeWidth="0.9"/>
        <line x1="7.5" y1="10" x2="12.5" y2="10" stroke="currentColor" strokeWidth="0.9"/>
        <line x1="7.5" y1="12" x2="12.5" y2="12" stroke="currentColor" strokeWidth="0.9"/>
        <path d="M10 5 C10 5 12 3 13 2" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="10" y1="15" x2="10" y2="18" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    Sugarcane: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="crop-svg-icon">
        <path d="M9 18 C9 18 9.5 12 10 8 C10.5 4 11 2 11 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M10 10 C10 10 13 9 14 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M9.5 13 C9.5 13 6.5 12 5.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M10 7 C10 7 13 6 14 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M9 15.5 C9 15.5 6 14.5 5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    Potato: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="crop-svg-icon">
        <ellipse cx="10" cy="12" rx="6" ry="4.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="7.5" cy="10.5" r="0.7" fill="currentColor"/>
        <circle cx="12" cy="11"   r="0.7" fill="currentColor"/>
        <circle cx="9.5" cy="13.5" r="0.7" fill="currentColor"/>
        <path d="M10 7.5 C10 7.5 9 5 8.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M10 7.5 C10 7.5 11.5 6 12.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  };
  return icons[crop] || (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="crop-svg-icon">
      <path d="M10 18 C10 18 10 10 10 8 C10 4 7 2 7 2 C7 2 9 5 10 8 C11 5 13 2 13 2 C13 2 10 4 10 8" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
};

// pH status indicator — colored dot + label, no emoji
const PhStatusDot = ({ status }) => (
  <span className={`ph-status-dot ${status}`} aria-hidden="true" />
);

const Fertilizer = () => {
  const [ph, setPh]           = useState(6.5);
  const [crop, setCrop]       = useState("Rice");
  const [disease, setDisease] = useState("");
  const [showResults, setShowResults] = useState(false);

  const soilInfo  = useMemo(() => getSoilType(ph),       [ph]);
  const fertInfo  = useMemo(() => getFertilizerInfo(ph),  [ph]);
  const npkValues = useMemo(() => cropNPK[crop],          [crop]);
  const severity  = useMemo(() => getSeverityLevel(ph),   [ph]);

  const diseaseInfo = useMemo(() => {
    if (!disease.trim()) return null;
    return {
      adjustment: `Increase Potassium (K) application by 20-30% to boost immunity`,
      foliar:     "Potassium silicate foliar spray (2-3 ml/L water) every 10-14 days",
      organic:    "Neem cake application (200-300 kg/ha) for disease suppression",
      notes:      `${disease} thrives in ${soilInfo.status} soil conditions. Maintain proper spacing for air circulation.`,
    };
  }, [disease, soilInfo.status]);

  const handlePhChange           = (e) => setPh(parseFloat(e.target.value));
  const handleGetRecommendation  = () => setShowResults(true);
  const handleClear              = () => { setShowResults(false); setDisease(""); };

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
              <PhStatusDot status={soilInfo.status} />
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
                  <CropIcon crop={c} />
                  {c}
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
                      <li><Icon name="arrow"  size={12} /> {diseaseInfo.adjustment}</li>
                      <li><Icon name="spray"  size={12} /> {diseaseInfo.foliar}</li>
                      <li><Icon name="leaf"   size={12} /> {diseaseInfo.organic}</li>
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