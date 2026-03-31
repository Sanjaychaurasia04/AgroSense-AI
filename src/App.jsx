// src/App.jsx
import React, { useState } from 'react';
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

const App = () => {
  // 'landing' | 'auth' | 'app'
  const [view, setView]     = useState('landing');
  const [active, setActive] = useState('dashboard');
  const [user, setUser]     = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
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
        user={user}
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