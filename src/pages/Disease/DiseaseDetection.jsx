// src/pages/Disease/DiseaseDetection.jsx
import React, { useState, useRef } from 'react';
import { Client } from "@gradio/client";
import UploadBox from './UploadBox';
import DiagnosisResult from './DiagnosisResult';
import './DiseaseDetection.css';

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

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
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      setError('Please drop a valid image file');
    }
  };

  const extractConfidence = (confidenceObj) => {
    if (!confidenceObj || typeof confidenceObj !== "object") return 0;
    const values = Object.values(confidenceObj);
    return Math.max(...values) / 100;
  };

  const formatDiseaseName = (name) => {
    if (!name) return 'Unknown';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const client = await Client.connect(
        "sanjaychaurasia1/krishimitra-ai",
        {
          hf_token: import.meta.env.VITE_HF_TOKEN,
        }
      );

      const result = await client.predict("/predict", {
        image: selectedFile,
      });

      console.log('API Response:', result.data);

      const [diagnosis, alternatives, confidenceData] = result.data;
      
      // Parse alternatives if they exist
      let parsedAlternatives = [];
      if (alternatives && typeof alternatives === 'object') {
        parsedAlternatives = Object.entries(alternatives)
          .map(([name, conf]) => ({
            name: formatDiseaseName(name),
            confidence: (conf / 100).toFixed(2)
          }))
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 3);
      }

      const parsedResult = {
        disease: formatDiseaseName(diagnosis),
        solution: alternatives?.treatment || alternatives?.solution || 
          'Regular monitoring and proper plant care recommended',
        confidence: extractConfidence(confidenceData),
        alternatives: parsedAlternatives,
        severity: getSeverityLevel(extractConfidence(confidenceData)),
      };

      setResults(parsedResult);

      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityLevel = (confidence) => {
    if (confidence > 0.85) return 'high';
    if (confidence > 0.7) return 'moderate';
    if (confidence > 0.5) return 'low';
    return 'none';
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName('');
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="disease-detection">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="bg-leaf leaf-1">🌿</div>
        <div className="bg-leaf leaf-2">🍃</div>
        <div className="bg-leaf leaf-3">🌱</div>
        <div className="bg-leaf leaf-4">🍂</div>
      </div>

      <div className="wrapper">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon">🌾</div>
            <div className="logo-text">
              <h1>KrishiMitra</h1>
              <span>AI-Powered Plant Health Assistant</span>
            </div>
          </div>
          <div className="model-badge">
            <span className="badge-dot"></span>
            ResNet50 · 38 Classes
          </div>
        </header>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow-icon">🤖</span>
              Powered by Deep Learning
            </div>
            <h2>
              Detect Plant Diseases<br />
              <span className="highlight">Instantly & Accurately</span>
            </h2>
            <p>
              Upload a photo of your plant's leaf. Our advanced ResNet50 model, 
              trained on 87,000+ images, provides instant diagnosis and 
              organic treatment recommendations.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">38</div>
              <div className="stat-label">Disease Classes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">14</div>
              <div className="stat-label">Crop Types</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">87k+</div>
              <div className="stat-label">Training Images</div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-container">
            <div className="upload-header">
              <h3>Upload Plant Image</h3>
              <p>Supported formats: JPG, PNG, WEBP (Max 10MB)</p>
            </div>
            
            <div className="upload-area">
              <UploadBox
                drag={dragOver}
                setDrag={setDragOver}
                preview={previewUrl}
                handleFile={handleFile}
                fileRef={fileInputRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
              
              {previewUrl && (
                <div className="preview-container">
                  <div className="preview-image">
                    <img src={previewUrl} alt="Plant preview" />
                    <button className="clear-btn" onClick={clearImage} title="Remove image">
                      ✕
                    </button>
                  </div>
                  <div className="preview-info">
                    <span className="file-name">{fileName}</span>
                    <span className="file-size">
                      {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {selectedFile && (
              <button
                className={`analyze-btn ${loading ? 'loading' : ''}`}
                onClick={analyzeImage}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing Plant Health...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🔬</span>
                    Analyze Plant Health
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Loading Animation */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-leaf">🌿</div>
              </div>
              <p>Analyzing your plant image...</p>
              <p className="loading-sub">Our AI is examining disease patterns</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div ref={resultsRef} className={`results-section ${results || error ? 'show' : ''}`}>
          {error && (
            <div className="error-card">
              <div className="error-icon">⚠️</div>
              <div className="error-content">
                <h4>Analysis Failed</h4>
                <p>{error}</p>
                <button className="retry-btn" onClick={() => setError(null)}>
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {results && (
            <DiagnosisResult result={results} />
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>Built with ❤️ for farmers and gardeners</p>
            <p className="footer-note">
              <strong>KrishiMitra AI</strong> · ResNet50 Plant Disease Detection · 
              For educational purposes only. Consult local experts for critical decisions.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DiseaseDetection;