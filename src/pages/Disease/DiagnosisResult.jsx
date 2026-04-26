// src/pages/Disease/DiagnosisResult.jsx
import React from 'react';
import './DiagnosisResult.css';

/* ── tiny sub-components ──────────────────────────────────── */

const ConfidenceBar = ({ label, confidence, isPrimary }) => (
  <div className={`dr-bar-row ${isPrimary ? 'dr-bar-primary' : ''}`}>
    <span className="dr-bar-label">{label}</span>
    <div className="dr-bar-track">
      <div
        className="dr-bar-fill"
        style={{ width: `${confidence}%` }}
      />
    </div>
    <span className="dr-bar-pct">{Math.round(confidence)}%</span>
  </div>
);

const SeverityBadge = ({ severity }) => (
  <span className={`dr-severity dr-severity-${severity.toLowerCase()}`}>{severity}</span>
);

/* ── helpers ──────────────────────────────────────────────── */

/**
 * Parse a markdown blob into structured sections so we can render
 * Description / Symptoms / Treatment / Prevention / etc. exactly like HuggingFace.
 */
const parseSections = (markdown = '') => {
  const sections = [];
  // Split on markdown headings (## or ###)
  const parts = markdown.split(/\n(?=#{1,3}\s)/);
  for (const part of parts) {
    const lines   = part.trim().split('\n');
    const heading = lines[0].replace(/^#+\s*/, '').trim();
    const body    = lines.slice(1).join('\n').trim();
    if (heading && body) sections.push({ heading, body });
  }
  return sections;
};

/**
 * Render a section body: strip markdown bold, convert bullet lines to <li>.
 */
const SectionBody = ({ body }) => {
  const lines = body.split('\n').map(l => l.replace(/\*\*/g, '').trim()).filter(Boolean);
  const bullets = lines.filter(l => /^[-*•]/.test(l));
  const prose   = lines.filter(l => !/^[-*•]/.test(l));

  return (
    <div className="dr-section-body">
      {prose.map((p, i) => <p key={i}>{p}</p>)}
      {bullets.length > 0 && (
        <ul>
          {bullets.map((b, i) => <li key={i}>{b.replace(/^[-*•]\s*/, '')}</li>)}
        </ul>
      )}
    </div>
  );
};

/* ── main component ───────────────────────────────────────── */

const DiagnosisResult = ({ result }) => {
  const {
    cropName,
    diseaseName,
    confidence,
    severity,
    isHealthy,
    treatmentText,
    fullMarkdown,
    alternatives = [],
    distribution = [],
  } = result;

  const displayName = `${cropName} ${diseaseName}`.trim();
  const sections    = parseSections(fullMarkdown || '');

  // Fallback sections if markdown parsing yields nothing
  const hasMarkdownSections = sections.length > 1;

  return (
    <div className="dr-root">

      {/* ── Primary diagnosis card ───────────────────────── */}
      <div className={`dr-card dr-card-primary ${isHealthy ? 'dr-healthy' : ''}`}>
        <h2 className="dr-disease-title">{displayName}</h2>

        <div className="dr-meta">
          <span><strong>Plant:</strong> {cropName}</span>
          <span>
            <strong>Severity:</strong>{' '}
            <SeverityBadge severity={severity} />
          </span>
          <span>
            <strong>Confidence:</strong>{' '}
            <span className="dr-conf-pct">{confidence.toFixed(1)}%</span>
          </span>
        </div>

        {/* Render parsed markdown sections (Description, Symptoms, Treatment, Prevention…) */}
        {hasMarkdownSections ? (
          <div className="dr-sections">
            {sections.map((s, i) => (
              <div key={i} className="dr-section">
                <h4 className="dr-section-heading">{s.heading}</h4>
                <SectionBody body={s.body} />
              </div>
            ))}
          </div>
        ) : (
          /* Fallback: plain treatment text */
          treatmentText && (
            <div className="dr-sections">
              <div className="dr-section">
                <h4 className="dr-section-heading">Treatment</h4>
                <SectionBody body={treatmentText} />
              </div>
            </div>
          )
        )}
      </div>

      {/* ── Alternative Possibilities ────────────────────── */}
      {alternatives.length > 0 && (
        <div className="dr-card">
          <h3 className="dr-sub-title">Alternative Possibilities</h3>
          <div className="dr-alternatives">
            {alternatives.map((alt, i) => (
              <div key={i} className="dr-alt-item">
                <div className="dr-alt-header">
                  <span className="dr-alt-rank">{i + 1}.</span>
                  <span className="dr-alt-name">{alt.displayName}</span>
                </div>
                <ul className="dr-alt-meta">
                  <li>Confidence: {alt.confidence.toFixed(2)}%</li>
                  <li>Severity: <SeverityBadge severity={alt.confidence >= 70 ? 'MODERATE' : 'LOW'} /></li>
                  <li>Plant: {alt.crop}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Confidence Distribution chart ────────────────── */}
      {distribution.length > 0 && (
        <div className="dr-card dr-chart-card">
          <div className="dr-chart-header">
            <span className="dr-chart-icon">📊</span>
            <span className="dr-chart-title">Confidence Distribution</span>
          </div>
          <h3 className="dr-chart-disease">{displayName}</h3>
          <div className="dr-bars">
            {distribution.map((d, i) => (
              <ConfidenceBar
                key={i}
                label={d.label}
                confidence={d.confidence}
                isPrimary={i === 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisResult;