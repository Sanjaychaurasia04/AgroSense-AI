// src/pages/Disease/DiagnosisResult.jsx
import React from 'react';

const DiagnosisResult = ({ result }) => {
  if (!result) return null;

  const getSeverityColor = (severity) => {
    const colors = {
      high: '#ff4444',
      moderate: '#ffa500',
      low: '#ffd966',
      none: '#4caf50'
    };
    return colors[severity] || '#95a5a6';
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      high: '⚠️ High Risk',
      moderate: '🟡 Moderate Risk',
      low: '🟢 Low Risk',
      none: '✅ Healthy'
    };
    return labels[severity] || severity;
  };

  return (
    <div className="results-container">
      {/* Main Result Card */}
      <div className="result-card main-result">
        <div className="result-header">
          <div className="result-title">
            <div className="title-badge">DETECTED CONDITION</div>
            <h2 className="disease-name">{result.disease}</h2>
          </div>
          {result.severity && (
            <div 
              className="severity-badge"
              style={{ backgroundColor: getSeverityColor(result.severity) }}
            >
              {getSeverityLabel(result.severity)}
            </div>
          )}
        </div>

        {/* Confidence Bar */}
        <div className="confidence-section">
          <div className="confidence-header">
            <span>AI Confidence Score</span>
            <span className="confidence-value">{(result.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ 
                width: `${result.confidence * 100}%`,
                background: `linear-gradient(90deg, #6b8c42, ${getSeverityColor(result.severity)})`
              }}
            />
          </div>
        </div>

        {/* Treatment Solution */}
        <div className="treatment-section">
          <div className="section-header">
            <span className="section-icon">💊</span>
            <h3>Recommended Treatment</h3>
          </div>
          <p className="treatment-text">{result.solution}</p>
        </div>
      </div>

      {/* Alternatives Section */}
      {result.alternatives && result.alternatives.length > 0 && (
        <div className="result-card alternatives-card">
          <div className="section-header">
            <span className="section-icon">🔄</span>
            <h3>Other Possible Conditions</h3>
          </div>
          <div className="alternatives-list">
            {result.alternatives.map((alt, idx) => (
              <div key={idx} className="alternative-item">
                <span className="alt-name">{alt.name}</span>
                <span className="alt-confidence">{(alt.confidence * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer-card">
        <div className="disclaimer-icon">ℹ️</div>
        <div className="disclaimer-text">
          <strong>Important Note:</strong> This is an AI-powered diagnosis tool for educational purposes. 
          For critical decisions, please consult with local agricultural experts or plant pathologists.
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;