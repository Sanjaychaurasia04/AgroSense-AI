// src/pages/Disease/DiseaseDetection.jsx
import React, { useState, useRef } from 'react';
import { Client } from "@gradio/client";
import { saveDetection } from '../../utils/db';
import DiagnosisResult from './DiagnosisResult';
import './DiseaseDetection.css';

const DiseaseDetection = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl]     = useState(null);
  const [fileName, setFileName]         = useState('');
  const [loading, setLoading]           = useState(false);
  const [results, setResults]           = useState(null);
  const [error, setError]               = useState(null);
  const [dragOver, setDragOver]         = useState(false);

  const fileInputRef = useRef(null);
  const resultsRef   = useRef(null);

  /* ─── helpers ─────────────────────────────────────────── */

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP)');
      return;
    }
    setSelectedFile(file);
    setFileName(file.name);
    setError(null);
    setResults(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = ()  => setDragOver(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
    else setError('Please drop a valid image file');
  };

  const formatDiseaseName = (raw = '') =>
    raw.split(/[_\s]+/)
       .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
       .join(' ');

  /**
   * Parse the markdown string the Gradio API returns.
   * Returns: { cropName, diseaseName, diseaseLabel, treatmentText, fullMarkdown }
   */
  const parseMarkdownDiagnosis = (markdown = '') => {
    // Heading → full display name  e.g. "## Tomato Septoria Leaf Spot"
    const headingMatch = markdown.match(/^#+\s+(.+)/m);
    const fullName     = headingMatch ? headingMatch[1].trim() : 'Unknown Disease';

    // Plant field
    const plantMatch = markdown.match(/\*\*Plant[^*]*\*\*[:\s]+([^\n*]+)/i);
    const cropName   = plantMatch ? plantMatch[1].trim() : 'Unknown';

    // diseaseName = fullName minus the crop prefix
    const diseaseName = fullName
      .replace(new RegExp('^' + cropName + '[\\s_]*', 'i'), '')
      .trim() || fullName;

    // diseaseLabel for DB  e.g. "Tomato___Septoria_Leaf_Spot"
    const diseaseLabel = `${cropName}___${diseaseName.replace(/\s+/g, '_')}`;

    // Treatment block
    const treatmentMatch = markdown.match(
      /(?:Recommended Actions|Management|Treatment)[^\n]*\n([\s\S]*?)(?:\n#{1,3}|$)/i
    );
    let treatmentText = treatmentMatch
      ? treatmentMatch[1].replace(/\*\*/g, '').replace(/^[-*]\s+/gm, '').trim()
      : '';
    if (!treatmentText) {
      treatmentText = markdown
        .replace(/^#+.*/gm, '')
        .replace(/\*\*/g, '')
        .replace(/^[-*]\s+/gm, '')
        .trim()
        .slice(0, 500);
    }

    return { cropName, diseaseName, diseaseLabel, treatmentText, fullMarkdown: markdown };
  };

  /**
   * Build the rich "alternatives" array the HuggingFace UI shows.
   * The second element of result.data is an object like:
   *   { "Tomato___Septoria_leaf_spot": 63.6, "Strawberry___Leaf_scorch": 16.18, … }
   */
  const buildAlternatives = (altObj = {}) =>
    Object.entries(altObj)
      .filter(([, v]) => typeof v === 'number' && isFinite(v))
      .sort(([, a], [, b]) => b - a)
      .map(([label, pct]) => {
        const parts      = label.split('___');
        const crop       = formatDiseaseName(parts[0] || '');
        const disease    = formatDiseaseName(parts[1] || '');
        const confidence = parseFloat((pct > 1 ? pct : pct * 100).toFixed(2));
        return { label, crop, disease, displayName: `${crop} ${disease}`.trim(), confidence };
      });

  /**
   * Extract primary confidence from whatever shape the 3rd API field returns.
   * Returns a value in 0-100 range.
   */
  const extractConfidence100 = (raw) => {
    if (typeof raw === 'number' && isFinite(raw))
      return raw > 1 ? raw : raw * 100;

    if (raw && typeof raw === 'object') {
      const vals = [];
      const walk = (o) => {
        for (const v of Object.values(o)) {
          if (typeof v === 'number' && isFinite(v)) vals.push(v);
          else if (v && typeof v === 'object') walk(v);
        }
      };
      walk(raw);
      if (vals.length) {
        const max = Math.max(...vals);
        return max > 1 ? max : max * 100;
      }
    }
    return 0;
  };

  const getSeverity = (conf100) => {
    if (conf100 >= 85) return 'HIGH';
    if (conf100 >= 70) return 'MODERATE';
    if (conf100 >= 50) return 'LOW';
    return 'NONE';
  };

  /* ─── main analyse ────────────────────────────────────── */

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const client = await Client.connect('sanjaychaurasia1/krishimitra-ai', {
        hf_token: import.meta.env.VITE_HF_TOKEN,
      });

      const response = await client.predict('/predict', { image: selectedFile });
      console.log('API Response:', response.data);

      // API returns [diagnosisMarkdown, alternativesObj, confidenceData]
      const [diagnosisMarkdown, alternativesObj, confidenceRaw] = response.data;

      const { cropName, diseaseName, diseaseLabel, treatmentText, fullMarkdown }
        = parseMarkdownDiagnosis(typeof diagnosisMarkdown === 'string' ? diagnosisMarkdown : '');

      const alternatives  = buildAlternatives(
        alternativesObj && typeof alternativesObj === 'object' && !Array.isArray(alternativesObj)
          ? alternativesObj : {}
      );

      // Primary confidence: prefer the top alternative entry which matches our label
      const topAlt        = alternatives.find(a => a.label === diseaseLabel) || alternatives[0];
      let confidence100   = topAlt ? topAlt.confidence : extractConfidence100(confidenceRaw);
      if (!isFinite(confidence100)) confidence100 = 0;

      const severity      = getSeverity(confidence100);
      const isHealthy     = diseaseName.toLowerCase().includes('healthy');

      // Full confidence distribution for chart
      const distribution  = alternatives.map(a => ({
        label:      a.displayName,
        confidence: a.confidence,
      }));

      setResults({
        cropName,
        diseaseName,
        diseaseLabel,
        confidence:   confidence100,
        severity,
        isHealthy,
        treatmentText,
        fullMarkdown,
        alternatives: alternatives.slice(1, 4), // top 3 excluding primary
        distribution,                            // all for bar chart
      });

      /* ── Save to DB ──────────────────────────────────────
         Schema: diseaseLabel, diseaseName, cropName,
                 confidence (0-100), isHealthy, treatmentAdvice, imageUrl
      */
      if (user?.sub) {
        try {
          await saveDetection(user.sub, {
            diseaseLabel,
            diseaseName,
            cropName,
            confidence:      parseFloat(confidence100.toFixed(2)),
            isHealthy,
            treatmentAdvice: treatmentText || 'Regular monitoring and proper plant care recommended',
            imageUrl:        '',
          });
          console.log('✅ Saved to DB:', diseaseLabel, confidence100.toFixed(2) + '%');
        } catch (dbErr) {
          console.error('⚠️ DB save failed:', dbErr.message);
        }
      } else {
        console.warn('⚠️ No user logged in — detection not saved');
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null); setPreviewUrl(null); setFileName('');
    setResults(null); setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ─── render ──────────────────────────────────────────── */

  return (
    <div className="dd-page">
      {/* Header */}
      <header className="dd-header">
        <div className="dd-header-inner">
          <div className="dd-logo">
            <span className="dd-logo-icon">🌾</span>
            <div>
              <h1>KrishiMitra AI</h1>
              <span>Plant Disease Detection</span>
            </div>
          </div>
          <div className="dd-badge">
            <span className="dd-badge-dot" />
            ResNet50 · 38 Classes
          </div>
        </div>
      </header>

      <main className="dd-main">
        {/* Two-column layout like HuggingFace */}
        <div className="dd-split">

          {/* LEFT — upload */}
          <div className="dd-left">
            <div className="dd-upload-label">Upload Plant Leaf Image</div>

            {/* Drop zone */}
            <div
              className={`dd-dropzone ${dragOver ? 'drag-over' : ''} ${previewUrl ? 'has-preview' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !previewUrl && fileInputRef.current.click()}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="dd-preview-img" />
                  <div className="dd-preview-toolbar">
                    <button className="dd-tool-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} title="Replace">📤</button>
                    <button className="dd-tool-btn" onClick={(e) => { e.stopPropagation(); clearImage(); }} title="Remove">🗑️</button>
                  </div>
                </>
              ) : (
                <div className="dd-dropzone-placeholder">
                  <div className="dd-upload-icon">📁</div>
                  <p>Drop Image Here</p>
                  <span>— or —</span>
                  <button className="dd-browse-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
                    Click to Upload
                  </button>
                  <small>JPG, PNG, WEBP · Max 10 MB</small>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {/* Detect button */}
            <button
              className={`dd-detect-btn ${loading ? 'dd-loading' : ''}`}
              onClick={analyzeImage}
              disabled={!selectedFile || loading}
            >
              {loading ? (
                <><span className="dd-spinner" /> Analyzing…</>
              ) : (
                'Detect Disease'
              )}
            </button>

            {/* Tips */}
            <div className="dd-tips">
              <strong>Tips for Best Results:</strong>
              <ul>
                <li>Take a clear photo of the affected leaf</li>
                <li>Ensure good lighting</li>
                <li>Focus on the diseased area</li>
                <li>Include both healthy and infected tissue</li>
              </ul>
            </div>
          </div>

          {/* RIGHT — results */}
          <div className="dd-right" ref={resultsRef}>
            {error && (
              <div className="dd-error">
                <span>⚠️</span>
                <div>
                  <strong>Analysis Failed</strong>
                  <p>{error}</p>
                  <button onClick={() => setError(null)}>Dismiss</button>
                </div>
              </div>
            )}

            {loading && (
              <div className="dd-right-loading">
                <div className="dd-spinner-lg" />
                <p>Analyzing your plant image…</p>
                <small>Our AI is examining disease patterns</small>
              </div>
            )}

            {results && !loading && (
              <DiagnosisResult result={results} />
            )}

            {!results && !loading && !error && (
              <div className="dd-placeholder-result">
                <span>🌿</span>
                <p>Upload a leaf image and click <strong>Detect Disease</strong> to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="dd-footer">
        <p><strong>KrishiMitra AI</strong> · For educational purposes only. Consult local experts for critical decisions.</p>
      </footer>
    </div>
  );
};

export default DiseaseDetection;