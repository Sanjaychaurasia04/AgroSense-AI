// src/components/common/Badge.jsx
import React from 'react';
import { theme } from '../../styles/theme';

const Badge = ({ children, color = theme.wheat }) => (
  <span style={{
    background: color + "22",
    color,
    border: `1px solid ${color}44`,
    borderRadius: 999,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
  }}>
    {children}
  </span>
);

export default Badge;