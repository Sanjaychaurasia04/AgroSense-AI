// src/pages/Landing/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';

// ── useInView hook for scroll animations ─────────────────────
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

// ── Animated section wrapper ──────────────────────────────────
const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

// ── Feature card ──────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, accent, delay }) => {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${hov ? accent + '55' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 20,
          padding: '32px 28px',
          transition: 'all 0.3s',
          transform: hov ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hov ? `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${accent}33` : 'none',
          cursor: 'default',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{
          fontSize: 36, marginBottom: 18,
          filter: hov ? `drop-shadow(0 0 12px ${accent}88)` : 'none',
          transition: 'filter 0.3s',
        }}>{icon}</div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20, fontWeight: 700,
          color: hov ? accent : '#f0fdf4',
          marginBottom: 10, transition: 'color 0.3s',
        }}>{title}</h3>
        <p style={{ color: 'rgba(200,230,201,0.65)', fontSize: 14, lineHeight: 1.75 }}>{desc}</p>
      </div>
    </Reveal>
  );
};

// ── Stat pill ─────────────────────────────────────────────────
const Stat = ({ num, label, delay }) => (
  <Reveal delay={delay} style={{ textAlign: 'center' }}>
    <div style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 44, fontWeight: 700,
      background: 'linear-gradient(135deg, #4ade80, #86efac)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      lineHeight: 1, marginBottom: 8,
    }}>{num}</div>
    <div style={{ color: 'rgba(200,230,201,0.6)', fontSize: 13, letterSpacing: 0.5 }}>{label}</div>
  </Reveal>
);

// ── Testimonial card ──────────────────────────────────────────
const TestimonialCard = ({ quote, name, role, state, delay }) => (
  <Reveal delay={delay} style={{ height: '100%' }}>
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 20, padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ color: '#4ade80', fontSize: 28, marginBottom: 12, lineHeight: 1 }}>"</div>
      <p style={{ color: 'rgba(240,253,244,0.8)', fontSize: 14, lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic', flex: 1 }}>{quote}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a5c32, #4ade80)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 16, color: '#0e1a0f', flexShrink: 0,
        }}>{name.charAt(0)}</div>
        <div>
          <div style={{ color: '#f0fdf4', fontSize: 14, fontWeight: 600 }}>{name}</div>
          <div style={{ color: 'rgba(200,230,201,0.5)', fontSize: 12 }}>{role} · {state}</div>
        </div>
      </div>
    </div>
  </Reveal>
);

