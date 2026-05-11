// src/pages/CropAdvisory/CropAdvisory.jsx
import React, { useState, useCallback } from 'react';
import Weather from '../Weather/Weather';
import Fertilizer from '../Fertilizer/Fertilizer';
import CropRecommend from '../CropRecommend/CropRecommend';

// src/pages/CropAdvisory/CropAdvisory.jsx

const API_URL = 'https://crop-recommendation-blip.onrender.com/predict';

const CropAdvisory = () => {
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [apiError, setApiError] = useState('');

  const handlePredict = useCallback(async (payload) => {
    setLoading(true);
    setApiError('');
    setResult(null);

    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setResult({ crop: json.crop });
      } else {
        setApiError(json.error || 'Unexpected error from API.');
      }
    } catch (err) {
      setApiError(
        err.message.includes('fetch')
          ? 'Cannot reach the API. Check the endpoint or CORS settings.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setApiError('');
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Row 1: Weather + Fertilizer ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        alignItems: 'stretch',
        gridAutoRows: '1fr',
      }}>
        <div style={{ height: '100%' }}><Weather /></div>
        <div style={{ height: '100%' }}><Fertilizer /></div>
      </div>

      {/* ── Row 2: AI Crop Recommendation ── */}
      <CropRecommend
        onPredict={handlePredict}
        onClear={handleClear}
        loading={loading}
        result={result}
        apiError={apiError}
      />

    </div>
  );
};

export default CropAdvisory;