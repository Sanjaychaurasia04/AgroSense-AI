import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../../components/common/Card';
import Btn from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { theme } from '../../styles/theme';
import { sendKisanMessage } from '../../api/chatApi';

// ── Markdown renderer ─────────────────────────────────────────
const renderMarkdown = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Empty line → spacer
    if (!line.trim()) {
      elements.push(<div key={key++} style={{ height: 6 }} />);
      continue;
    }

    // Heading: ### or ## or #
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h1 || h2 || h3) {
      const content = (h1 || h2 || h3)[1];
      elements.push(
        <div key={key++} style={{
          fontSize: h1 ? 16 : h2 ? 15 : 14,
          fontWeight: 700,
          color: '#86efac',
          borderBottom: h1 || h2 ? '1px solid rgba(74,222,128,0.2)' : 'none',
          paddingBottom: h1 || h2 ? 4 : 0,
          marginTop: 10, marginBottom: 4,
        }}>
          {inlineFormat(content)}
        </div>
      );
      continue;
    }

    // Bullet: * or - or •
    const bullet = line.match(/^[\*\-•]\s+(.*)/);
    if (bullet) {
      const content = bullet[1];

      // Check if bullet starts with **bold label**:
      const boldLabel = content.match(/^\*\*(.+?)\*\*[:：]?\s*(.*)/);
      if (boldLabel) {
        elements.push(
          <div key={key++} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4ade80', flexShrink: 0, marginTop: 7,
            }} />
            <div style={{ lineHeight: 1.7, fontSize: 14 }}>
              <span style={{
                color: '#4ade80', fontWeight: 700,
                background: 'rgba(74,222,128,0.1)',
                padding: '1px 7px', borderRadius: 5, marginRight: 6,
              }}>
                {boldLabel[1]}
              </span>
              <span style={{ color: 'rgba(240,253,244,0.85)' }}>
                {inlineFormat(boldLabel[2])}
              </span>
            </div>
          </div>
        );
      } else {
        elements.push(
          <div key={key++} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4ade80', flexShrink: 0, marginTop: 7,
            }} />
            <div style={{ lineHeight: 1.7, fontSize: 14, color: 'rgba(240,253,244,0.85)' }}>
              {inlineFormat(content)}
            </div>
          </div>
        );
      }
      continue;
    }

    // Numbered list: 1. 2. etc
    const numbered = line.match(/^(\d+)\.\s+(.*)/);
    if (numbered) {
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(74,222,128,0.15)',
            border: '1px solid rgba(74,222,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#4ade80', marginTop: 2,
          }}>
            {numbered[1]}
          </div>
          <div style={{ lineHeight: 1.7, fontSize: 14, color: 'rgba(240,253,244,0.85)' }}>
            {inlineFormat(numbered[2])}
          </div>
        </div>
      );
      continue;
    }

    // Normal paragraph line
    elements.push(
      <div key={key++} style={{ lineHeight: 1.75, fontSize: 14, marginBottom: 3, color: 'rgba(240,253,244,0.9)' }}>
        {inlineFormat(line)}
      </div>
    );
  }

  return elements;
};

// ── Inline formatter: **bold**, *italic*, `code` ──────────────
const inlineFormat = (text) => {
  if (!text) return null;

  const parts = [];
  // Split on **bold**, *italic*, `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={match.index} style={{ color: '#86efac', fontWeight: 700 }}>
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // *italic*
      parts.push(
        <em key={match.index} style={{ color: '#a7f3d0', fontStyle: 'italic' }}>
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      // `code`
      parts.push(
        <code key={match.index} style={{
          background: 'rgba(74,222,128,0.12)',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: 4, padding: '1px 6px',
          fontSize: 12, color: '#6ee7b7', fontFamily: 'monospace',
        }}>
          {match[4]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
};

// ── Voice hook ────────────────────────────────────────────────
const useSpeechRecognition = (lang = 'hi-IN') => {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported]   = useState(false);
  const recognitionRef              = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec         = new SR();
    rec.continuous    = false;
    rec.interimResults = true;
    rec.lang          = lang;
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
    };
    rec.onend  = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    setTranscript('');
    recognitionRef.current.start();
    setListening(true);
  }, [listening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, transcript, supported, startListening, stopListening, setTranscript };
};

// ── Pulse ring for mic ────────────────────────────────────────
const PulseRing = () => (
  <>
    {[1, 2, 3].map(i => (
      <div key={i} style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '2px solid rgba(74,222,128,0.6)',
        animation: `micPulse 1.5s ${i * 0.3}s ease-out infinite`,
        pointerEvents: 'none',
      }} />
    ))}
    <style>{`@keyframes micPulse { 0% { transform:scale(1); opacity:0.8; } 100% { transform:scale(2.2); opacity:0; } }`}</style>
  </>
);

// ── Waveform ──────────────────────────────────────────────────
const Waveform = () => (
  <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 20 }}>
    {[0,1,2,3,4].map(i => (
      <div key={i} style={{ width: 3, borderRadius: 2, background: '#4ade80', animation: `wave 0.8s ${i*0.12}s ease-in-out infinite alternate` }} />
    ))}
    <style>{`@keyframes wave { from { height:4px; opacity:0.4; } to { height:18px; opacity:1; } }`}</style>
  </div>
);

