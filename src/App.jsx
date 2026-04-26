// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { theme } from './styles/theme';
import './styles/global.css';
import Fertilizer        from './pages/Fertilizer/Fertilizer';
import DiseaseDetection  from './pages/Disease/DiseaseDetection';
import Weather           from './pages/Weather/Weather';
import Market            from './pages/Market/Market';
import CropCalendar      from './pages/Calender/CropCalendar';
import Community         from './pages/Community/Community';
import CropAdvisory      from './pages/CropAdvisory/CropAdvisory';
import Schemes           from './pages/Schemes/Schemes';
import Chatbot           from './pages/Chatbot/Chatbot';
import Header            from './components/layout/Header';
import Footer            from './components/layout/Footer';
import AuthPage          from './pages/Auth/Authpage';
import LandingPage       from './pages/landing/landing.jsx';

// ── Full-screen spinner shown while Auth0 checks session ──────
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
    isLoading,
    isAuthenticated,
    user,
    logout,
  } = useAuth0();

  const [view, setView]     = useState('landing');
  const [active, setActive] = useState('dashboard');
  const [otpUser, setOtpUser] = useState(null);

  // Derive the active user from whichever auth method was used
  // Google login → user (from Auth0 SDK)
  // Email OTP    → otpUser (from our backend verify response)
  const activeUser = isAuthenticated ? user : otpUser;

  // Sync Auth0 Google session → view
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      setView('app');
    }
  }, [isLoading, isAuthenticated]);

  // Called by AuthPage on success (both Google + OTP paths)
  const handleAuthSuccess = (userData) => {
    if (userData) {
      setOtpUser(userData);
    }
    setView('app');
  };

  const handleLogout = () => {
    setOtpUser(null);
    if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } });
    }
    setView('landing');
  };

  // ── Pages — activeUser passed to every page that saves data ──
  const pages = {
    dashboard:       <DiseaseDetection user={activeUser} />,
    'crop-advisory': <CropAdvisory     user={activeUser} />,
    market:          <Market           user={activeUser} />,
    calendar:        <CropCalendar     user={activeUser} />,
    schemes:         <Schemes          user={activeUser} />,
    community:       <Community        user={activeUser} />,
    'ai-chat':       <Chatbot          user={activeUser} />,
    disease:         <DiseaseDetection user={activeUser} />,
    weather:         <Weather          user={activeUser} />,
    fertilizer:      <Fertilizer       user={activeUser} />,
    chatbot:         <Chatbot          user={activeUser} />,
  };

  if (isLoading) return <LoadingScreen />;

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setView('landing')}
      />
    );
  }

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      background: `
        radial-gradient(ellipse at 15% 0%,   rgba(63,124,81,0.22) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 100%, rgba(44,69,50,0.35)  0%, transparent 55%),
        #202c21
      `,
      fontFamily: "'DM Sans', 'Poppins', sans-serif",
      color: theme.cream,
      display: 'flex', flexDirection: 'column', overflowX: 'hidden',
    }}>
      <Header
        active={active}
        setActive={setActive}
        user={activeUser}
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