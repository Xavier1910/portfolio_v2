import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Check, Send } from 'lucide-react';
import { profile } from '../data/portfolioData';
import { motion, useInView } from 'framer-motion';

/* ── Laser SVG Icons ── */
function LaserIcon({ path, viewBox = "0 0 24 24", size = 20, color = 'var(--green-neon)', speed = 1.8 }) {
  const id = useRef(`laser-${Math.random().toString(36).slice(2)}`).current;
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Static dim path */}
      <path d={path} stroke={color} strokeWidth="1.2" strokeOpacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Laser runner */}
      <path
        d={path}
        stroke={`url(#${id}-grad)`}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
        style={{
          strokeDasharray: '8 100',
          animation: `laser-run ${speed}s linear infinite`,
        }}
      />
    </svg>
  );
}

const GITHUB_PATH = "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z";
const LINKEDIN_PATH = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const MAIL_PATH = "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6";
const CLIPBOARD_PATH = "M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z";
const CLIPBOARD_CHECK_PATH = "M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0 M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z";

/* ── Typewriter effect ── */
function Typewriter({ text, speed = 38 }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span>
      {shown}
      {shown.length < text.length && (
        <span style={{ display: 'inline-block', width: 2, height: '0.85em', background: 'var(--green-neon)', marginLeft: 1, verticalAlign: 'text-bottom', animation: 'cc-blink 0.7s step-end infinite' }} />
      )}
    </span>
  );
}

/* ── Particle burst on send ── */
function ParticleBurst({ active }) {
  const particles = Array.from({ length: 8 }, (_, i) => i);
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 10 }}>
      {particles.map(i => {
        const angle = (i / 8) * 360;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 4, height: 4,
            borderRadius: '50%',
            background: 'var(--green-neon)',
            boxShadow: '0 0 6px var(--green-neon)',
            animation: `cc-particle 0.7s ease-out ${i * 0.04}s forwards`,
            '--angle': `${angle}deg`,
          }} />
        );
      })}
    </div>
  );
}

/* ── Channel link card ── */
function ChannelCard({ href, icon, label, sublabel, color = 'var(--green-neon)', colorRgb = '57,255,136', delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      className="reveal-left"
      data-delay={delay}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        borderRadius: 10,
        background: hov ? `rgba(${colorRgb},0.07)` : 'var(--base-800)',
        border: `1px solid ${hov ? `rgba(${colorRgb},0.45)` : 'var(--border)'}`,
        textDecoration: 'none',
        transform: hov ? 'translateX(5px)' : 'translateX(0)',
        boxShadow: hov ? `0 0 24px rgba(${colorRgb},0.08)` : 'none',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 8, flexShrink: 0,
        background: `rgba(${colorRgb},0.08)`,
        border: `1px solid rgba(${colorRgb},0.2)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: hov ? color : 'var(--text-primary)', fontWeight: 500, transition: 'color 0.2s' }}>{label}</p>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{sublabel}</p>
      </div>
      <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: hov ? color : 'var(--text-muted)', transition: 'color 0.2s, transform 0.2s', transform: hov ? 'translateX(0)' : 'translateX(-4px)', opacity: hov ? 1 : 0 }}>→</div>
    </a>
  );
}

/* ── Animated input ── */
function Field({ label, type = 'text', value, onChange, placeholder, rows, focused, onFocus, onBlur, color = 'var(--green-neon)', colorRgb = '57,255,136' }) {
  const isFocused = focused;
  const base = {
    width: '100%',
    background: isFocused ? `rgba(${colorRgb},0.03)` : 'var(--base-700)',
    border: `1px solid ${isFocused ? `rgba(${colorRgb},0.5)` : 'var(--border)'}`,
    color: 'var(--text-primary)',
    caretColor: color,
    outline: 'none',
    borderRadius: 8,
    padding: '9px 13px',
    fontSize: 13,
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: isFocused ? `0 0 0 3px rgba(${colorRgb},0.08)` : 'none',
  };
  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
        color: isFocused ? color : 'var(--text-muted)',
        display: 'block', marginBottom: 6,
        transition: 'color 0.2s',
      }}>
        {isFocused ? '▶' : '›'} {label}
      </label>
      {rows ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
          style={{ ...base, resize: 'none', display: 'block' }}
          onFocus={onFocus} onBlur={onBlur} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={base} onFocus={onFocus} onBlur={onBlur} />
      )}
      {/* Glow line under focused input */}
      <div style={{
        position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${colorRgb},0.7), transparent)`,
        opacity: isFocused ? 1 : 0,
        transition: 'opacity 0.3s',
        borderRadius: 1,
      }} />
    </div>
  );
}

