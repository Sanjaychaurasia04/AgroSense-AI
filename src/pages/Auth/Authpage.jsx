// src/pages/Auth/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Icon from '../../components/common/Icon';

// ── Google Sign-In Button ─────────────────────────────────────
const GoogleBtn = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    style={{
      width: '100%', padding: '12px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 11, cursor: loading ? 'not-allowed' : 'pointer',
      color: '#f0fdf4', fontFamily: "'Poppins', sans-serif",
      fontSize: 14, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      transition: 'all 0.22s',
      opacity: loading ? 0.6 : 1,
    }}
    onMouseEnter={e => !loading && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
  >
    {/* Google "G" logo SVG */}
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
    {loading ? 'Redirecting to Google…' : 'Continue with Google'}
  </button>
);

// ── Divider ───────────────────────────────────────────────────
const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
    <span style={{ color: 'rgba(200,230,201,0.3)', fontSize: 11, fontFamily: "'Poppins', sans-serif" }}>
      or continue with email
    </span>
    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
  </div>
);

// ── Reusable input field ──────────────────────────────────────
const Field = ({ label, type = 'text', placeholder, value, onChange, icon, error }) => {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', marginBottom: 6,
        fontSize: 10, fontWeight: 600, letterSpacing: 1.4,
        color: focused ? '#4ade80' : 'rgba(200,230,201,0.45)',
        textTransform: 'uppercase', fontFamily: "'Poppins', sans-serif",
        transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
          opacity: focused ? 1 : 0.35, transition: 'opacity 0.2s', pointerEvents: 'none',
        }}>
          <Icon name={icon} size={14} color={focused ? '#4ade80' : '#c8e6c9'} />
        </div>
        <input
          type={isPassword && showPw ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '12px 16px 12px 40px',
            background: focused ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${error ? '#f87171' : focused ? 'rgba(74,222,128,0.45)' : 'rgba(255,255,255,0.09)'}`,
            borderRadius: 11, color: '#f0fdf4',
            fontFamily: "'Poppins', sans-serif", fontSize: 13,
            outline: 'none', transition: 'all 0.2s',
            boxShadow: focused ? '0 0 0 3px rgba(74,222,128,0.07)' : 'none',
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPw(p => !p)} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: 'rgba(200,230,201,0.4)', fontSize: 11, fontFamily: "'Poppins', sans-serif",
          }}>
            {showPw ? 'hide' : 'show'}
          </button>
        )}
      </div>
      {error && (
        <p style={{ color: '#f87171', fontSize: 11, marginTop: 4, fontFamily: "'Poppins', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
};

// ── Submit button ─────────────────────────────────────────────
const SubmitBtn = ({ children, loading }) => (
  <button type="submit" disabled={loading} style={{
    width: '100%', padding: '13px',
    background: loading ? 'rgba(74,222,128,0.12)' : 'linear-gradient(135deg, #1a5c32, #2d6a3f)',
    border: '1px solid rgba(74,222,128,0.3)',
    borderRadius: 11, cursor: loading ? 'not-allowed' : 'pointer',
    color: loading ? 'rgba(134,239,172,0.4)' : '#a3f0be',
    fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    boxShadow: loading ? 'none' : '0 4px 20px rgba(74,222,128,0.14)',
    transition: 'all 0.22s',
    marginTop: 8,
  }}>
    {loading && (
      <div style={{
        width: 15, height: 15, borderRadius: '50%',
        border: '2px solid rgba(134,239,172,0.2)',
        borderTopColor: '#4ade80',
        animation: 'spin 0.7s linear infinite',
      }} />
    )}
    {loading ? 'Please wait…' : children}
  </button>
);

// ── Main AuthPage ─────────────────────────────────────────────
const AuthPage = ({ onAuthSuccess, onBack }) => {
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading: auth0Loading,
    user,
    logout,
  } = useAuth0();

  const [mode, setMode]       = useState('login');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState({});

  // Login fields
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName]         = useState('');
  const [regPhone, setRegPhone]       = useState('');
  const [regEmail, setRegEmail]       = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm]   = useState('');
  const [regState, setRegState]       = useState('');
  const [regCrop, setRegCrop]         = useState('');

  // ── Handle Auth0 redirect callback ──
  useEffect(() => {
    if (isAuthenticated && user) {
      setSuccess(true);
      setTimeout(() => onAuthSuccess?.({ name: user.name, email: user.email, picture: user.picture }), 900);
    }
  }, [isAuthenticated, user]);

  // ── Google login via Auth0 ──
  const handleGoogleLogin = () => {
    setLoading(true);
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',   // tells Auth0 to use Google directly
        prompt: 'select_account',      // always show account picker
      },
    });
    // page will redirect, so no need to setLoading(false)
  };

  const indianStates = [
    'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
    'Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan',
    'Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal',
  ];
  const crops = ['Rice','Wheat','Maize','Cotton','Sugarcane','Tomato','Potato','Soybean','Groundnut'];

  const validateLogin = () => {
    const e = {};
    if (!loginEmail.trim()) e.loginEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) e.loginEmail = 'Enter a valid email';
    if (!loginPassword) e.loginPassword = 'Password is required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!regName.trim()) e.regName = 'Full name is required';
    if (!regPhone.trim()) e.regPhone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(regPhone)) e.regPhone = 'Enter valid 10-digit mobile number';
    if (!regEmail.trim()) e.regEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(regEmail)) e.regEmail = 'Enter a valid email';
    if (!regPassword) e.regPassword = 'Password is required';
    else if (regPassword.length < 6) e.regPassword = 'Min 6 characters';
    if (regPassword !== regConfirm) e.regConfirm = 'Passwords do not match';
    setErrors(e); return Object.keys(e).length === 0;
  };

  // Email/password login — wire to your backend here
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    // TODO: replace with real API call e.g. await api.login(loginEmail, loginPassword)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false); setSuccess(true);
    setTimeout(() => onAuthSuccess?.({ name: loginEmail.split('@')[0], email: loginEmail }), 900);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    // TODO: replace with real API call
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false); setSuccess(true);
    setTimeout(() => onAuthSuccess?.({ name: regName, email: regEmail }), 900);
  };

  const switchMode = (m) => { setMode(m); setErrors({}); setSuccess(false); };

  if (auth0Loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#202c21',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '3px solid rgba(74,222,128,0.2)',
          borderTopColor: '#4ade80',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      display: 'flex', fontFamily: "'Poppins', sans-serif",
      background: `
        radial-gradient(ellipse at 10% 20%, rgba(45,106,63,0.28) 0%, transparent 50%),
        radial-gradient(ellipse at 90% 80%, rgba(26,51,32,0.38) 0%, transparent 50%),
        #202c21
      `,
      overflow: 'hidden',
    }}>

      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div style={{
        flex: '0 0 44%', position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 52px',
        background: 'linear-gradient(160deg, rgba(20,60,32,0.97) 0%, rgba(14,30,18,0.99) 100%)',
        borderRight: '1px solid rgba(74,222,128,0.09)',
        overflow: 'hidden',
      }}>
        {[{s:360,t:-90,l:-90},{s:220,t:260,l:270},{s:160,t:-30,l:330},{s:440,t:420,l:-130}].map((c,i) => (
          <div key={i} style={{
            position: 'absolute', width: c.s, height: c.s, borderRadius: '50%',
            border: '1px solid rgba(74,222,128,0.15)',
            top: c.t, left: c.l, pointerEvents: 'none',
          }} />
        ))}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: '#4ade80', opacity: 0.35,
            top: `${18 + i * 15}%`, left: `${68 + (i % 2) * 18}%`,
            boxShadow: '0 0 8px rgba(74,222,128,0.5)',
            animation: `floatDot ${2.5 + i * 0.5}s ease-in-out infinite alternate`,
          }} />
        ))}

        <button onClick={onBack} style={{
          position: 'absolute', top: 28, left: 28,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
          color: 'rgba(134,239,172,0.7)', fontSize: 12, fontFamily: "'Poppins', sans-serif",
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.13)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.07)'}
        >
          <Icon name="back" size={13} color="currentColor" />
          Back to app
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #1a5c32, #0f3d1f)',
            border: '1px solid rgba(74,222,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 22px rgba(74,222,128,0.18)',
          }}>
            <Icon name="leaf" size={22} color="#86efac" />
          </div>
          <div>
            <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 21, fontWeight: 700, color: '#f0fdf4', lineHeight: 1 }}>
              कृषि Mitra
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(134,239,172,0.55)', letterSpacing: 2.2, textTransform: 'uppercase' }}>
              AI Farm Manager
            </div>
          </div>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 36, fontWeight: 700, color: '#f0fdf4',
          lineHeight: 1.25, marginBottom: 14,
        }}>
          Smart farming<br /><span style={{ color: '#4ade80' }}>starts here.</span>
        </h1>
        <p style={{ color: 'rgba(200,230,201,0.6)', fontSize: 14, lineHeight: 1.85, maxWidth: 340, marginBottom: 40 }}>
          Join thousands of Indian farmers using AI to detect crop diseases,
          get weather alerts, and maximise yields — all in one place.
        </p>

        {[
          { icon: 'alert',  text: 'AI disease detection in seconds'      },
          { icon: 'cloud',  text: 'Hyper-local weather & farming alerts' },
          { icon: 'market', text: 'Live mandi prices across India'       },
          { icon: 'gov',    text: 'Government schemes & subsidy tracker' },
          { icon: 'users',  text: 'Farmer community & expert advice'     },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(74,222,128,0.09)', border: '1px solid rgba(74,222,128,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={f.icon} size={14} color="#4ade80" />
            </div>
            <span style={{ color: 'rgba(200,230,201,0.75)', fontSize: 13 }}>{f.text}</span>
          </div>
        ))}

        <div style={{ position: 'absolute', bottom: 28, left: 52, fontSize: 11, color: 'rgba(134,239,172,0.3)', letterSpacing: 0.3 }}>
          🌾 Trusted by 50,000+ farmers across India
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '32px 28px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: 4, marginBottom: 30,
          }}>
            {['login', 'register'].map(m => (
              <button key={m} type="button" onClick={() => switchMode(m)} style={{
                flex: 1, padding: '9px 0', borderRadius: 9, cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s',
                background: mode === m ? 'linear-gradient(135deg, rgba(74,222,128,0.18), rgba(74,222,128,0.09))' : 'transparent',
                color: mode === m ? '#86efac' : 'rgba(200,230,201,0.35)',
                border: mode === m ? '1px solid rgba(74,222,128,0.22)' : '1px solid transparent',
              }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* ── Success ── */}
          {success && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', margin: '0 auto 20px',
                background: 'rgba(74,222,128,0.12)', border: '2px solid rgba(74,222,128,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(74,222,128,0.18)',
              }}>
                <Icon name="check" size={26} color="#4ade80" />
              </div>
              {/* Show Google profile picture if available */}
              {user?.picture && (
                <img src={user.picture} alt="profile" style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: '2px solid rgba(74,222,128,0.4)',
                  margin: '0 auto 12px', display: 'block',
                }} />
              )}
              <h3 style={{ color: '#f0fdf4', fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>
                {mode === 'login' ? 'Welcome back!' : 'Account created!'}
              </h3>
              {user?.name && (
                <p style={{ color: '#86efac', fontSize: 14, marginBottom: 4 }}>{user.name}</p>
              )}
              <p style={{ color: 'rgba(200,230,201,0.5)', fontSize: 13 }}>Redirecting to your dashboard…</p>
            </div>
          )}

          {/* ── Login form ── */}
          {!success && mode === 'login' && (
            <form onSubmit={handleLogin}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#f0fdf4', marginBottom: 4 }}>
                Welcome back
              </h2>
              <p style={{ color: 'rgba(200,230,201,0.45)', fontSize: 13, marginBottom: 24 }}>
                Sign in to your कृषि Mitra account
              </p>

              {/* ── Google button first ── */}
              <GoogleBtn onClick={handleGoogleLogin} loading={loading} />
              <Divider />

              <Field label="Email address" type="email" placeholder="yourname@example.com"
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                icon="send" error={errors.loginEmail} />

              <Field label="Password" type="password" placeholder="Enter your password"
                value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                icon="check" error={errors.loginPassword} />

              <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 20 }}>
                <button type="button" style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#4ade80', fontSize: 12, fontFamily: "'Poppins', sans-serif",
                }}>Forgot password?</button>
              </div>

              <SubmitBtn loading={loading}>Sign In with Email</SubmitBtn>

              <p style={{ textAlign: 'center', color: 'rgba(200,230,201,0.35)', fontSize: 12, marginTop: 18 }}>
                Don't have an account?{' '}
                <button type="button" onClick={() => switchMode('register')} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#4ade80', fontSize: 12, fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                }}>Create one free</button>
              </p>
            </form>
          )}

          {/* ── Register form ── */}
          {!success && mode === 'register' && (
            <form onSubmit={handleRegister}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#f0fdf4', marginBottom: 4 }}>
                Create your account
              </h2>
              <p style={{ color: 'rgba(200,230,201,0.45)', fontSize: 13, marginBottom: 22 }}>
                Free forever · No credit card needed
              </p>

              {/* ── Google button first ── */}
              <GoogleBtn onClick={handleGoogleLogin} loading={loading} />
              <Divider />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Full Name" placeholder="Ramesh Kumar"
                  value={regName} onChange={e => setRegName(e.target.value)}
                  icon="user" error={errors.regName} />
                <Field label="Mobile Number" placeholder="9876543210"
                  value={regPhone} onChange={e => setRegPhone(e.target.value)}
                  icon="send" error={errors.regPhone} />
              </div>

              <Field label="Email address" type="email" placeholder="yourname@example.com"
                value={regEmail} onChange={e => setRegEmail(e.target.value)}
                icon="send" error={errors.regEmail} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Password" type="password" placeholder="Min 6 chars"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)}
                  icon="check" error={errors.regPassword} />
                <Field label="Confirm Password" type="password" placeholder="Repeat"
                  value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                  icon="check" error={errors.regConfirm} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', marginBottom: 6, fontSize: 10, fontWeight: 600,
                  letterSpacing: 1.4, color: 'rgba(200,230,201,0.45)',
                  textTransform: 'uppercase', fontFamily: "'Poppins', sans-serif",
                }}>State</label>
                <select value={regState} onChange={e => setRegState(e.target.value)} style={{
                  width: '100%', padding: '12px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 11,
                  color: regState ? '#f0fdf4' : 'rgba(200,230,201,0.3)',
                  fontFamily: "'Poppins', sans-serif", fontSize: 13,
                  outline: 'none', cursor: 'pointer',
                }}>
                  <option value="" disabled style={{ background: '#202c21' }}>Select your state</option>
                  {indianStates.map(s => (
                    <option key={s} value={s} style={{ background: '#202c21', color: '#f0fdf4' }}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block', marginBottom: 8, fontSize: 10, fontWeight: 600,
                  letterSpacing: 1.4, color: 'rgba(200,230,201,0.45)',
                  textTransform: 'uppercase', fontFamily: "'Poppins', sans-serif",
                }}>Primary Crop <span style={{ color: 'rgba(200,230,201,0.3)', fontWeight: 400 }}>(optional)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {crops.map(c => (
                    <button key={c} type="button" onClick={() => setRegCrop(c === regCrop ? '' : c)} style={{
                      padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
                      border: `1px solid ${regCrop === c ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.09)'}`,
                      background: regCrop === c ? 'rgba(74,222,128,0.11)' : 'transparent',
                      color: regCrop === c ? '#86efac' : 'rgba(200,230,201,0.45)',
                      fontFamily: "'Poppins', sans-serif", fontSize: 12, transition: 'all 0.18s',
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              <SubmitBtn loading={loading}>Create Account with Email</SubmitBtn>

              <p style={{ textAlign: 'center', color: 'rgba(200,230,201,0.3)', fontSize: 11, marginTop: 14, lineHeight: 1.7 }}>
                By registering you agree to our{' '}
                <span style={{ color: '#4ade80', cursor: 'pointer' }}>Terms</span> &{' '}
                <span style={{ color: '#4ade80', cursor: 'pointer' }}>Privacy Policy</span>
              </p>
              <p style={{ textAlign: 'center', color: 'rgba(200,230,201,0.35)', fontSize: 12, marginTop: 10 }}>
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#4ade80', fontSize: 12, fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                }}>Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes floatDot { from { transform: translateY(0);     opacity: 0.35; }
                              to   { transform: translateY(-10px); opacity: 0.7;  } }
        input::placeholder  { color: rgba(200,230,201,0.22) !important; }
        select option       { background: #202c21 !important; }
      `}</style>
    </div>
  );
};

export default AuthPage;