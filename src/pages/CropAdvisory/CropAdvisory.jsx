// src/pages/CropAdvisory/CropAdvisory.jsx
import React from 'react';
import Weather from '../Weather/Weather';
import Fertilizer from '../Fertilizer/Fertilizer';
import { theme } from '../../styles/theme';

const CropAdvisory = () => {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'stretch', gridAutoRows: '1fr' }}>
        <div style={{ height: '100%' }}>
          <Weather />
        </div>
        <div style={{ height: '100%' }}>
          <Fertilizer />
        </div>
      </div>
    </div>
  );
};

export default CropAdvisory;