// ── Main Landing Page ─────────────────────────────────────────
const LandingPage = ({ onGetStarted }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const features = [
    { icon: '🔬', title: 'AI Disease Detection', accent: '#4ade80',
      desc: 'Upload a photo of your crop leaf. Our Keras deep-learning model identifies 38+ diseases instantly with treatment recommendations.' },
    { icon: '⛅', title: 'Hyper-Local Weather', accent: '#60a5fa',
      desc: 'Real-time weather alerts powered by OpenWeatherMap. Enter city name or PIN code — get farming-specific action advice.' },
    { icon: '🌱', title: 'Smart Fertilizer Guide', accent: '#a78bfa',
      desc: 'pH-based soil analysis with crop-specific NPK recommendations. Know exactly what your soil needs, when it needs it.' },
    { icon: '📈', title: 'Live Mandi Prices', accent: '#fb923c',
      desc: 'Real-time market prices from mandis across India. Make smarter selling decisions based on today\'s rates.' },
    { icon: '📅', title: 'Crop Calendar', accent: '#f472b6',
      desc: 'Personalised sowing, watering, and harvesting schedules tailored to your crop type and local climate.' },
    { icon: '🏛️', title: 'Government Schemes', accent: '#fbbf24',
      desc: 'Discover PM-KISAN, soil health cards, insurance schemes and subsidies you\'re eligible for — all in one place.' },
    { icon: '👥', title: 'Farmer Community', accent: '#34d399',
      desc: 'Connect with 50,000+ farmers. Share experiences, watch expert videos, and get peer advice in your language.' },
    { icon: '🤖', title: 'AI Chat Assistant', accent: '#4ade80',
      desc: 'Ask anything in Hindi, Marathi, or English. Our AI gives instant, accurate farming advice 24/7.' },
  ];

  const steps = [
    { n: '01', title: 'Create Free Account', desc: 'Sign up in 30 seconds. No credit card, no subscription.' },
    { n: '02', title: 'Set Your Profile', desc: 'Tell us your state, primary crop, and farm size.' },
    { n: '03', title: 'Get Instant Insights', desc: 'AI-powered recommendations personalised to your farm from day one.' },
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#0e1a0f', color: '#f0fdf4', overflowX: 'hidden' }}>

      {/* ── STICKY NAVBAR ─────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,26,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(74,222,128,0.1)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, #1a5c32, #0f3d1f)',
            border: '1px solid rgba(74,222,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🌿</div>
          <div>
            <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 17, fontWeight: 700, color: '#f0fdf4', lineHeight: 1 }}>कृषि Mitra</div>
            <div style={{ fontSize: 8, color: 'rgba(134,239,172,0.55)', letterSpacing: 2, textTransform: 'uppercase' }}>AI Farm Manager</div>
          </div>
        </div>

        {/* desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="landing-nav-links">
          {['Features', 'How it Works', 'Testimonials'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} style={{
              color: 'rgba(200,230,201,0.7)', fontSize: 13, fontWeight: 500,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#4ade80'}
              onMouseLeave={e => e.target.style.color = 'rgba(200,230,201,0.7)'}
            >{l}</a>
          ))}
        </div>

        <button onClick={onGetStarted} style={{
          padding: '9px 22px', borderRadius: 10, cursor: 'pointer',
          background: 'linear-gradient(135deg, #1a5c32, #2d6a3f)',
          border: '1px solid rgba(74,222,128,0.35)',
          color: '#a3f0be', fontFamily: "'Poppins', sans-serif",
          fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 16px rgba(74,222,128,0.15)',
          transition: 'all 0.22s',
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(74,222,128,0.28)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,222,128,0.15)'; e.currentTarget.style.transform = 'none'; }}
        >
          Get Started Free
        </button>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
        overflow: 'hidden',
      }}>
        {/* background rings */}
        {[600, 900, 1200].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(74,222,128,${0.06 - i * 0.015})`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', animation: `ringPulse ${4 + i}s ease-in-out infinite alternate`,
          }} />
        ))}

        {/* radial glow */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* floating dots */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2,
            borderRadius: '50%', background: '#4ade80',
            opacity: 0.25 + (i % 3) * 0.1,
            top: `${10 + i * 10}%`, left: `${5 + i * 12}%`,
            boxShadow: '0 0 10px rgba(74,222,128,0.5)',
            animation: `floatDot ${3 + i * 0.4}s ease-in-out infinite alternate`,
          }} />
        ))}

        <div style={{ position: 'relative', maxWidth: 820 }}>
          {/* badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 28,
            fontSize: 12, fontWeight: 600, color: '#86efac', letterSpacing: 0.5,
            animation: 'fadeDown 0.6s ease both',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }} />
            India's Most Advanced AI Farm Assistant
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 700, lineHeight: 1.12,
            color: '#f0fdf4', marginBottom: 12,
            animation: 'fadeDown 0.6s 0.1s ease both',
          }}>
            Smarter Farming<br />
            <span style={{
              background: 'linear-gradient(135deg, #4ade80, #86efac)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Powered by AI</span>
          </h1>

          {/* Hindi subtitle */}
          <p style={{
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            fontSize: 18, color: 'rgba(134,239,172,0.6)',
            marginBottom: 16, letterSpacing: 0.5,
            animation: 'fadeDown 0.6s 0.18s ease both',
          }}>
            किसानों के लिए बनाया गया · हर फसल के लिए
          </p>

          <p style={{
            fontSize: 17, color: 'rgba(200,230,201,0.7)',
            lineHeight: 1.75, maxWidth: 600, margin: '0 auto 40px',
            animation: 'fadeDown 0.6s 0.25s ease both',
          }}>
            Detect crop diseases in seconds, get hyper-local weather alerts,
            track mandi prices, and access government schemes —
            all in Hindi, Marathi, Bengali and more.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeDown 0.6s 0.35s ease both',
          }}>
            <button onClick={onGetStarted} style={{
              padding: '16px 36px', borderRadius: 14, cursor: 'pointer',
              background: 'linear-gradient(135deg, #1a5c32 0%, #2d6a3f 100%)',
              border: '1px solid rgba(74,222,128,0.4)',
              color: '#c6f7d8', fontFamily: "'Poppins', sans-serif",
              fontSize: 16, fontWeight: 700,
              boxShadow: '0 8px 32px rgba(74,222,128,0.25)',
              transition: 'all 0.25s', minHeight: 52,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(74,222,128,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(74,222,128,0.25)'; }}
            >
               Try Krishi-Mitra Now !
            </button>
            <a href="#features" style={{
              padding: '16px 32px', borderRadius: 14, cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(240,253,244,0.85)', fontFamily: "'Poppins', sans-serif",
              fontSize: 15, fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.25s', display: 'inline-block', minHeight: 52,
              boxSizing: 'border-box', lineHeight: '20px',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              Explore Features ↓
            </a>
          </div>

          {/* trust badges */}
          <div style={{
            display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap',
            marginTop: 48, animation: 'fadeDown 0.6s 0.45s ease both',
          }}>
            {['🆓 Always Free', '🔒 No Data Sold', '📱 Works on Mobile', '🇮🇳 Made for India'].map(b => (
              <div key={b} style={{ color: 'rgba(200,230,201,0.5)', fontSize: 12, fontWeight: 500 }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <section style={{
        background: 'rgba(74,222,128,0.05)',
        borderTop: '1px solid rgba(74,222,128,0.1)',
        borderBottom: '1px solid rgba(74,222,128,0.1)',
        padding: '56px 40px',
      }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40,
        }}>
          <Stat num="50K+" label="Active Farmers" delay={0}   />
          <Stat num="38+"  label="Diseases Detected" delay={0.1} />
          <Stat num="500+" label="Mandis Tracked" delay={0.2} />
          <Stat num="7"    label="Indian Languages" delay={0.3} />
          <Stat num="24/7" label="AI Availability" delay={0.4} />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: '#4ade80', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
              Everything You Need
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700,
              color: '#f0fdf4', textAlign: 'center', marginBottom: 16,
            }}>
              One Platform.<br />Every Farming Challenge.
            </h2>
            <p style={{ color: 'rgba(200,230,201,0.6)', textAlign: 'center', fontSize: 15, maxWidth: 520, margin: '0 auto 64px' }}>
              From seed to harvest, कृषि Mitra covers every stage of your farming journey with AI-powered precision.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" style={{
        padding: '100px 40px',
        background: 'linear-gradient(180deg, transparent, rgba(74,222,128,0.04), transparent)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: '#4ade80', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Simple Setup</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
              color: '#f0fdf4', textAlign: 'center', marginBottom: 56,
            }}>
              Start in 3 Steps
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32, position: 'relative' }}>
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                    background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05))',
                    border: '1px solid rgba(74,222,128,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 700, color: '#4ade80',
                  }}>{s.n}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#f0fdf4', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: 'rgba(200,230,201,0.6)', fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISEASE AI SPOTLIGHT ──────────────────────────── */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
        }} className="landing-split">
          <Reveal>
            <p style={{ color: '#4ade80', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Flagship Feature
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700,
              color: '#f0fdf4', lineHeight: 1.2, marginBottom: 20,
            }}>
              Diagnose Any Crop Disease<br />
              <span style={{ color: '#4ade80' }}>in Under 10 Seconds</span>
            </h2>
            <p style={{ color: 'rgba(200,230,201,0.65)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
              Our Keras deep-learning model, trained on 87,000+ plant images, 
              identifies 38 diseases across rice, wheat, tomato, cotton, and more. 
              Get instant treatment recommendations with exact chemical doses.
            </p>
            {['98.3% accuracy on field tests', '38+ diseases across 10 crops', 'Works offline once loaded', 'Treatment + prevention advice'].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>✓</div>
                <span style={{ color: 'rgba(200,230,201,0.75)', fontSize: 14 }}>{p}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(26,83,50,0.6), rgba(14,36,18,0.8))',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: 24, padding: 32,
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}>
              {/* Mock disease result UI */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ fontSize: 32 }}>🍃</div>
                <div>
                  <div style={{ color: '#f0fdf4', fontWeight: 600, fontSize: 15 }}>Disease Scan Result</div>
                  <div style={{ color: 'rgba(200,230,201,0.5)', fontSize: 12 }}>Tomato Leaf · Just now</div>
                </div>
                <div style={{
                  marginLeft: 'auto', padding: '4px 12px', borderRadius: 999,
                  background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)',
                  color: '#f87171', fontSize: 11, fontWeight: 600,
                }}>HIGH RISK</div>
              </div>

              <div style={{ background: 'rgba(248,113,113,0.08)', borderLeft: '3px solid #f87171', borderRadius: '0 12px 12px 0', padding: '16px 20px', marginBottom: 20 }}>
                <div style={{ color: '#f87171', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Late Blight Detected</div>
                <div style={{ color: 'rgba(240,253,244,0.7)', fontSize: 13 }}>Phytophthora infestans · 91% confidence</div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ color: 'rgba(200,230,201,0.5)', fontSize: 11, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Recommended Treatment</div>
                <div style={{ color: '#f0fdf4', fontSize: 13, lineHeight: 1.7 }}>Apply <strong style={{ color: '#86efac' }}>Mancozeb 75% WP @ 2g/L</strong>. Remove infected leaves. Ensure good air circulation. Repeat every 7–10 days.</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {['Spray Now', 'Save Report', 'Share'].map(a => (
                  <div key={a} style={{
                    padding: '7px 14px', borderRadius: 8,
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                    color: '#86efac', fontSize: 12, fontWeight: 500, cursor: 'default',
                  }}>{a}</div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section id="testimonials" style={{
        padding: '100px 40px',
        background: 'rgba(74,222,128,0.03)',
        borderTop: '1px solid rgba(74,222,128,0.08)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: '#4ade80', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Farmer Stories</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
              color: '#f0fdf4', textAlign: 'center', marginBottom: 56,
            }}>
              Trusted by Farmers Across India
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <TestimonialCard
              quote="कृषि Mitra ने मेरी टमाटर की फसल बचाई। रोग पहचान बहुत सटीक है। पहले मुझे नहीं पता था क्या स्प्रे करना है।"
              name="Ramesh Patil" role="Tomato Farmer" state="Maharashtra" delay={0} />
            <TestimonialCard
              quote="The weather alerts saved my wheat crop twice this season. I knew 2 days in advance about the cold wave and covered my nursery beds in time."
              name="Gurpreet Singh" role="Wheat Farmer" state="Punjab" delay={0.1} />
            <TestimonialCard
              quote="Market prices feature is game-changing. I wait for the right mandi now instead of selling immediately. Earned 18% more this harvest."
              name="Lakshmi Devi" role="Rice Farmer" state="Andhra Pradesh" delay={0.2} />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section style={{ padding: '120px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <Reveal>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🌾</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 700,
              color: '#f0fdf4', marginBottom: 16, lineHeight: 1.2,
            }}>
              Your Farm Deserves<br />
              <span style={{ color: '#4ade80' }}>Smarter Tools</span>
            </h2>
            <p style={{ color: 'rgba(200,230,201,0.6)', fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
              Join 50,000+ farmers already using कृषि Mitra. 
              Free forever. No hidden charges. Works on any device.
            </p>
            <button onClick={onGetStarted} style={{
              padding: '18px 48px', borderRadius: 14, cursor: 'pointer',
              background: 'linear-gradient(135deg, #1a5c32 0%, #2d6a3f 100%)',
              border: '1px solid rgba(74,222,128,0.45)',
              color: '#c6f7d8', fontFamily: "'Poppins', sans-serif",
              fontSize: 17, fontWeight: 700,
              boxShadow: '0 12px 40px rgba(74,222,128,0.28)',
              transition: 'all 0.25s', minHeight: 56,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 52px rgba(74,222,128,0.38)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(74,222,128,0.28)'; }}
            >
               Try Krishi-Mitra Now !
            </button>
            <p style={{ color: 'rgba(200,230,201,0.35)', fontSize: 12, marginTop: 16 }}>
              No credit card · No subscription · Works on any network
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(74,222,128,0.1)',
        padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🌿</span>
          <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 14, color: 'rgba(200,230,201,0.5)' }}>कृषि Mitra</span>
        </div>
        <p style={{ color: 'rgba(200,230,201,0.3)', fontSize: 11, textAlign: 'center' }}>
          कृषि Mitra AI Farm Manager · Python FastAPI + React · Keras Disease Model @2026
        </p>
        <p style={{ color: 'rgba(200,230,201,0.3)', fontSize: 11 }}>Made with 🌱 for Indian Farmers</p>
      </footer>

      {/* ── Keyframes ─────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;700&display=swap');

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatDot {
          from { transform: translateY(0) scale(1); opacity: 0.25; }
          to   { transform: translateY(-14px) scale(1.2); opacity: 0.55; }
        }
        @keyframes ringPulse {
          from { transform: translate(-50%, -50%) scale(0.97); opacity: 0.8; }
          to   { transform: translate(-50%, -50%) scale(1.03); opacity: 0.4; }
        }

        @media (max-width: 768px) {
          .landing-nav-links { display: none !important; }
          .landing-split { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;