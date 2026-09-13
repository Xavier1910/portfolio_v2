import { useEffect, useRef, useState } from 'react';
import { education, certifications } from '../data/portfolioData';
import { motion, useInView } from 'framer-motion';

/* ── Animated SVG branch line ── */
function BranchLine({ color = 'var(--green-neon)', height = 120 }) {
  const pathRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setDrawn(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <svg width="2" height={height} style={{ overflow: 'visible', flexShrink: 0 }}>
      <path
        ref={pathRef}
        d={`M1,0 L1,${height}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        style={{
          transition: drawn ? 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
          strokeDashoffset: drawn ? 0 : undefined,
          opacity: 0.35,
        }}
      />
    </svg>
  );
}

/* ── Commit node dot ── */
function CommitNode({ color = 'var(--green-neon)', size = 12, pulse = false }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {pulse && (
        <span style={{
          position: 'absolute', inset: -4,
          borderRadius: '50%',
          border: `1px solid ${color}`,
          opacity: 0.4,
          animation: 'edu-pulse 2s ease-in-out infinite',
        }} />
      )}
      <div style={{
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 10px ${color}`,
        border: '2px solid var(--base-800)',
      }} />
    </div>
  );
}

/* ── Education entry (big commit) ── */
function EduCommit({ edu, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="reveal-up" data-delay={index * 100}
      style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

      {/* Graph column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
        <CommitNode color="var(--cyan)" size={14} pulse={edu.status === 'COMPLETED'} />
        <BranchLine color="var(--cyan)" height={140} />
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1,
          marginBottom: 24,
          borderRadius: 10,
          overflow: 'hidden',
          background: 'var(--base-800)',
          border: `1px solid ${hovered ? 'rgba(0,207,255,0.45)' : 'var(--border)'}`,
          boxShadow: hovered ? '0 0 30px rgba(0,207,255,0.07), 0 8px 30px rgba(0,0,0,0.3)' : 'none',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Commit hash bar */}
        <div style={{
          padding: '6px 14px',
          background: 'var(--base-700)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--text-muted)' }}>
              commit <span style={{ color: 'var(--cyan)' }}>{edu.hash ?? `a${index}f3c9d`}</span>
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 8,
              color: 'var(--green-neon)',
              background: 'rgba(57,255,136,0.1)',
              border: '1px solid rgba(57,255,136,0.25)',
              padding: '1px 7px', borderRadius: 20,
            }}>{edu.status}</span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--text-muted)' }}>
            {edu.period}
          </span>
        </div>

        <div style={{ padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* Icon */}
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: 'rgba(0,207,255,0.07)',
            border: '1px solid rgba(0,207,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>🎓</div>

          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 3 }}>
              {edu.degree}
            </p>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)', marginBottom: 10 }}>
              {edu.institution}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
                color: 'var(--text-secondary)',
                background: 'var(--base-700)',
                border: '1px solid var(--border)',
                padding: '3px 10px', borderRadius: 20,
              }}>📅 {edu.period}</span>
              <span style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
                color: 'var(--green-neon)',
                background: 'rgba(57,255,136,0.07)',
                border: '1px solid rgba(57,255,136,0.25)',
                padding: '3px 10px', borderRadius: 20,
              }}>★ {edu.grade}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Cert badge (flip card) ── */
function CertBadge({ cert, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="reveal-up" data-delay={index * 70}
      style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

      {/* Graph column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
        <CommitNode color="var(--green-neon)" size={10} />
        {index < certifications.length - 1 && <BranchLine color="var(--green-neon)" height={72} />}
      </div>

      {/* Flip card */}
      <div
        style={{ flex: 1, marginBottom: 12, perspective: 600, cursor: 'pointer' }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <div style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
          transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
          height: 64,
        }}>
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: 10,
            background: 'var(--base-800)',
            border: '1px solid var(--border)',
            padding: '10px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(57,255,136,0.07)',
                border: '1px solid rgba(57,255,136,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>📜</div>
              <div>
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--text-muted)', marginBottom: 2 }}>
                  tag: verified-cert
                </p>
                <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{cert.name}</p>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
              fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
              color: 'var(--green-neon)',
              background: 'rgba(57,255,136,0.08)',
              border: '1px solid rgba(57,255,136,0.3)',
              padding: '4px 10px', borderRadius: 20,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--green-neon)',
                boxShadow: '0 0 6px var(--green-neon)',
                animation: 'edu-pulse 2s ease-in-out infinite',
                display: 'inline-block',
              }} />
              VERIFIED
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(57,255,136,0.08) 0%, rgba(0,207,255,0.06) 100%)',
            border: '1px solid rgba(57,255,136,0.35)',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'var(--text-muted)', marginBottom: 4 }}>issuer</p>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: 'var(--cyan)', fontWeight: 600 }}>{cert.issuer}</p>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--text-muted)', textAlign: 'right' }}>
              <div style={{ color: 'var(--green-neon)', fontSize: 18, marginBottom: 2 }}>✓</div>
              <div>credential<br/>confirmed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section ── */
export default function EducationLog() {
  return (
    <section id="education" className="p-5 sm:p-20 relative"
      style={{ paddingLeft: 'max(1.25rem, calc(var(--sidebar-w) + 1.5rem))' }}>

      {/* Header */}
      <div className="reveal-up mb-12">
        <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px', letterSpacing: '0.15em' }}>
          git log --author=xavier
        </span>
        <h2 className="text-3xl font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>
          Education & Certifications
        </h2>
        <div className="mt-2 h-px w-12" style={{ background: 'var(--green-neon)' }} />
      </div>

      <div style={{ maxWidth: 640 }}>

        {/* Education commits */}
        {education.map((edu, i) => (
          <EduCommit key={i} edu={edu} index={i} />
        ))}

        {/* Branch label for certs */}
        <div className="reveal-up" style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: 14, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 1, height: 20,
              background: 'linear-gradient(to bottom, var(--cyan), var(--green-neon))',
              opacity: 0.4,
            }} />
          </div>
          <span style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
            color: 'var(--text-muted)', letterSpacing: '0.1em',
          }}>
            branch: <span style={{ color: 'var(--green-neon)' }}>verified-packages</span>
          </span>
        </div>

        {/* Cert badges */}
        {certifications.map((cert, i) => (
          <CertBadge key={i} cert={cert} index={i} />
        ))}

      </div>

      <style>{`
        @keyframes edu-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}