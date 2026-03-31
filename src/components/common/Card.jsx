// src/components/common/Card.jsx
import React from 'react';
import { theme } from '../../styles/theme';

const Card = ({ children, className = "", onClick, style = {} }) => (
  <div
    onClick={onClick}
    className={`card ${className}`}
    style={{
      background: "rgba(255,248,238,0.06)",
      border: `1px solid ${theme.wheat}33`,
      borderRadius: 16,
      padding: 24,
      backdropFilter: "blur(12px)",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      ...style,
    }}
  >
    {children}
  </div>
);

export default Card;