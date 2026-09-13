import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { profile, skills, projects } from '../data/portfolioData';
import ProfileBlob from './ProfileBlob';

/* ── Animation variants ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── TypeLine ─────────────────────────────────────────────────────── */
function TypeLine({ text, delay = 0, speed = 55, onDone, color }) {
  const spanRef   = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;
    let idx = 0;
    let ivId;
    const tid = setTimeout(() => {
      ivId = setInterval(() => {
        idx++;
        span.textContent = text.slice(0, idx);
        if (idx >= text.length) { clearInterval(ivId); onDoneRef.current?.(); }
      }, speed);
    }, delay);
    return () => { clearTimeout(tid); clearInterval(ivId); };
  }, [text, delay, speed]);

  return (
    <span style={color ? { color } : {}}>
      <span ref={spanRef} />
      <span className="blink" />
    </span>
  );
}

/* ── RoleCycler ───────────────────────────────────────────────────── */
function RoleCycler({ roles }) {
  const spanRef  = useRef(null);
  const stateRef = useRef({ roleIdx: 0, charIdx: 0, typing: true, pauseUntil: 0 });

  useEffect(() => {
    const span = spanRef.current;
    if (!span || !roles.length) return;
    const id = setInterval(() => {
      const s = stateRef.current, now = Date.now();
      if (s.pauseUntil && now < s.pauseUntil) return;
      s.pauseUntil = 0;
      const role = roles[s.roleIdx];
      if (s.typing) {
        s.charIdx++;
        span.textContent = role.slice(0, s.charIdx);
        if (s.charIdx >= role.length) { s.typing = false; s.pauseUntil = now + 1800; }
      } else {
        if (s.charIdx > 0) { s.charIdx--; span.textContent = role.slice(0, s.charIdx); }
        else { s.roleIdx = (s.roleIdx + 1) % roles.length; s.typing = true; }
      }
    }, 40);
    return () => clearInterval(id);
  }, [roles]);

  return <span style={{ color: 'var(--green-neon)' }}><span ref={spanRef} /><span className="blink" /></span>;
}

/* ── SkillBar ─────────────────────────────────────────────────────── */
function SkillBar({ label, pct, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 400);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="font-mono text-[10px]" style={{ color: 'var(--green-neon)' }}>{pct}%</span>
      </div>
      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--base-600)' }}>
        <div className="h-full rounded-full" style={{
          width: `${width}%`,
          background: 'linear-gradient(90deg,var(--green-neon),var(--cyan))',
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 8px rgba(57,255,136,0.5)',
        }} />
      </div>
    </div>
  );
}

/* ── GitLog ───────────────────────────────────────────────────────── */
const GIT_LOGS = [
  { hash: 'a91f3c2', msg: 'feat: Magento 2 RMA extension',     time: '2h ago',  color: 'var(--green-neon)' },
  { hash: 'b72e1d9', msg: 'fix: EAV query optimization -30%',  time: '1d ago',  color: '#00CFFF'           },
  { hash: 'c44f8a1', msg: 'feat: Alpine.js UI components',     time: '3d ago',  color: '#FEBC2E'           },
  { hash: 'd31c2b7', msg: 'refactor: REST API auth layer',     time: '5d ago',  color: 'var(--green-neon)' },
];