/* ── Main component ── */
export default function ContactConsole() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [burst, setBurst] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setBurst(true);
    setTimeout(() => setBurst(false), 800);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="p-5 sm:p-20 relative">

      {/* Header */}
      <div className="reveal-up mb-12">
        <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px', letterSpacing: '0.15em' }}>contact.sh</span>
        <h2 className="text-3xl font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>Connect</h2>
        <div className="mt-2 h-px w-12" style={{ background: 'var(--green-neon)' }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" style={{ alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Status panel */}
          <div className="reveal-left" style={{
            borderRadius: 12,
            background: 'var(--base-800)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Top bar */}
            <div style={{
              padding: '8px 14px',
              background: 'var(--base-700)',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--text-muted)' }}>
                $ connect --developer
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--green-neon)',
                  boxShadow: '0 0 8px var(--green-neon)',
                  animation: 'cc-blink 2s ease-in-out infinite',
                  display: 'inline-block',
                }} />
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--green-neon)' }}>ONLINE</span>
              </div>
            </div>

            <div style={{ padding: '18px 16px' }}>
              {/* Typewriter bio */}
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                <Typewriter text="Open to backend / full-stack engineering roles and freelance projects. Got a question, a project, or just want to say hi — reach out." speed={22} />
              </p>

              {/* Email row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--base-700)', border: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(57,255,136,0.08)', border: '1px solid rgba(57,255,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LaserIcon path={MAIL_PATH} size={16} color="var(--green-neon)" speed={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--text-muted)', marginBottom: 2 }}>email</p>
                  <a href={`mailto:${profile.email}`} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--text-primary)', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--green-neon)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  >{profile.email}</a>
                </div>
                <button onClick={copyEmail} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'var(--green-neon)' : 'var(--text-muted)', transition: 'color 0.2s', padding: 4 }}>
                  {copied
                    ? <LaserIcon path={CLIPBOARD_CHECK_PATH} viewBox="0 0 16 16" size={16} color="var(--green-neon)" speed={1.4} />
                    : <LaserIcon path={CLIPBOARD_PATH}       viewBox="0 0 16 16" size={16} color="var(--text-muted)"  speed={1.8} />
                  }
                </button>
              </div>

              {/* Phone row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--base-700)', border: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={14} style={{ color: 'var(--cyan)' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--text-muted)', marginBottom: 2 }}>phone</p>
                  <a href={`tel:${profile.phone}`} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--text-primary)', textDecoration: 'none' }}>{profile.phone}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Channel cards */}
          <ChannelCard
            href={profile.github}
            icon={<LaserIcon path={GITHUB_PATH} size={18} color="var(--green-neon)" speed={2} />}
            label="GitHub"
            sublabel="@xavier1910"
            color="var(--green-neon)"
            colorRgb="57,255,136"
            delay={60}
          />
          <ChannelCard
            href={profile.linkedin}
            icon={<LaserIcon path={LINKEDIN_PATH} size={18} color="var(--cyan)" speed={1.5} />}
            label="LinkedIn"
            sublabel="xavier-fsd"
            color="var(--cyan)"
            colorRgb="0,207,255"
            delay={120}
          />
          <ChannelCard
            href={`mailto:${profile.email}`}
            icon={<LaserIcon path={MAIL_PATH} size={18} color="#a78bfa" speed={2.2} />}
            label="Email"
            sublabel={profile.email}
            color="#a78bfa"
            colorRgb="167,139,250"
            delay={180}
          />
        </div>

        {/* ── Right: form ── */}
        <div className="reveal-up" data-delay={100}>
          <div style={{
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--base-800)',
            border: '1px solid var(--border)',
            position: 'relative',
          }}>
            {/* Form header */}
            <div style={{
              padding: '8px 14px',
              background: 'var(--base-700)',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--text-muted)' }}>$ send_message</span>
              <div style={{ display: 'flex', gap: 5 }}>
                {['#ff5f57','#ffbd2e','#28c840'].map(c => (
                  <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
                ))}
              </div>
            </div>

            {/* Scan line */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 1, zIndex: 2,
              background: 'linear-gradient(90deg, transparent, rgba(57,255,136,0.3), transparent)',
              animation: 'cc-scan 3s linear infinite',
              pointerEvents: 'none',
              top: 36,
            }} />

            <form onSubmit={handleSubmit} style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
              {[
                { key: 'name',    label: '--name',    placeholder: 'Your name',      type: 'text'  },
                { key: 'email',   label: '--email',   placeholder: 'your@email.com', type: 'email' },
                { key: 'subject', label: '--subject', placeholder: 'Subject line',   type: 'text'  },
              ].map(({ key, label, placeholder, type }) => (
                <Field
                  key={key}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  focused={focused === key}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused('')}
                />
              ))}

              <Field
                label="--message"
                placeholder="Your message..."
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                focused={focused === 'message'}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused('')}
              />

              {/* Submit */}
              <div style={{ position: 'relative' }}>
                <ParticleBurst active={burst} />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    borderRadius: 10,
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.25s ease',
                    position: 'relative', overflow: 'hidden',
                    background: sent
                      ? 'rgba(57,255,136,0.1)'
                      : 'linear-gradient(135deg, var(--green-neon) 0%, rgba(0,207,255,0.8) 100%)',
                    color: sent ? 'var(--green-neon)' : 'var(--base-950)',
                    border: sent ? '1px solid rgba(57,255,136,0.4)' : 'none',
                    boxShadow: sent ? 'none' : '0 0 30px rgba(57,255,136,0.25)',
                  }}
                  onMouseEnter={e => { if (!sent) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(57,255,136,0.35)'; } }}
                  onMouseLeave={e => { if (!sent) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(57,255,136,0.25)'; } }}
                >
                  {/* Button sweep shimmer */}
                  {!sent && (
                    <span style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                      animation: 'cc-sweep 2.5s ease-in-out infinite',
                    }} />
                  )}
                  {sent ? <><Check size={14} /> MESSAGE QUEUED</> : <><Send size={14} /> SEND MESSAGE</>}
                </button>
              </div>

              {sent && (
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>
                  ✓ transmission received · connect a backend to route to inbox
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes laser-run {
          0%   { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 0;   }
        }
        @keyframes cc-scan {
          0%   { top: 36px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%;  opacity: 0; }
        }
        @keyframes cc-blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        @keyframes cc-sweep {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%);  }
          100% { transform: translateX(100%);  }
        }
        @keyframes cc-particle {
          0%   { opacity: 1; transform: translate(-50%,-50%) rotate(var(--angle)) translateX(0); }
          100% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--angle)) translateX(40px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  );
}