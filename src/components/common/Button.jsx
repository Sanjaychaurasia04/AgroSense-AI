// src/components/common/Button.jsx
import React from 'react';
import { theme } from '../../styles/theme';
import Icon from './Icon';

const Btn = ({ children, onClick, variant = "primary", loading, disabled, icon, style = {} }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: variant === "ghost" ? "8px 16px" : "12px 24px",
      borderRadius: 12,
      border: variant === "outline" ? `1px solid ${theme.wheat}55` : "none",
      background: variant === "primary"
        ? `linear-gradient(135deg, ${theme.leaf}, ${theme.sprout})`
        : variant === "secondary"
          ? `linear-gradient(135deg, ${theme.earth}, ${theme.clay})`
          : variant === "ghost"
            ? "transparent"
            : "transparent",
      color: variant === "ghost" ? theme.mist : theme.cream,
      fontFamily: "inherit",
      fontWeight: 600,
      fontSize: 14,
      cursor: disabled || loading ? "not-allowed" : "pointer",
      opacity: disabled || loading ? 0.6 : 1,
      transition: "all 0.2s ease",
      letterSpacing: 0.3,
      ...style,
    }}
  >
    {icon && <Icon name={icon} size={16} />}
    {loading ? "Loading..." : children}
  </button>
);

export default Btn;