function GitLog() {
  return (
    <div className="space-y-1 mt-2">
      {GIT_LOGS.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="flex items-center gap-2 py-[3px]"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span className="font-mono text-[11px] shrink-0" style={{ color: l.color }}>{l.hash}</span>
          <span className="font-mono text-[11px] grow truncate" style={{ color: 'var(--text-secondary)' }}>{l.msg}</span>
          <span className="font-mono text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>{l.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Tab bar ──────────────────────────────────────────────────────── */
const TABS = [
  { id: 'terminal', label: 'terminal.sh', icon: '❯' },
  { id: 'skills',   label: 'skills.json', icon: '{}' },
  { id: 'git',      label: 'git log',     icon: '⎇'  },
];

function TabBar({ active, onSelect }) {
  return (
    <div className="flex overflow-x-auto" style={{ background: 'var(--base-950)', borderBottom: '1px solid var(--border)' }}>
      {TABS.map(t => (
        <motion.button
          key={t.id}
          onClick={() => onSelect(t.id)}
          whileTap={{ scale: 0.96 }}
          className="font-mono text-xs px-3 py-2 shrink-0 border-none cursor-pointer transition-colors"
          style={{
            background: active === t.id ? 'var(--base-800)' : 'transparent',
            color: active === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: `2px solid ${active === t.id ? 'var(--green-neon)' : 'transparent'}`,
          }}
        >
          <span className="mr-1">{t.icon}</span>{t.label}
        </motion.button>
      ))}
    </div>
  );
}

const TOP_SKILLS = [
  { label: 'Magento 2',   pct: 85 },
  { label: 'MySQL',       pct: 90 },
  { label: 'PHP',         pct: 82 },
  { label: 'React.js',    pct: 78 },
  { label: 'Spring Boot', pct: 80 },
];

/* ── Main ─────────────────────────────────────────────────────────── */
export default function HeroTerminal() {
  const [phase, setPhase]         = useState(0);
  const [activeTab, setActiveTab] = useState('terminal');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col py-10 px-5 sm:px-20 justify-center overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 50% 45%,rgba(57,255,136,0.04) 0%,transparent 70%)',
      }} />

      <div className="relative z-10 flex flex-col gap-3 w-full mx-auto">

        {/* ── Top status bar ── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg font-mono"
          style={{ background: 'var(--base-900)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs" style={{ color: 'var(--green-neon)' }}>● xavier-fsd@portfolio</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>~</span>
            <span className="text-xs" style={{ color: 'var(--cyan)' }}>main ⎇</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>UTF-8</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>JSX</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Ln 1, Col 1</span>
          </div>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">

          {/* ═══════ LEFT: Terminal panel ═══════ */}
          <motion.div
            custom={0.1}
            variants={fadeLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col gap-3 min-w-0"
          >
            {/* Blob row — mobile only */}
            <div className="flex lg:hidden justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
                style={{ width: 200, height: 200 }}
              >
                <ProfileBlob showBadges={true} />
              </motion.div>
            </div>

            {/* Terminal window */}
            <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'var(--base-800)', border: '1px solid var(--border)' }}>

              {/* Title bar */}
              <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ background: 'var(--base-700)', borderBottom: '1px solid var(--border)' }}>
                <div className="flex gap-1.5">
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#FEBC2E' }} />
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }} />
                </div>
                <span className="flex-1 text-center font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  xavier-fsd — zsh — 80×24
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="pulse-dot" style={{ width: 5, height: 5 }} />
                  <span className="font-mono text-[10px]" style={{ color: 'var(--green-neon)' }}>ACTIVE</span>
                </div>
              </div>

              <TabBar active={activeTab} onSelect={setActiveTab} />

              {/* ── terminal tab ── */}
              {activeTab === 'terminal' && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 font-mono text-xs sm:text-[13px] min-h-[220px]"
                >
                  <div className="flex gap-2 items-start">
                    <span className="shrink-0 font-bold" style={{ color: 'var(--green-neon)' }}>❯</span>
                    <TypeLine text="whoami" delay={200} speed={65} onDone={() => setTimeout(() => setPhase(1), 200)} />
                  </div>

                  {phase >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="mt-3 pl-3"
                      style={{ borderLeft: '2px solid rgba(57,255,136,0.35)' }}
                    >
                      <p className="font-mono font-bold leading-tight" style={{ fontSize: 'clamp(18px,3vw,26px)', color: 'var(--text-primary)' }}>
                        {profile.name}
                      </p>
                      <p className="font-mono mt-1 text-xs" style={{ color: 'var(--green-neon)' }}>
                        {profile.title} @ EWall Solutions Pvt. Ltd.
                      </p>
                      <div className="mt-2 flex flex-col gap-1">
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--green-neon)' }}>→</span> Building scalable backend systems</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--cyan)' }}>→</span> Magento 2 · Spring Boot · React</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--green-neon)' }}>→</span> End-to-end feature lifecycle ownership</p>
                      </div>
                    </motion.div>
                  )}

                  {phase >= 1 && (
                    <div className="flex gap-2 items-start mt-4">
                      <span className="shrink-0 font-bold" style={{ color: 'var(--green-neon)' }}>❯</span>
                      <TypeLine text="./view-work --all" delay={1100} speed={60} onDone={() => setPhase(2)} />
                    </div>
                  )}

                  {phase >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="pl-4 mt-2"
                    >
                      {[
                        `Found ${profile.stats.projects} repositories`,
                        `${profile.stats.experience} yr professional experience`,
                        'Available for opportunities',
                      ].map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                          className="text-xs leading-[1.9]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <span style={{ color: 'var(--green-neon)' }}>✓</span> {line}
                        </motion.p>
                      ))}
                      <div className="flex gap-2 mt-3">
                        <span className="font-bold" style={{ color: 'var(--green-neon)' }}>❯</span>
                        <span className="blink" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── skills tab ── */}
              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 font-mono text-xs min-h-[220px]"
                >
                  <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>{'// skills.json — Xavier Akash M'}</p>
                  <pre className="text-sm mb-0" style={{ color: 'var(--cyan)' }}>{'{'}</pre>
                  {Object.entries(skills).map(([cat, items], ci) => (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: ci * 0.06, duration: 0.3 }}
                      className="pl-4 text-[11px] leading-relaxed"
                    >
                      <span style={{ color: '#FEBC2E' }}>"{cat}"</span>
                      <span style={{ color: 'var(--text-muted)' }}>: [</span>
                      <span style={{ color: 'var(--green-neon)' }}>{items.map(i => `"${i}"`).join(', ')}</span>
                      <span style={{ color: 'var(--text-muted)' }}>]{ci < Object.keys(skills).length - 1 ? ',' : ''}</span>
                    </motion.div>
                  ))}
                  <pre className="text-sm mt-0" style={{ color: 'var(--cyan)' }}>{'}'}</pre>
                  <div className="mt-4">
                    <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>{'// proficiency'}</p>
                    {TOP_SKILLS.map((s, i) => <SkillBar key={s.label} label={s.label} pct={s.pct} delay={i * 120} />)}
                  </div>
                </motion.div>
              )}

              {/* ── git log tab ── */}
              {activeTab === 'git' && (
                <motion.div
                  key="git"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 font-mono text-xs min-h-[220px]"
                >
                  <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>{'$ git log --oneline --graph'}</p>
                  <GitLog />
                  <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(57,255,136,0.04)', border: '1px solid rgba(57,255,136,0.1)' }}>
                    <p className="text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>{'$ git status'}</p>
                    <p className="text-[11px]" style={{ color: 'var(--green-neon)' }}>On branch main · working tree clean ✓</p>
                  </div>
                  <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.1)' }}>
                    <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>{'$ git shortlog -sn'}</p>
                    {projects.slice(0, 3).map((p, i) => (
                      <div key={i} className="flex justify-between text-[11px] leading-relaxed">
                        <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                        <span style={{ color: 'var(--cyan)' }}>{p.stack.slice(0, 2).join(' · ')}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Window status bar */}
              <div className="flex items-center justify-end gap-4 px-3 py-1.5 shrink-0" style={{ background: 'var(--base-950)', borderTop: '1px solid var(--border)' }}>
                <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>React 19</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Vite</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--cyan)' }}>● Live</span>
              </div>
            </div>

            {/* CTA buttons */}
            <motion.div
              custom={0.35}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="flex flex-row gap-3 flex-wrap"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-mono text-xs font-bold no-underline"
                style={{ background: 'var(--green-neon)', color: 'var(--base-950)' }}
              >
                View Projects →
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, y: -2, background: 'rgba(57,255,136,0.10)', borderColor: 'var(--green-neon)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-mono text-xs no-underline"
                style={{ color: 'var(--green-neon)', border: '1px solid rgba(57,255,136,0.35)', background: 'rgba(57,255,136,0.04)' }}
              >
                Get In Touch
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ═══════ RIGHT: Identity panel ═══════ */}
          <motion.div
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="hidden lg:flex flex-col gap-3"
          >
            {/* Blob */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ width: 300, height: 300, flexShrink: 0 }}>
                <ProfileBlob showBadges={true} />
              </div>
            </motion.div>

            {/* ROLE cycler */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.45 }}
              className="rounded-xl px-4 py-3"
              style={{ background: 'var(--base-800)', border: '1px solid var(--border)' }}
            >
              <p className="font-mono text-[9px] mb-1.5 tracking-wider" style={{ color: 'var(--text-muted)' }}>ROLE.current</p>
              <p className="font-mono text-sm min-h-[1.5em]">
                <RoleCycler roles={profile.roles} />
              </p>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: profile.stats.experience, label: 'Yrs Exp' },
                { val: profile.stats.projects,   label: 'Projects' },
                { val: profile.stats.cgpa,       label: 'CGPA' },
              ].map(({ val, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45 + i * 0.07, duration: 0.4 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(57,255,136,0.35)' }}
                  className="rounded-xl py-3 px-2 text-center"
                  style={{ background: 'var(--base-800)', border: '1px solid var(--border)', cursor: 'default' }}
                >
                  <p className="font-mono font-bold text-lg" style={{ color: 'var(--green-neon)' }}>{val}</p>
                  <p className="font-mono text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </motion.div>
              ))}
            </div>

            {/* System status */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.45 }}
              className="rounded-xl px-4 py-3 relative overflow-hidden"
              style={{ background: 'var(--base-800)', border: '1px solid var(--border)' }}
            >
              <div className="scan-line" />
              <p className="font-mono text-[9px] mb-3 tracking-wider" style={{ color: 'var(--text-muted)' }}>SYSTEM STATUS</p>
              {[
                { label: 'CPU_FOCUS',  val: '94%', color: 'var(--green-neon)' },
                { label: 'COFFEE_LVL', val: '61%', color: '#FEBC2E' },
                { label: 'BUG_COUNT',  val: '0',   color: 'var(--cyan)' },
              ].map(({ label, val, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.65 + i * 0.07, duration: 0.3 }}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span className="font-mono text-[10px] font-bold" style={{ color }}>{val}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Mobile-only role + stats strip ── */}
        <div className="flex lg:hidden flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="rounded-xl px-4 py-3"
            style={{ background: 'var(--base-800)', border: '1px solid var(--border)' }}
          >
            <p className="font-mono text-[9px] mb-1 tracking-wider" style={{ color: 'var(--text-muted)' }}>ROLE.current</p>
            <p className="font-mono text-sm min-h-[1.5em]"><RoleCycler roles={profile.roles} /></p>
          </motion.div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: profile.stats.experience, label: 'Yrs Exp' },
              { val: profile.stats.projects,   label: 'Projects' },
              { val: profile.stats.cgpa,       label: 'CGPA' },
            ].map(({ val, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.35 }}
                className="rounded-xl py-3 px-2 text-center"
                style={{ background: 'var(--base-800)', border: '1px solid var(--border)' }}
              >
                <p className="font-mono font-bold text-lg" style={{ color: 'var(--green-neon)' }}>{val}</p>
                <p className="font-mono text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
