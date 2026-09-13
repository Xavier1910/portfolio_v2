import { useEffect, useRef, useState } from 'react';

const CLIP_PATHS = [
  'polygon(50% 0%, 80% 10%, 100% 35%, 95% 65%, 75% 95%, 45% 100%, 15% 85%, 0% 55%, 10% 20%, 30% 5%)',
  'polygon(55% 0%, 85% 15%, 95% 45%, 85% 75%, 60% 100%, 30% 98%, 5% 75%, 0% 45%, 15% 15%, 35% 2%)',
  'polygon(45% 2%, 78% 5%, 100% 30%, 98% 62%, 78% 92%, 48% 100%, 18% 90%, 2% 60%, 5% 28%, 25% 5%)',
  'polygon(52% 1%, 82% 12%, 98% 40%, 92% 70%, 70% 96%, 40% 100%, 12% 82%, 2% 52%, 12% 22%, 32% 4%)',
];

const BADGES = [
  { label: 'Spring Boot', icon: '/icon/sb.png',      angle: -40 },
  { label: 'React',       icon: '/icon/rjs.png',     angle: 0   },
  { label: 'Magento 2',   icon: '/icon/mg2.png',     angle: 70  },
  { label: 'MySQL',       icon: '/icon/mysql.png',  angle: 140 },
  { label: 'PHP',         icon: '/icon/php.png',     angle: 210 },
  { label: 'Java',        icon: '/icon/java.png',    angle: 270 },
];

/**
 * ProfileBlob — fully relative sizing.
 * Wrap in a sized container; the blob fills it.
 * Pass showBadges=false to hide orbit badges (used on mobile).
 */
export default function ProfileBlob({ showBadges = true }) {
  const [clipIdx, setClipIdx] = useState(0);
  const blobRef  = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const xRef     = useRef(null);
  const yRef     = useRef(null);

  // Morph clip-path
  useEffect(() => {
    const t = setInterval(() => setClipIdx(i => (i + 1) % CLIP_PATHS.length), 3200);
    return () => clearInterval(t);
  }, []);

  // Mouse parallax — ref only, zero setState
  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const mx = (e.clientX - cx) / cx * 6;
      const my = (e.clientY - cy) / cy * 6;
      mouseRef.current = { x: mx, y: my };
      if (blobRef.current) blobRef.current.style.transform = `translate(${mx}px,${my}px)`;
      if (xRef.current) xRef.current.textContent = `x: ${mx.toFixed(1)}`;
      if (yRef.current) yRef.current.textContent = `y: ${my.toFixed(1)}`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Badge radius scales with showBadges flag
  const r = 42; // percent of container — keeps badges inside

  return (
    <div className="relative flex items-center justify-center w-full h-full" aria-hidden="true">

      {/* Glow halo */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(57,255,136,0.08) 0%, transparent 70%)',
        animation: 'bp-pulse 4s ease-in-out infinite',
      }} />

      {/* Outer dashed ring */}
      {showBadges && (
        <div className="absolute pointer-events-none" style={{
          width: '96%', height: '96%',
          border: '1px dashed rgba(57,255,136,0.15)',
          borderRadius: '50%',
          animation: 'bp-spin 28s linear infinite',
        }} />
      )}

      {/* Blob — 68% of container size, centred */}
      <div
        ref={blobRef}
        style={{
          position: 'relative',
          width: '68%', height: '68%',
          clipPath: CLIP_PATHS[clipIdx],
          transition: 'clip-path 3.2s cubic-bezier(0.4,0,0.2,1)',
          willChange: 'transform',
          background: 'linear-gradient(135deg,#101C2B 0%,#142235 60%,#0B1624 100%)',
          boxShadow: '0 0 0 1.5px rgba(57,255,136,0.3), 0 0 36px rgba(57,255,136,0.1)',
          overflow: 'hidden',
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(57,255,136,0.04) 1px, transparent 1px),linear-gradient(90deg,rgba(57,255,136,0.04) 1px,transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        {/* Sheen */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(57,255,136,0.09) 0%,transparent 45%,rgba(0,207,255,0.05) 100%)' }} />
        {/* Scan line */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(57,255,136,0.4),transparent)', animation: 'bp-scan 3s linear infinite' }} />

        {/* Hero image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/hero.png"
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
          </div>

        {/* Bottom label */}
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: '5px 8px', background: 'linear-gradient(0deg,rgba(5,11,20,0.95) 0%,transparent 100%)' }}>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(6px,1.5cqw,8px)', color: 'rgba(57,255,136,0.7)', textAlign: 'center', letterSpacing: '0.1em' }}>xavier-fsd · junior-dev</p>
        </div>
      </div>

      {/* Floating badges — orbit by % so they stay in bounds */}
      {showBadges && BADGES.map((badge, i) => {
        const rad = (badge.angle * Math.PI) / 180;
        const bx  = 50 + Math.cos(rad) * r;
        const by  = 50 + Math.sin(rad) * r;
        return (
          <div key={badge.label} style={{
            position: 'absolute',
            left: `${bx}%`, top: `${by}%`,
            transform: 'translate(-50%,-50%)',
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--base-800)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '3px 8px 3px 5px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            zIndex: 10,
            animation: `bp-float ${2.4 + i * 0.3}s ease-in-out ${i * 0.18}s infinite`,
            cursor: 'default',
          }}>
            <img src={badge.icon} alt={badge.label} width={13} height={13} style={{ borderRadius: 3, flexShrink: 0 }} />
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(7px,1.2cqw,9px)', color: 'var(--text-secondary)' }}>{badge.label}</span>
          </div>
        );
      })}

      {/* Coordinate readout */}
      <div className="absolute top-1 left-1 pointer-events-none" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 7, lineHeight: 1.6, zIndex: 20 }}>
        <div ref={xRef} style={{ color: 'rgba(57,255,136,0.35)' }}>x: 0.0</div>
        <div ref={yRef} style={{ color: 'rgba(57,255,136,0.35)' }}>y: 0.0</div>
      </div>
      <div className="absolute bottom-1 right-1 pointer-events-none" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 7, lineHeight: 1.6, zIndex: 20, textAlign: 'right' }}>
        <div style={{ color: 'var(--text-muted)' }}>blob/v3</div>
        <div style={{ color: 'rgba(57,255,136,0.4)' }}>● live</div>
      </div>

      <style>{`
        @keyframes bp-spin  { to { transform: rotate(360deg); } }
        @keyframes bp-pulse { 0%,100%{opacity:.8;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes bp-scan  { 0%{top:-2px} 100%{top:100%} }
        @keyframes bp-float { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-6px)} }
      `}</style>
    </div>
  );
}