// ── Typing dots ───────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: 'flex', gap: 5, padding: '4px 0', alignItems: 'center' }}>
    {[0,1,2].map(i => (
      <div key={i} style={{ width:7, height:7, borderRadius:'50%', background: theme.sage, animation:`chatBounce 1.2s ${i*0.18}s ease-in-out infinite` }} />
    ))}
    <style>{`@keyframes chatBounce { 0%,80%,100% { transform:translateY(0); opacity:0.4; } 40% { transform:translateY(-7px); opacity:1; } }`}</style>
  </div>
);

// ── Message bubble ────────────────────────────────────────────
const Bubble = ({ msg, onSpeak, isSpeaking }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems:'flex-end', gap:8, animation:'bubbleIn 0.25s ease both' }}>
      {!isUser && (
        <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#1a5c32,#2d6a3f)', border:'1px solid rgba(74,222,128,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, marginBottom:2 }}>🌿</div>
      )}

      <div style={{ maxWidth:'78%', position:'relative' }}>
        <div style={{
          padding: isUser ? '11px 16px' : '14px 18px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
          background: isUser ? `linear-gradient(135deg, ${theme.leaf}, ${theme.clay})` : 'rgba(255,255,255,0.06)',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.09)',
          color: theme.cream,
          boxShadow: isUser ? '0 4px 16px rgba(45,106,63,0.3)' : 'none',
        }}>
          {isUser
            ? <div style={{ fontSize:14, lineHeight:1.7 }}>{msg.text}</div>
            : <div>{renderMarkdown(msg.text)}</div>
          }
          {msg.error && (
            <div style={{ fontSize:11, color: theme.alert, marginTop:6, opacity:0.8 }}>⚠ {msg.error}</div>
          )}
        </div>

        {!isUser && window.speechSynthesis && (
          <button onClick={() => onSpeak(msg.text)} title={isSpeaking ? 'Stop' : 'Listen'} style={{
            position:'absolute', bottom:-8, right:8,
            width:24, height:24, borderRadius:'50%',
            background: isSpeaking ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${isSpeaking ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.15)'}`,
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:10, color:'#86efac', transition:'all 0.2s',
          }}>
            {isSpeaking ? '⏹' : '🔊'}
          </button>
        )}
      </div>

      {isUser && (
        <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#4ade80,#86efac)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'#0e1a0f', marginBottom:2 }}>K</div>
      )}
    </div>
  );
};

