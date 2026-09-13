import { useEffect, useRef, useState } from 'react';
import { skills } from '../data/portfolioData';
import { motion, useInView } from 'framer-motion';

/* ─── Icon map ─────────────────────────────────────── */
const ICONS = {
  'Java':         '/icon/java.png',
  'PHP':          '/icon/php.png',
  'JavaScript':   '/icon/js.png',
  'SQL':          '/icon/db.png',
  'Spring Boot':  '/icon/sb.png',
  'Magento 2':    '/icon/mg2.png',
  'Laravel':      '/icon/l.png',
  'REST APIs':    '/icon/rest.png',
  'React.js':     '/icon/rjs.png',
  'Alpine.js':    '/icon/ap.png',
  'Tailwind CSS': '/icon/tw.png',
  'MySQL':        '/icon/mysql.png',
  'Oracle':       '/icon/or.png',
  'MVC' :         '/icon/mvc.png', 
  'SOLID Principles': '/icon/sp.png',
  'RBAC':         '/icon/rbac.png',
  'JWT Auth':     '/icon/jwt.png',
  'SaaS Design':  '/icon/saas.png',
  'EAV':          '/icon/eav.png',
  'GitHub':       '/icon/gh.png',
  'Git':          '/icon/vc.png',
  'Postman':      '/icon/pm.png',
  'Composer':     '/icon/c.png',
  'Linux CLI':    '/icon/lx.png',
};

/* ─── Category meta ─────────────────────────────────── */
const CAT = {
  Languages:    { color: '#39FF88', glow: 'rgba(57,255,136,0.18)',  dim: 'rgba(57,255,136,0.06)',  border: 'rgba(57,255,136,0.22)',  tag: 'lang',     proficiency: 88 },
  Backend:      { color: '#00CFFF', glow: 'rgba(0,207,255,0.18)',   dim: 'rgba(0,207,255,0.06)',   border: 'rgba(0,207,255,0.22)',   tag: 'service',  proficiency: 92 },
  Frontend:     { color: '#20E878', glow: 'rgba(32,232,120,0.18)',  dim: 'rgba(32,232,120,0.06)',  border: 'rgba(32,232,120,0.22)', tag: 'ui',       proficiency: 78 },
  Databases:    { color: '#00D97E', glow: 'rgba(0,217,126,0.18)',   dim: 'rgba(0,217,126,0.06)',   border: 'rgba(0,217,126,0.22)',  tag: 'db',       proficiency: 82 },
  Architecture: { color: '#64B4FF', glow: 'rgba(100,180,255,0.15)', dim: 'rgba(100,180,255,0.05)', border: 'rgba(100,180,255,0.2)', tag: 'pattern',  proficiency: 75 },
  Tools:        { color: '#B8A0FF', glow: 'rgba(184,160,255,0.15)', dim: 'rgba(184,160,255,0.05)', border: 'rgba(184,160,255,0.2)', tag: 'devtools', proficiency: 85 },
};

