// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { theme } from './styles/theme';
import './styles/global.css';
import Fertilizer from './pages/Fertilizer/Fertilizer';
import DiseaseDetection from './pages/Disease/DiseaseDetection';
import Weather from './pages/Weather/Weather';
import Market from './pages/Market/Market';
import CropCalendar from './pages/Calender/CropCalendar';
import Community from './pages/Community/Community';
import CropAdvisory from './pages/CropAdvisory/CropAdvisory';
import Schemes from './pages/Schemes/Schemes';
import Chatbot from './pages/Chatbot/Chatbot';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AuthPage from './pages/Auth/Authpage';
import LandingPage from './pages/landing/landing.jsx';

// ── Full-screen spinner shown while Auth0 checks session ──
const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', background: '#202c21', gap: 16,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      border: '3px solid rgba(74,222,128,0.15)',
      borderTopColor: '#4ade80',
      animation: 'spin 0.7s linear infinite',
    }} />
    <p style={{ color: 'rgba(134,239,172,0.5)', fontFamily: "'Poppins', sans-serif", fontSize: 13 }}>
      Loading…
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const App = () => {
  const {
    isLoading,        // true while Auth0 checks for an existing session
    isAuthenticated,  // true once the user is logged in
    user,             // Google profile: { name, email, picture, sub, ... }
    logout,           // call this to log out
  } = useAuth0();

  // 'landing' | 'auth' | 'app'
  const [view, setView]     = useState('landing');
  const [active, setActive] = useState('dashboard');

  // ── Sync Auth0 state → view ───────────────────────────────
  // When Auth0 finishes loading:
  //   • already logged in  → go straight to app
  //   • not logged in      → stay on landing (or wherever we were)
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      setView('app');
    }
  }, [isLoading, isAuthenticated]);

  const handleAuthSuccess = () => {
    // Called by AuthPage after successful email/password login too.
    // Auth0 hook already has the user object, so no need to pass it here.
    setView('app');
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    // Auth0 will clear the session and redirect back; the useEffect above
    // will then see isAuthenticated === false and we reset to landing.
    setView('landing');
  };

  const pages = {
    dashboard:       <DiseaseDetection />,
    'crop-advisory': <CropAdvisory />,
    market:          <Market />,
    calendar:        <CropCalendar />,
    schemes:         <Schemes />,
    community:       <Community />,
    'ai-chat':       <Chatbot />,
    disease:         <DiseaseDetection />,
    weather:         <Weather />,
    fertilizer:      <Fertilizer />,
    chatbot:         <Chatbot />,
  };

  // ── Wait for Auth0 to finish its session check ────────────
  if (isLoading) return <LoadingScreen />;

  // ── Landing page ──────────────────────────────────────────
  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('auth')}
      />
    );
  }

  // ── Auth page ─────────────────────────────────────────────
  if (view === 'auth') {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setView('landing')}
      />
    );
  }

  // ── Main app ──────────────────────────────────────────────
  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      background: `
        radial-gradient(ellipse at 15% 0%,   rgba(63, 124, 81, 0.22) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 100%, rgba(44, 69, 50, 0.35)  0%, transparent 55%),
        #202c21
      `,
      fontFamily: "'DM Sans', 'Poppins', sans-serif",
      color: theme.cream,
      display: 'flex', flexDirection: 'column', overflowX: 'hidden',
    }}>
      <Header
        active={active}
        setActive={setActive}
        user={user}             // now the real Auth0 Google user object
        onLoginClick={() => setView('auth')}
        onLogout={handleLogout}
      />
      <main style={{ flex: 1, width: '100%', padding: '40px 24px' }}>
        {pages[active]}
      </main>
      <Footer />
    </div>
  );
};

export default App;