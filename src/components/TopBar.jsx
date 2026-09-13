import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolioData';
import { Menu, X } from 'lucide-react';

const GITHUB_PATH = "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z";
const LINKEDIN_PATH = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
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

const FILE_PATHS = {
  hero:       'portfolio/src/profile.ts',
  experience: 'portfolio/src/experience.json',
  skills:     'portfolio/src/skills.config',
  projects:   'portfolio/src/projects/',
  education:  'portfolio/src/education.md',
  terminal:   'portfolio/src/terminal.sh',
  contact:    'portfolio/src/contact.sh',
};

export default function TopBar({ activeSection, mobileNavOpen, onToggleMobileNav }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-2 sm:px-4"
      style={{
        height: 'var(--topbar-h)',
        background: 'var(--base-900)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3">
        <motion.button
          className="lg:hidden flex items-center justify-center w-7 h-7 rounded"
          style={{
            background: mobileNavOpen ? 'rgba(57,255,136,0.1)' : 'transparent',
            border: '1px solid var(--border)',
            color: mobileNavOpen ? 'var(--green-neon)' : 'var(--text-secondary)',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          onClick={onToggleMobileNav}
          whileTap={{ scale: 0.92 }}
          aria-label="Toggle navigation"
          aria-expanded={mobileNavOpen}
        >
          <motion.span
            key={mobileNavOpen ? 'x' : 'menu'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {mobileNavOpen ? <X size={13} /> : <Menu size={13} />}
          </motion.span>
        </motion.button>

        <div className="relative flex items-center justify-center w-14" style={{ height: 'var(--topbar-h)'}}>
          <img src="/logo.png" alt="" style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
              }} />
        </div>
        <span className="font-mono text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>xavier-fsd@devos</span>
      </div>

      {/* Center — file path with layout animation on section change */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 font-mono text-xs hidden sm:block"
        style={{ color: 'var(--text-secondary)', maxWidth: '40vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        <motion.span
          key={activeSection}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <span style={{ color: 'var(--text-muted)' }}>~/</span>
          <span>{FILE_PATHS[activeSection] || FILE_PATHS.hero}</span>
        </motion.span>
      </motion.div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span>
        <motion.a
          href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
          whileHover={{ scale: 1.2, color: 'var(--green-neon)' }}
          style={{ color: 'var(--text-muted)' }}
        >
          <LaserIcon path={GITHUB_PATH} size={20} color="var(--green-neon)" speed={2} />
        </motion.a>
        </span>
        <span>
        <motion.a
          href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
          whileHover={{ scale: 1.2, color: 'var(--cyan)' }}
          style={{ color: 'var(--text-muted)' }}
        >
          <LaserIcon path={LINKEDIN_PATH} size={20} color="var(--cyan)" speed={1.5} />
        </motion.a>
        </span>
        <span>
        <motion.a
            href={`mailto:${profile.email}`}
            whileHover={{ background: 'rgba(57,255,136,0.1)', scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="font-mono text-xs px-3 py-1.5 rounded"
            style={{ color: 'var(--green-neon)', border: '1px solid rgba(57,255,136,0.4)' }}
          >
          HIRE
        </motion.a>
        </span>
      </div>
    </motion.header>
  );
}