/* ─── Animated progress bar ─────────────────────────── */
function ProgressBar({ pct, color, animate }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(pct), 120);
      return () => clearTimeout(t);
    }
  }, [animate, pct]);

  return (
    <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
      <div style={{
        height: '100%',
        width: `${width}%`,
        background: `linear-gradient(90deg, ${color}, ${color}aa)`,
        borderRadius: 2,
        transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 0 6px ${color}88`,
      }} />
    </div>
  );
}

/* ─── Single skill row ──────────────────────────────── */
function SkillRow({ skill, color, dim, border, idx, visible }) {
  const icon = ICONS[skill];
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShow(true), idx * 70);
    return () => clearTimeout(t);
  }, [visible, idx]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '5px 8px',
      borderRadius: 6,
      opacity: show ? 1 : 0,
      transform: show ? 'translateX(0)' : 'translateX(-8px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      cursor: 'default',
      background: 'transparent',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = dim; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {/* install dot */}
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color, opacity: 0.7, flexShrink: 0 }}>+</span>
      {icon
        ? <img src={icon} alt={skill} width={20} height={20} style={{ borderRadius: 3, flexShrink: 0 }} />
        : <span style={{ width: 20, height: 20, borderRadius: 3, background: dim, border: `1px solid ${border}`, flexShrink: 0, display: 'inline-block' }} />
      }
      <span className='text-xs sm:text-xs' style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)', flexGrow: 1 }}>{skill}</span>
    </div>
  );
}

/* ─── Category card ─────────────────────────────────── */
function CategoryCard({ category, items, meta, cardIdx }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // IntersectionObserver — trigger install animation once in view
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delay = cardIdx * 60;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(145deg, var(--base-700) 0%, var(--base-800) 100%)`
          : 'var(--base-800)',
        border: `1px solid ${hovered ? meta.border : 'var(--border)'}`,
        borderRadius: 12,
        padding: 0,
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms, border-color 0.2s, background 0.2s`,
        boxShadow: hovered ? `0 0 28px ${meta.glow}, 0 8px 32px rgba(0,0,0,0.4)` : '0 2px 12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
      }}
    >
      {/* ── Card header ── */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: `1px solid ${hovered ? meta.border : 'var(--border)'}`,
        background: hovered ? meta.dim : 'transparent',
        transition: 'background 0.2s, border-color 0.2s',
      }}>
        {/* top row: tag + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* module tag */}
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 8,
              letterSpacing: '0.06em',
              color: meta.color,
              background: meta.dim,
              border: `1px solid ${meta.border}`,
              borderRadius: 4,
              padding: '2px 7px',
              flexShrink: 0,
            }}>
              @xavier/{meta.tag}
            </span>
          </div>
          {/* version badge */}
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8,
            color: 'var(--text-muted)',
          }}>
            v{items.length}.0.0
          </span>
        </div>

        {/* category name */}
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          fontWeight: 600,
          color: hovered ? meta.color : 'var(--text-primary)',
          transition: 'color 0.2s',
          marginBottom: 2,
          letterSpacing: '-0.01em',
        }}>{category}</p>

        {/* proficiency bar */}
        <ProgressBar pct={meta.proficiency} color={meta.color} animate={visible} />

        {/* proficiency label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'var(--text-muted)' }}>proficiency</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: meta.color }}>{meta.proficiency}%</span>
        </div>
      </div>

      {/* ── Install list ── */}
      <div style={{ padding: '10px 8px', flexGrow: 1 }}>
        {/* terminal prompt line */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 8,
          color: 'var(--text-muted)',
          padding: '2px 8px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <span style={{ color: meta.color, opacity: 0.6 }}>$</span>
          <span>npm install</span>
          <span style={{ color: meta.color, opacity: 0.5 }}>--save</span>
        </div>

        {items.map((skill, i) => (
          <SkillRow
            key={skill}
            skill={skill}
            color={meta.color}
            dim={meta.dim}
            border={meta.border}
            idx={i}
            visible={visible}
          />
        ))}

        {/* added N packages */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 8,
          color: 'var(--text-muted)',
          padding: '6px 8px 2px',
          marginTop: 4,
          borderTop: `1px solid ${hovered ? meta.border : 'var(--border)'}`,
          transition: 'border-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <span style={{ color: meta.color }}>✓</span>
          <span>added <span style={{ color: meta.color }}>{items.length}</span> packages</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating icons ticker ─────────────────────────── */
function IconTicker() {
  const allIcons = Object.entries(ICONS);
  // duplicate for seamless loop
  const doubled = [...allIcons, ...allIcons];

  return (
    <div style={{
      overflow: 'hidden',
      position: 'relative',
      marginTop: 32,
      background: 'var(--base-800)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '14px 0',
    }}>
      {/* fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg, var(--base-800), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(-90deg, var(--base-800), transparent)', zIndex: 2, pointerEvents: 'none' }} />

      {/* ticker header */}
      <div style={{ padding: '0 16px 10px', borderBottom: '1px solid var(--border)', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          // ALL_MODULES · <span style={{ color: 'var(--green-neon)' }}>{Object.values(skills).flat().length} packages</span> · <span style={{ color: 'var(--cyan)' }}>{Object.keys(skills).length} namespaces</span>
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'var(--green-neon)' }}>● installed</span>
      </div>

      {/* scrolling row */}
      <div style={{ display: 'flex', animation: 'ticker-scroll 22s linear infinite', width: 'max-content' }}>
        {doubled.map(([label, icon], i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: '0 20px', flexShrink: 0,
          }}>
            <div style={{
              width: 40, height: 40,
              background: 'var(--base-700)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <img src={icon} alt={label} width={24} height={24} style={{ borderRadius: 5 }} />
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────── */
export default function SkillsMap() {
  return (
    <section
      id="skills" className="p-5 sm:p-20 relative " >
      {/* ── Header ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            skills.config
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
          dependency<span style={{ color: 'var(--green-neon)' }}>.</span>tree
        </h2>
        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, color: 'var(--text-secondary)', maxWidth: 420 }}>
          Production stack — every module battle-tested across real client projects.
        </p>
      </div>

      {/* ── Card grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: 16,
      }}>
        {Object.entries(skills).map(([category, items], i) => (
          <CategoryCard
            key={category}
            category={category}
            items={items}
            meta={CAT[category] || CAT.Tools}
            cardIdx={i}
          />
        ))}
      </div>

      {/* ── All-icons ticker ── */}
      <IconTicker />
    </section>
  );
}