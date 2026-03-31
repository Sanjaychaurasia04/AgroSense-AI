// src/components/layout/Header.jsx
import React, { useState } from 'react';
import Icon from '../common/Icon';
import { navItems } from '../navigation/NavItems';
import './header.css';

const languages = [
  { code: 'en', label: 'English',  native: 'English'  },
  { code: 'hi', label: 'Hindi',    native: 'हिंदी'     },
  { code: 'mr', label: 'Marathi',  native: 'मराठी'     },
  { code: 'bn', label: 'Bengali',  native: 'বাংলা'     },
  { code: 'pa', label: 'Punjabi',  native: 'ਪੰਜਾਬੀ'    },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી'   },
  { code: 'ta', label: 'Tamil',    native: 'தமிழ்'     },
];

// ── new props: user, onLoginClick, onLogout ───────────────────
const Header = ({ active, setActive, user, onLoginClick, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen]             = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang]     = useState(languages[0]);

  const handleNavClick = (id) => { setActive(id); setMobileMenuOpen(false); };
  const handleLangSelect = (lang) => { setSelectedLang(lang); setLangOpen(false); };

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <header className="header-container">
      <div className="header-content">

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-icon">
            <Icon name="leaf" size={20} color="#86efac" />
          </div>
          <div className="logo-text">
            <div className="logo-title">कृषि Mitra</div>
            <div className="logo-subtitle">AI Farm Manager</div>
          </div>
        </div>

        <div className="logo-divider" />

        {/* Center Nav */}
        <nav className="nav-section">
          {navItems.map((n) => (
            <button
              key={n.id}
              className={`nav-link ${active === n.id ? 'active' : ''}`}
              onClick={() => handleNavClick(n.id)}
              title={n.label}
            >
              <Icon name={n.icon} size={15} color="currentColor" />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="right-section">

          {/* Language Dropdown */}
          <div className="lang-dropdown-wrapper">
            <button
              className={`lang-selector ${langOpen ? 'open' : ''}`}
              onClick={() => setLangOpen(o => !o)}
              title="Select language"
            >
              <Icon name="globe" size={13} color="currentColor" />
              <span>{selectedLang.native}</span>
              <Icon name="chevron-down" size={11} color="currentColor" />
            </button>
            {langOpen && (
              <>
                <div className="lang-backdrop" onClick={() => setLangOpen(false)} />
                <div className="lang-dropdown">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      className={`lang-option ${selectedLang.code === l.code ? 'active' : ''}`}
                      onClick={() => handleLangSelect(l)}
                    >
                      <span className="lang-native">{l.native}</span>
                      <span className="lang-english">{l.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Auth: Login button OR user account dropdown ── */}
          {user ? (
            // logged-in state with dropdown
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 12px 5px 5px',
                  borderRadius: 10,
                  background: userDropdownOpen ? 'rgba(74,222,128,0.15)' : 'rgba(74,222,128,0.08)',
                  border: `1px solid ${userDropdownOpen ? 'rgba(74,222,128,0.35)' : 'rgba(74,222,128,0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!userDropdownOpen) {
                    e.currentTarget.style.background = 'rgba(74,222,128,0.12)';
                  }
                }}
                onMouseLeave={e => {
                  if (!userDropdownOpen) {
                    e.currentTarget.style.background = 'rgba(74,222,128,0.08)';
                  }
                }}
                title="Account menu"
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ade80, #86efac)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12, color: '#0e1a0f',
                  flexShrink: 0, fontFamily: "'Poppins', sans-serif",
                }}>
                  {avatarLetter}
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: '#a3f0be', fontFamily: "'Poppins', sans-serif",
                  maxWidth: 90, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user.name}
                </span>
                <Icon name="chevron-down" size={11} color="#a3f0be" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div
                    className="lang-backdrop"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 8,
                      background: 'rgba(20, 30, 24, 0.95)',
                      border: '1px solid rgba(74,222,128,0.2)',
                      borderRadius: 12, overflow: 'hidden',
                      minWidth: 150, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                      zIndex: 1000,
                    }}
                  >
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%', padding: '12px 16px',
                        background: 'transparent', border: 'none',
                        display: 'flex', alignItems: 'center', gap: 10,
                        color: '#f87171', cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
                        transition: 'all 0.2s',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Icon name="logout" size={14} color="#f87171" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // guest state — opens AuthPage
            <button className="login-btn" onClick={onLoginClick}>
              <Icon name="user" size={14} color="currentColor" />
              <span>Login / Register</span>
            </button>
          )}

          {/* AI Online status */}
          <div className="ai-status">
            <div className="status-dot" />
            <span className="status-text">Active</span>
          </div>

        </div>

        {/* Hamburger */}
        <button
          className={`hamburger-menu ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="hamburger-bar" />
          <div className="hamburger-bar" />
          <div className="hamburger-bar" />
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {navItems.map((n) => (
          <button
            key={n.id}
            className={`mobile-nav-link ${active === n.id ? 'active' : ''}`}
            onClick={() => handleNavClick(n.id)}
          >
            <Icon name={n.icon} size={17} color="currentColor" />
            <span>{n.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;