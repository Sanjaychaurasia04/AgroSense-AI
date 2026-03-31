// src/components/layout/Footer.jsx
import React from 'react';
import { theme } from '../../styles/theme';

const Footer = () => (
  <footer style={{
    textAlign: "center",
    padding: "12px 24px",
    marginTop: 40,
    borderTop: 'none',
    color: theme.mist,
    opacity: 0.45,
    fontSize: 11,
    lineHeight: 1.4,
    width: "100%",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: "0.3px",
  }}>
    कृषि Mitra AI Farm Manager • Python FastAPI + React • Keras Disease Model @2026
  </footer>
);

export default Footer;