import React, { useState, useRef, useEffect } from 'react';

import { X, GitBranch, Terminal, Cpu } from 'lucide-react';
import { projects } from '../data/portfolioData';
import { motion, useInView } from 'framer-motion';

const GithubSVG = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const STACK_ICONS = {
  'Java':             '/icon/java.png',
  'PHP':              '/icon/php.png',
  'JavaScript':       '/icon/js.png',
  'SQL':              '/icon/db.png',
  'Spring Boot':      '/icon/sb.png',
  'Magento 2':        '/icon/mg2.png',
  'Laravel':          '/icon/l.png',
  'REST APIs':        '/icon/rest.png',
  'React.js':         '/icon/rjs.png',
  'Alpine.js':        '/icon/ap.png',
  'Tailwind CSS':     '/icon/tw.png',
  'MySQL':            '/icon/mysql.png',
  'Oracle':           '/icon/or.png',
  'MVC':              '/icon/mvc.png',
  'SOLID Principles': '/icon/sp.png',
  'RBAC':             '/icon/rbac.png',
  'JWT Auth':         '/icon/jwt.png',
  'SaaS Design':      '/icon/saas.png',
  'EAV':              '/icon/eav.png',
  'GitHub':           '/icon/gh.png',
  'Git':              '/icon/vc.png',
  'Postman':          '/icon/pm.png',
  'Composer':         '/icon/c.png',
  'Linux CLI':        '/icon/lx.png',
};

/* ── Build-status arc ── */
function StatusArc({ pct = 92, color = 'var(--green-neon)' }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={36} height={36} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={18} cy={18} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
      <circle
        cx={18} cy={18} r={r}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dasharray 1.2s ease' }}
      />
      <text
        x={18} y={18}
        textAnchor="middle" dominantBaseline="central"
        fill={color}
        fontSize={7}
        fontFamily="JetBrains Mono, monospace"
        style={{ transform: 'rotate(90deg)', transformOrigin: '18px 18px' }}
      >{pct}%</text>
    </svg>
  );
}

/* ── Tilt card wrapper ── */
function TiltCard({ children, className, style, onClick }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, willChange: 'transform', transition: 'transform 0.12s ease' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ── Glitch text ── */
function GlitchText({ text, hovered, style }) {
  return (
    <span
      className={hovered ? 'glitch-active' : ''}
      data-text={text}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      {text}
    </span>
  );
}

/* ── Corner brackets ── */
function Corners({ visible }) {
  const s = {
    position: 'absolute',
    width: 14, height: 14,
    borderColor: 'var(--green-neon)',
    borderStyle: 'solid',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.2s ease',
  };
  return (
    <>
      <span style={{ ...s, top: 0, left: 0, borderWidth: '1.5px 0 0 1.5px' }} />
      <span style={{ ...s, top: 0, right: 0, borderWidth: '1.5px 1.5px 0 0' }} />
      <span style={{ ...s, bottom: 0, left: 0, borderWidth: '0 0 1.5px 1.5px' }} />
      <span style={{ ...s, bottom: 0, right: 0, borderWidth: '0 1.5px 1.5px 0' }} />
    </>
  );
}

/* ── Project Drawer ── */
function ProjectDrawer({ project, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,11,20,0.92)', backdropFilter: 'blur(8px)' ,zIndex:9999}}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl overflow-hidden"
        style={{
          background: 'var(--base-800)',
          border: '1px solid rgba(57,255,136,0.3)',
          boxShadow: '0 0 80px rgba(57,255,136,0.1), 0 40px 80px rgba(0,0,0,0.6)',
          animation: 'drawer-in 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ background: 'var(--base-700)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <Terminal size={13} style={{ color: 'var(--green-neon)', flexShrink: 0 }} />
            <span className="font-mono text-sm truncate" style={{ color: 'var(--text-primary)' }}>{project.path}</span>
          </div>
          <div className="flex items-center gap-3 ml-3">
            <StatusArc pct={project.buildPct ?? 94} />
            <button onClick={onClose} className="p-1.5 rounded" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            ><X size={15} /></button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: '75vh' }}>
          <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}># README.md</p>
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
          <p className="font-mono text-sm mb-4" style={{ color: 'var(--green-neon)' }}>{project.subtitle}</p>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)', maxWidth: 560 }}>{project.description}</p>

          <p className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>## Features</p>
          <ul className="space-y-1.5 mb-5">
            {project.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--green-neon)', marginTop: 2, flexShrink: 0 }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>## Technologies</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.stack.map((t, i) => (
              <div key={t} className="flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  background: 'rgba(57,255,136,0.07)',
                  border: '1px solid rgba(57,255,136,0.2)',
                  animation: `badge-pop 0.3s ease ${i * 0.04}s both`,
                }}
              >
                {STACK_ICONS[t] && <img src={STACK_ICONS[t]} alt={t} width={13} height={13} style={{ borderRadius: 3 }} />}
                <span className="font-mono text-xs" style={{ color: 'var(--green-neon)' }}>{t}</span>
              </div>
            ))}
          </div>

          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm px-4 py-2 rounded-lg transition-all"
            style={{ color: 'var(--text-primary)', background: 'var(--base-700)', border: '1px solid var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-neon)'; e.currentTarget.style.color = 'var(--green-neon)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            <GithubSVG size={15} /> View on GitHub
          </a>
        </div>
      </div>
      <style>{`
        @keyframes drawer-in { from { opacity:0; transform:scale(0.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes badge-pop { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
      `}</style>
    </div>
  );
}