// ── Main Chatbot ──────────────────────────────────────────────
const Chatbot = () => {
  const [msgs, setMsgs]               = useState([{ role:'bot', text:'Namaste! 🌱 Main hoon KisanGPT — aapka AI farming assistant.\n\nMujhse poochh sakte hain:\n• Fasal ki bimari aur ilaaj\n• Fertilizer aur NPK recommendations\n• Mausam aur sinchai ki salah\n• Sarkari yojanaen (PM-KISAN, etc.)\n• Mandi bhav aur bechne ka sahi waqt\n\nHindi, English, Marathi — kisi bhi bhasha mein baat karein! 🎤 Voice button se bolkar bhi poochh sakte hain!' }]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [voiceLang, setVoiceLang]     = useState('hi-IN');
  const bottomRef                     = useRef();
  const inputRef                      = useRef();

  const { listening, transcript, supported, startListening, stopListening, setTranscript } = useSpeechRecognition(voiceLang);

  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, loading]);

  const quickQuestions = [
    'टमाटर में लेट ब्लाइट का इलाज?',
    'Rice NPK recommendation',
    'PM-KISAN yojana kya hai?',
    'Wheat mein aphid attack',
    'Organic fertilizer options',
    'Drip irrigation ke fayde',
  ];

  const send = async (text = input) => {
    const q = (typeof text === 'string' ? text : input).trim();
    if (!q || loading) return;
    stopListening();
    window.speechSynthesis?.cancel();
    setSpeakingIdx(null);
    setInput('');
    setTranscript('');
    if (inputRef.current) { inputRef.current.style.height = 'auto'; inputRef.current.focus(); }
    const updatedMsgs = [...msgs, { role:'user', text:q }];
    setMsgs(updatedMsgs);
    setLoading(true);
    try {
      const reply = await sendKisanMessage(q, updatedMsgs);
      setMsgs(m => [...m, { role:'bot', text:reply }]);
    } catch (err) {
      setMsgs(m => [...m, { role:'bot', text:'Maafi chahta hoon, abhi jawab dene mein takleef ho rahi hai. Thodi der baad dobara try karein.', error: err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    if (listening) {
      stopListening();
      setTimeout(() => { if (inputRef.current?.value?.trim()) send(inputRef.current.value); }, 300);
    } else {
      startListening();
    }
  };

  const handleSpeak = (text, idx) => {
    if (speakingIdx === idx) { window.speechSynthesis?.cancel(); setSpeakingIdx(null); return; }
    window.speechSynthesis?.cancel();
    setSpeakingIdx(idx);
    const utt = new SpeechSynthesisUtterance(text.replace(/\*\*/g,'').replace(/\*/g,'').replace(/`/g,''));
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.startsWith('hi'));
    if (hindiVoice) utt.voice = hindiVoice;
    utt.rate = 0.92;
    utt.onend = () => setSpeakingIdx(null);
    window.speechSynthesis.speak(utt);
  };

  const langOptions = [
    { code:'hi-IN', label:'हिन्दी' },
    { code:'en-IN', label:'English' },
    { code:'mr-IN', label:'मराठी' },
    { code:'pa-IN', label:'ਪੰਜਾਬੀ' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 160px)', gap:0 }}>

      <div style={{ marginBottom:12, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ color:theme.wheat, fontFamily:"'Playfair Display', serif", fontSize:28, marginBottom:4 }}>KisanGPT — फसल का दोस्त</h2>
          <p style={{ color:theme.mist, opacity:0.7, fontSize:13 }}>Powered by Groq · Type or 🎤 speak your question</p>
        </div>
        {supported && (
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:11, color:'rgba(200,230,201,0.45)' }}>Voice:</span>
            <div style={{ display:'flex', gap:4 }}>
              {langOptions.map(l => (
                <button key={l.code} onClick={() => setVoiceLang(l.code)} style={{
                  padding:'4px 10px', borderRadius:999, fontSize:11, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s',
                  background: voiceLang === l.code ? 'rgba(74,222,128,0.18)' : 'transparent',
                  border: `1px solid ${voiceLang === l.code ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: voiceLang === l.code ? '#86efac' : 'rgba(200,230,201,0.45)',
                }}>{l.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
        {quickQuestions.map((q,i) => (
          <button key={i} onClick={() => send(q)} disabled={loading} style={{
            padding:'6px 13px', borderRadius:999, border:`1px solid ${theme.earth}`,
            background:'transparent', color:theme.sage, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily:'inherit', fontSize:12, transition:'all 0.18s', opacity: loading ? 0.5 : 1,
          }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.background=`${theme.leaf}22`; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
          >{q}</button>
        ))}
      </div>

      <Card style={{ flex:1, overflowY:'auto', padding:'20px 16px', marginBottom:12, display:'flex', flexDirection:'column', gap:14, scrollbarWidth:'thin', scrollbarColor:`${theme.earth} transparent` }}>
        {msgs.map((m,i) => <Bubble key={i} msg={m} onSpeak={(t) => handleSpeak(t,i)} isSpeaking={speakingIdx===i} />)}
        {loading && (
          <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#1a5c32,#2d6a3f)', border:'1px solid rgba(74,222,128,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🌿</div>
            <div style={{ padding:'11px 16px', borderRadius:'4px 18px 18px 18px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)' }}><TypingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </Card>

      {listening && (
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:10, padding:'8px 14px', marginBottom:8, animation:'bubbleIn 0.2s ease both' }}>
          <Waveform />
          <span style={{ fontSize:13, color:'#86efac', flex:1 }}>{transcript || 'Listening... please speak now'}</span>
          <span style={{ fontSize:11, color:'rgba(134,239,172,0.5)' }}>Tap mic again to send</span>
        </div>
      )}

      <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
        <textarea
          ref={inputRef} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
          placeholder={listening ? '🎤 Listening... speak now' : 'Koi bhi farming sawaal poochhen... (Enter to send)'}
          rows={1}
          style={{
            flex:1, background: listening ? 'rgba(74,222,128,0.05)' : 'rgba(255,248,238,0.06)',
            border:`1px solid ${listening ? 'rgba(74,222,128,0.4)' : theme.earth}`,
            borderRadius:12, padding:'12px 16px', color:theme.cream, fontFamily:'inherit', fontSize:14,
            outline:'none', resize:'none', lineHeight:1.5, maxHeight:120, overflowY:'auto', transition:'all 0.2s',
          }}
          onInput={e => { e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,120)+'px'; }}
        />
        {supported && (
          <div style={{ position:'relative', flexShrink:0 }}>
            {listening && <PulseRing />}
            <button onClick={handleMicClick} title={listening ? 'Stop & send' : 'Speak your question'} style={{
              width:46, height:46, borderRadius:'50%',
              background: listening ? 'linear-gradient(135deg,#166534,#15803d)' : 'rgba(255,255,255,0.07)',
              border:`1px solid ${listening ? 'rgba(74,222,128,0.6)' : 'rgba(255,255,255,0.15)'}`,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, transition:'all 0.2s', boxShadow: listening ? '0 0 20px rgba(74,222,128,0.3)' : 'none',
              position:'relative', zIndex:1,
            }}>{listening ? '⏹' : '🎤'}</button>
          </div>
        )}
        <Btn icon="send" onClick={() => send()} loading={loading} disabled={!input.trim() || loading} />
      </div>

      {!supported && (
        <p style={{ fontSize:11, color:'rgba(200,230,201,0.3)', marginTop:6, textAlign:'center' }}>
          Voice not supported in this browser. Use Chrome or Edge.
        </p>
      )}

      <style>{`
        @keyframes bubbleIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default Chatbot;