// src/pages/Chatbot/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/common/Card';
import Btn from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { theme } from '../../styles/theme';
import { sendKisanMessage } from '../../api/chatApi';

// ── Typing indicator ──────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: 'flex', gap: 5, padding: '4px 0', alignItems: 'center' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: '50%',
        background: theme.sage,
        animation: `chatBounce 1.2s ${i * 0.18}s ease-in-out infinite`,
      }} />
    ))}
    <style>{`
      @keyframes chatBounce {
        0%, 80%, 100% { transform: translateY(0);   opacity: 0.4; }
        40%            { transform: translateY(-7px); opacity: 1;   }
      }
    `}</style>
  </div>
);

// ── Single message bubble ─────────────────────────────────────
const Bubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      alignItems: 'flex-end',
      gap: 8,
      animation: 'bubbleIn 0.25s ease both',
    }}>
      {/* bot avatar */}
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1a5c32, #2d6a3f)',
          border: '1px solid rgba(74,222,128,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, marginBottom: 2,
        }}>🌿</div>
      )}

      <div style={{
        maxWidth: '75%',
        padding: '11px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        background: isUser
          ? `linear-gradient(135deg, ${theme.leaf}, ${theme.clay})`
          : 'rgba(255,255,255,0.06)',
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.09)',
        color: theme.cream,
        lineHeight: 1.75, fontSize: 14,
        boxShadow: isUser ? '0 4px 16px rgba(45,106,63,0.3)' : 'none',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.text}
        {msg.error && (
          <div style={{ fontSize: 11, color: theme.alert, marginTop: 6, opacity: 0.8 }}>
            ⚠ {msg.error}
          </div>
        )}
      </div>

      {/* user avatar */}
      {isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #4ade80, #86efac)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 13, color: '#0e1a0f', marginBottom: 2,
        }}>
          K
        </div>
      )}
    </div>
  );
};

// ── Main Chatbot ──────────────────────────────────────────────
const Chatbot = () => {
  const [msgs, setMsgs] = useState([
    {
      role: 'bot',
      text: 'Namaste! 🌱 Main hoon KisanGPT — aapka AI farming assistant.\n\nMujhse poochh sakte hain:\n• Fasal ki bimari aur ilaaj\n• Fertilizer aur NPK recommendations\n• Mausam aur sinchai ki salah\n• Sarkari yojanaen (PM-KISAN, etc.)\n• Mandi bhav aur bechne ka sahi waqt\n\nHindi, English, Marathi — kisi bhi bhasha mein baat karein! 🇮🇳',
    },
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef  = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  const quickQuestions = [
    'टमाटर में लेट ब्लाइट का इलाज?',
    'Rice NPK recommendation',
    'PM-KISAN yojana kya hai?',
    'Wheat mein aphid attack',
    'Organic fertilizer options',
    'Drip irrigation ke fayde',
  ];

  const send = async (text = input) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput('');
    inputRef.current?.focus();

    // add user message
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const reply = await sendKisanMessage(q, msgs);
      setMsgs(m => [...m, { role: 'bot', text: reply }]);
    } catch (err) {
      setMsgs(m => [...m, {
        role: 'bot',
        text: 'Maafi chahta hoon, abhi jawab dene mein takleef ho rahi hai. Thodi der baad dobara try karein.',
        error: err.message,
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', gap: 0 }}>

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 4 }}>
          KisanGPT — फसल का दोस्त
        </h2>
        <p style={{ color: theme.mist, opacity: 0.7, fontSize: 13 }}>
          Powered by Google Gemini · Responds in Hindi, English, Marathi & more
        </p>
      </div>

      {/* Quick question chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {quickQuestions.map((q, i) => (
          <button key={i} onClick={() => send(q)} disabled={loading} style={{
            padding: '6px 13px', borderRadius: 999,
            border: `1px solid ${theme.earth}`,
            background: 'transparent', color: theme.sage,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', fontSize: 12,
            transition: 'all 0.18s', opacity: loading ? 0.5 : 1,
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = `${theme.leaf}22`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <Card style={{
        flex: 1, overflowY: 'auto', padding: '20px 16px',
        marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 14,
        scrollbarWidth: 'thin', scrollbarColor: `${theme.earth} transparent`,
      }}>
        {msgs.map((m, i) => <Bubble key={i} msg={m} />)}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a5c32, #2d6a3f)',
              border: '1px solid rgba(74,222,128,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🌿</div>
            <div style={{
              padding: '11px 16px', borderRadius: '4px 18px 18px 18px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
            }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </Card>

      {/* Input bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Koi bhi farming sawaal poochhen... (Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1,
            background: 'rgba(255,248,238,0.06)',
            border: `1px solid ${theme.earth}`,
            borderRadius: 12, padding: '12px 16px',
            color: theme.cream, fontFamily: 'inherit', fontSize: 14,
            outline: 'none', resize: 'none', lineHeight: 1.5,
            maxHeight: 120, overflowY: 'auto',
          }}
          onInput={e => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
        />
        <Btn icon="send" onClick={() => send()} loading={loading} disabled={!input.trim()} />
      </div>

      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;