/* ── Repo Card ── */
function RepoCard({ project, index }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [badgesVisible, setBadgesVisible] = useState(false);

  useEffect(() => {
    if (hovered) {
      const t = setTimeout(() => setBadgesVisible(true), 60);
      return () => clearTimeout(t);
    } else {
      setBadgesVisible(false);
    }
  }, [hovered]);

  const accent = index % 3 === 0 ? 'var(--green-neon)' : index % 3 === 1 ? 'var(--cyan)' : '#a78bfa';
  const accentRgb = index % 3 === 0 ? '57,255,136' : index % 3 === 1 ? '0,207,255' : '167,139,250';

  return (
    <>
      <TiltCard
        className="reveal-scale"
        data-delay={index * 60}
        style={{
          position: 'relative',
          borderRadius: 12,
          overflow: 'visible',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Corner brackets */}
        <Corners visible={hovered} />

        {/* Holographic sheen layer */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 12, pointerEvents: 'none', zIndex: 3,
          background: hovered
            ? 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.04) 0%, transparent 60%)'
            : 'none',
          transition: 'background 0.1s',
        }} />

        {/* Card shell */}
        <div style={{
          background: 'var(--base-800)',
          border: `1px solid ${hovered ? `rgba(${accentRgb},0.5)` : 'var(--border)'}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: hovered
            ? `0 0 0 1px rgba(${accentRgb},0.15), 0 20px 50px rgba(0,0,0,0.4), 0 0 40px rgba(${accentRgb},0.08)`
            : '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Scan line — only on hover */}
          {hovered && (
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 1, zIndex: 2,
              background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.6), transparent)`,
              animation: 'rc-scan 1.6s linear infinite',
              pointerEvents: 'none',
            }} />
          )}

          {/* Header bar */}
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ background: 'var(--base-700)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 min-w-0">
              <Cpu size={11} style={{ color: accent, flexShrink: 0 }} />
              <span className="font-mono text-xs truncate" style={{ color: 'var(--text-muted)' }}>{project.path}</span>
            </div>
            <div className="flex items-center gap-2 ml-2 shrink-0">
              <span className="font-mono px-1.5 py-0.5 rounded"
                style={{ color: accent, background: `rgba(${accentRgb},0.08)`, fontSize: 8, border: `1px solid rgba(${accentRgb},0.2)` }}>
                {project.category}
              </span>
              {/* Traffic lights */}
              <div className="flex gap-1">
                {['#ff5f57','#ffbd2e','#28c840'].map(c => (
                  <span key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col flex-1">
            {/* Title + arc */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <GlitchText
                text={project.name}
                hovered={hovered}
                style={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: hovered ? accent : 'var(--text-primary)',
                  transition: 'color 0.2s',
                }}
              />
              <StatusArc pct={project.buildPct ?? 90 + index} color={accent} />
            </div>

            <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{project.subtitle}</p>

            <p className="text-sm leading-relaxed mb-4 flex-1"
              style={{
                color: 'var(--text-secondary)',
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
              {project.description}
            </p>

            {/* Animated stack badges */}
            <div className="flex flex-wrap gap-1.5 mb-4" style={{ minHeight: 28 }}>
              {project.stack.map((t, i) => (
                <div key={t}
                  className="flex items-center gap-1 rounded-full px-2 py-0.5"
                  style={{
                    background: badgesVisible ? `rgba(${accentRgb},0.07)` : 'var(--base-600)',
                    border: `1px solid ${badgesVisible ? `rgba(${accentRgb},0.25)` : 'var(--border)'}`,
                    transition: `background 0.2s ${i * 0.04}s, border-color 0.2s ${i * 0.04}s`,
                  }}
                >
                  {STACK_ICONS[t] && <img src={STACK_ICONS[t]} alt={t} width={10} height={10} style={{ borderRadius: 2 }} />}
                  <span className="font-mono" style={{ color: badgesVisible ? accent : 'var(--text-secondary)', fontSize: 10, transition: `color 0.2s ${i * 0.04}s` }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Terminal file tree */}
            <div className="font-mono text-xs mb-4 space-y-0.5 overflow-hidden"
              style={{
                maxHeight: hovered ? 60 : 0,
                opacity: hovered ? 1 : 0,
                transition: 'max-height 0.3s ease, opacity 0.25s ease',
              }}>
              {project.stack.slice(0, 3).map((t, i, arr) => (
                <div key={t} className="flex items-center gap-1">
                  <span style={{ color: 'var(--text-muted)' }}>{i === arr.length - 1 ? '└──' : '├──'}</span>
                  <span style={{ color: accent, opacity: 0.7 }}>{t.toLowerCase().replace(/[\s.]/g, '-')}/</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto">
              <button
                className="font-mono text-xs px-3 py-1.5 rounded-lg flex-1 text-center transition-all"
                style={{
                  color: accent,
                  border: `1px solid rgba(${accentRgb},0.35)`,
                  background: hovered ? `rgba(${accentRgb},0.1)` : `rgba(${accentRgb},0.03)`,
                  letterSpacing: '0.05em',
                }}
                onClick={e => { e.stopPropagation(); setOpen(true); }}
              >
                {hovered ? `> README.md` : `[ README ]`}
              </button>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg transition-all shrink-0"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', background: 'var(--base-700)' }}
                onClick={e => e.stopPropagation()}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <GithubSVG size={12} /> GitHub
              </a>
            </div>
          </div>
        </div>
      </TiltCard>

      {open && <ProjectDrawer project={project} onClose={() => setOpen(false)} />}
    </>
  );
}

/* ── Section ── */
export default function RepositoryCards() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section id="projects" className="p-5 sm:p-20 relative" ref={ref}>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10">
        <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px', letterSpacing: '0.15em' }}>projects/</span>
        <h2 className="text-3xl font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>Repositories</h2>
        <div className="mt-2 h-px w-12" style={{ background: 'var(--green-neon)' }} />
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Hover to inspect · click to open README
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p, i) => <RepoCard key={p.id} project={p} index={i} />)}
      </motion.div>

      <style>{`
        @keyframes rc-scan {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* Glitch effect */
        .glitch-active::before,
        .glitch-active::after {
          content: attr(data-text);
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 100%;
          clip: rect(0, 0, 0, 0);
        }
        .glitch-active::before {
          color: var(--cyan);
          animation: glitch-1 0.4s steps(2) infinite;
        }
        .glitch-active::after {
          color: #a78bfa;
          animation: glitch-2 0.4s steps(2) infinite;
        }
        @keyframes glitch-1 {
          0%   { clip: rect(2px, 9999px, 6px, 0);  transform: translate(-1px, 0); }
          25%  { clip: rect(14px, 9999px, 18px, 0); transform: translate(1px, 0); }
          50%  { clip: rect(8px, 9999px, 12px, 0);  transform: translate(-1px, 0); }
          75%  { clip: rect(20px, 9999px, 24px, 0); transform: translate(1px, 0); }
          100% { clip: rect(2px, 9999px, 6px, 0);   transform: translate(0, 0); }
        }
        @keyframes glitch-2 {
          0%   { clip: rect(18px, 9999px, 22px, 0); transform: translate(1px, 0); }
          25%  { clip: rect(4px, 9999px, 8px, 0);   transform: translate(-1px, 0); }
          50%  { clip: rect(22px, 9999px, 26px, 0); transform: translate(1px, 0); }
          75%  { clip: rect(10px, 9999px, 14px, 0); transform: translate(-1px, 0); }
          100% { clip: rect(18px, 9999px, 22px, 0); transform: translate(0, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .glitch-active::before,
          .glitch-active::after { display: none; }
        }
      `}</style>
    </section>
  );
}