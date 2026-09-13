import { useState, useRef, useEffect, useCallback } from 'react';
import { profile, experience, skills, projects, education, certifications } from '../data/portfolioData';

const GEMINI_KEY = import.meta.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_CONTEXT = `You are Xavier's AI terminal assistant embedded in his developer portfolio.
You ONLY answer questions about Xavier Akash M — his skills, projects, experience, education, and contact info.
If asked anything unrelated to Xavier or his portfolio, respond with: "I only know about Xavier's portfolio. Try asking about his skills, projects, or experience."
Be concise, developer-friendly, and slightly witty. Use plain text only (no markdown).

Name: ${profile.name} | Handle: ${profile.handle} | Role: ${profile.title} | Location: ${profile.location}
Email: ${profile.email} | Phone: ${profile.phone} | GitHub: ${profile.github} | LinkedIn: ${profile.linkedin}
Available: ${profile.available ? 'YES — Open to opportunities' : 'NO'}
Summary: ${profile.summary}
Roles: ${profile.roles.join(', ')}
Stats: ${profile.stats.experience} yrs experience · ${profile.stats.projects} projects · CGPA ${profile.stats.cgpa}
Skills: ${Object.entries(skills).map(([cat, items]) => `${cat}: ${items.join(', ')}`).join('\n')}
Experience: ${experience.map(e => `${e.role} @ ${e.company} (${e.period})\nStack: ${e.stack.join(', ')}\n${e.changes.map(c => `- ${c}`).join('\n')}`).join('\n\n')}
Projects: ${projects.map((p, i) => `${i + 1}. ${p.name} — ${p.subtitle}\n   Stack: ${p.stack.join(', ')}\n   ${p.description}\n   GitHub: ${p.github}`).join('\n\n')}
Education: ${education.map(e => `${e.degree} | ${e.institution} | ${e.period} | ${e.grade}`).join('\n')}
Certifications: ${certifications.map(c => `- ${c.name} (${c.issuer})`).join('\n')}`;

// ─── Static Commands ──────────────────────────────────────────────────────────
const STATIC_COMMANDS = {
  help: () => `AVAILABLE COMMANDS
──────────────────────────────────────────────
  about        — Developer identity & summary
  skills       — Full technology stack
  experience   — Work history & commits
  projects     — Project repositories
  education    — Degrees & certifications
  contact      — Contact information
  stack        — Quick stack overview
  whoami       — Short intro
  clear        — Clear terminal (Ctrl+L)

EASTER EGGS — click or type to trigger 👀
──────────────────────────────────────────────
  matrix          — Site-wide matrix rain
  hack            — Hack the mainframe
  neofetch        — System info
  deploy          — Run CI/CD pipeline
  ping xavier     — Latency check
  sudo hire xavier — Grant hire access
  sudo make me a sandwich
  rm -rf /        — Danger zone
  vim             — Good luck escaping
  git blame       — Blame report
  coffee          — Brew xavier.coffee
  disco           — Site-wide disco mode
  party           — Confetti + hire info
  snake           — Play snake (swipe on mobile)
  quiz            — Xavier knowledge quiz
  wordle          — Tech term wordle
  ls -la          — Directory listing
  10x             — Check xavier.exe status
  dark mode       — Toggle darkness
  yolo            — Force push to prod
  stackoverflow   — Classic workflow
  google          — Search results
  it works        — Deploy wisdom
  javascript      — Framework of the week
  who made you    — Origin story
  are you human   — Identity crisis
  hire            — Party mode
  404             — Error page
  exit            — Try to leave
  secret          — ASCII portrait
  cursor trail    — Enable cursor effects
  konami          — ↑↑↓↓←→←→BA`,

  about: () => `${profile.name}
${profile.title} @ EWall Solutions Pvt. Ltd.
Location: ${profile.location}

${profile.summary}`,

  whoami: () => `${profile.name}
Role    : ${profile.title}
Company : EWall Solutions Pvt. Ltd.
Location: ${profile.location}
Status  : ● AVAILABLE FOR OPPORTUNITIES`,

  stack: () => `CURRENT STACK
─────────────
Backend  : Spring Boot · Magento 2 · PHP · Laravel
Frontend : React.js · Alpine.js · Tailwind CSS
Database : MySQL · Oracle
Languages: Java · PHP · JavaScript
Tools    : Git · Postman · Linux CLI`,

  skills: () => Object.entries(skills)
    .map(([cat, items]) => `[${cat.toUpperCase()}]\n  ${items.join(' · ')}`)
    .join('\n\n'),

  experience: () => experience.map(exp =>
    `commit ${exp.hash}\nrole:    ${exp.role}\ncompany: ${exp.company}\nperiod:  ${exp.period}\n\n${exp.changes.map(c => `  + ${c}`).join('\n')}\n\nstack: ${exp.stack.join(' | ')}`
  ).join('\n\n---\n\n'),

  projects: () => projects.map((p, i) =>
    `${String(i + 1).padStart(2, '0')}  ${p.name} (${p.subtitle})\n    stack: ${p.stack.join(', ')}\n    repo:  ${p.github}`
  ).join('\n\n'),

  education: () => education.map(e =>
    `${e.degree}\n${e.institution}\n${e.period}  ·  ${e.grade}`
  ).join('\n') + '\n\nCertifications:\n' + certifications.map(c => `  ✓ ${c.name} — ${c.issuer}`).join('\n'),

  contact: () => `Email   : ${profile.email}
Phone   : ${profile.phone}
GitHub  : ${profile.github}
LinkedIn: ${profile.linkedin}

Status  : ● AVAILABLE FOR OPPORTUNITIES`,
};

// ─── Easter Eggs ──────────────────────────────────────────────────────────────
const EASTER_EGGS = {
  'sudo hire xavier':          { type: 'glitch',   text: '[sudo] password for recruiter: ████████\nChecking credentials...\n✓ Authorization granted.\n✓ Portfolio reviewed.\n✓ Skills verified.\n\n🎉 ACCESS GRANTED — Xavier has been hired!\nRedirecting to contact...', siteEffect: 'confetti' },
  'sudo make me a sandwich':   { type: 'plain',    text: 'Okay.\n\n🥪\n\n(Because you used sudo.)' },
  'rm -rf /':                  { type: 'panic',    text: '' },
  'vim':                       { type: 'vim',      text: '' },
  'git blame':                 { type: 'plain',    text: `git blame report\n─────────────────────────────────\nLine  42: last Tuesday\nLine  97: Mercury retrograde\nLine 103: the cat walked on the keyboard\nLine 156: copy-paste from Stack Overflow\nLine 201: sleep deprivation\nLine 247: ¯\\_(ツ)_/¯\nLine 302: works on my machine™\nLine 401: [object Object]\n\nCommit message: "final final FINAL fix (for real this time)"` },
  'why php':                   { type: 'loading',  text: 'Computing answer', finalText: '...still computing.\n\nSome questions have no answers. 🤷' },
  '10x':                       { type: 'plain',    text: 'xavier.exe is already running at 10x capacity.\nNo upgrade available — ceiling has been removed.' },
  'dark mode':                 { type: 'plain',    text: "You're already in the dark.\nThis IS dark mode.\nThere is no light mode. Light mode is a myth." },
  'ping xavier':               { type: 'ping',     text: '' },
  'neofetch':                  { type: 'neofetch', text: '' },
  'matrix':                    { type: 'matrix',   text: '',  siteEffect: 'matrix' },
  'hack':                      { type: 'hack',     text: '' },
  'disco':                     { type: 'disco',    text: '',  siteEffect: 'disco' },
  'party':                     { type: 'party',    text: '',  siteEffect: 'confetti' },
  'deploy':                    { type: 'deploy',   text: '' },
  'coffee':                    { type: 'plain',    text: `       ( (\n        ) )\n     .______.\n     |      |]\n     \\      /\n      \`----'\n\n   ☕ Brewing xavier.coffee...\n   Caffeine level: MAXIMUM\n   Bug resistance: +42%\n   Focus mode: ACTIVATED` },
  'stackoverflow':             { type: 'plain',    text: 'Opening Stack Overflow...\nSearching: "how to center a div"...\nFinding answer from 2009...\nCopying top answer...\nDone. ✓\n\nShip it. 🚀' },
  'google':                    { type: 'plain',    text: 'Searching Google...\n\nDid you mean: "hire xavier akash"?\n\nShowing results for: hire xavier akash\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✓ linkedin.com/in/xavier-fsd/ — Best result\n✓ github.com/Xavier1910 — Strong candidate\n✓ akashmsm275@gmail.com — Contact now' },
  'it works':                  { type: 'plain',    text: '"It works!"\n\n...but why?\n\nNobody knows.\nDo not touch it.\nDo not look at it.\nDo not think about it.\n\n✓ Deployed to production.' },
  'yolo':                      { type: 'yolo',     text: '' },
  'who made you':              { type: 'plain',    text: 'Xavier Akash M built me to impress you.\n\nIs it working? 👀\n\n(Powered by Gemini AI + a lot of caffeine)' },
  'are you human':             { type: 'plain',    text: 'I am definitely not a Gemini-powered AI assistant.\n\n...okay maybe a little.\n\n🤖 Beep boop.' },
  'hire':                      { type: 'party',    text: '',  siteEffect: 'confetti' },
  '404':                       { type: 'plain',    text: 'Error 404: Talent not found.\n\n...just kidding.\n\nXavier has too much talent to 404.\nTry: sudo hire xavier' },
  'exit':                      { type: 'shake',    text: "Nice try. You can never leave. 😈\n\nThis terminal runs in your soul now." },
  'javascript':                { type: 'plain',    text: `JavaScript framework of the week:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nMon: React    ✓ Xavier uses this\nTue: Vue\nWed: Svelte\nThu: Angular\nFri: new framework released — EVERYTHING OBSOLETE\nSat: rewrite in TypeScript\nSun: rest? lol no. new framework.` },
  'snake':                     { type: 'snake',    text: '' },
  'quiz':                      { type: 'quiz',     text: '' },
  'ls -la':                    { type: 'plain',    text: `total 9001\ndrwxr-xr-x  xavier-brain/\ndrwxr-xr-x  ./skills/java\ndrwxr-xr-x  ./skills/php\ndrwxr-xr-x  ./skills/react\ndrwxr-xr-x  ./projects/socialshe\ndrwxr-xr-x  ./projects/luxelane\ndrwxr-xr-x  ./ideas/         (∞ items)\ndrwxr-xr-x  ./bugs/          (being fixed)\ndrwxr-xr-x  ./coffee/        (empty — CRITICAL)\n-rw-r--r--  resume.pdf       (impressive)\n-rw-r--r--  TODO.txt         (growing daily)\n-rw-r--r--  .hustle          (always on)` },
  'secret':                    { type: 'ascii-portrait', text: '' },
  'wordle':                    { type: 'wordle',   text: '' },
  'cursor trail':              { type: 'cursor-trail', text: '',  siteEffect: 'cursor-trail' },
};

const AUTOCOMPLETE_LIST = [...Object.keys(STATIC_COMMANDS), ...Object.keys(EASTER_EGGS), 'clear'];

// ─── Site Effect Trigger ──────────────────────────────────────────────────────
const triggerSiteEffect = (effect) =>
  window.dispatchEvent(new CustomEvent('site-effect', { detail: effect }));

// ─── Confetti Layer ───────────────────────────────────────────────────────────
function ConfettiLayer() {
  const pieces = Array.from({ length: 60 }, (_, i) => i);
  const colors = ['#39FF88', '#00CFFF', '#FF6B6B', '#FEBC2E', '#FF88FF'];
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      {pieces.map(i => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: -10,
          width: Math.random() * 8 + 4,
          height: Math.random() * 8 + 4,
          borderRadius: Math.random() > 0.5 ? '50%' : 2,
          background: colors[Math.floor(Math.random() * colors.length)],
          animation: `confetti-fall ${Math.random() * 2 + 1.5}s ease-in ${Math.random() * 0.8}s forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }} />
      ))}
    </div>
  );
}

// ─── Matrix Overlay ───────────────────────────────────────────────────────────
function MatrixOverlay() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 14);
    const drops = Array(cols).fill(0);
    const pool = 'アイウエオカキクケコABCDEF0123456789';
    const draw = () => {
      ctx.fillStyle = 'rgba(5,11,20,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#39FF88';
      ctx.font = '13px JetBrains Mono';
      drops.forEach((y, i) => {
        ctx.fillText(pool[Math.floor(Math.random() * pool.length)], i * 14, y);
        drops[i] = y > canvas.height && Math.random() > 0.975 ? 0 : y + 14;
      });
    };
    const t = setInterval(draw, 50);
    return () => clearInterval(t);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[9998] pointer-events-none" style={{ opacity: 0.55 }} />;
}

// ─── Cursor Trail ─────────────────────────────────────────────────────────────
function CursorTrail() {
  useEffect(() => {
    const trails = [];
    const onMove = (e) => {
      const dot = document.createElement('div');
      dot.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:6px;height:6px;border-radius:50%;background:var(--green-neon);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);animation:trail-fade 0.6s ease forwards;`;
      document.body.appendChild(dot);
      trails.push(dot);
      setTimeout(() => dot.remove(), 600);
    };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); trails.forEach(d => d.remove()); };
  }, []);
  return null;
}

// ─── Site Effect Layer (exported for App.jsx) ─────────────────────────────────
export function SiteEffectLayer() {
  const [effect, setEffect] = useState(null);
  useEffect(() => {
    const handler = (e) => {
      setEffect(e.detail);
      const dur = e.detail === 'matrix' ? 5000 : e.detail === 'disco' ? 3000 : e.detail === 'cursor-trail' ? 10000 : 2500;
      setTimeout(() => setEffect(null), dur);
    };
    window.addEventListener('site-effect', handler);
    return () => window.removeEventListener('site-effect', handler);
  }, []);

  if (!effect) return null;
  if (effect === 'confetti') return <ConfettiLayer />;
  if (effect === 'matrix') return <MatrixOverlay />;
  if (effect === 'cursor-trail') return <CursorTrail />;
  if (effect === 'disco') return (
    <div className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ animation: 'disco-flash 0.25s infinite', opacity: 0.06 }} />
  );
  return null;
}

// ─── Ping Output ──────────────────────────────────────────────────────────────
function PingOutput() {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const pings = [
      'PING xavier (127.0.0.1): 56 data bytes',
      '64 bytes from xavier: icmp_seq=0 ttl=∞ time=0.42 ms',
      '64 bytes from xavier: icmp_seq=1 ttl=∞ time=0.39 ms',
      '64 bytes from xavier: icmp_seq=2 ttl=∞ time=0.41 ms',
      '64 bytes from xavier: icmp_seq=3 ttl=∞ time=0.40 ms',
      '\n--- xavier ping statistics ---',
      '4 packets transmitted, 4 received, 0% packet loss',
      'round-trip min/avg/max = 0.39/0.41/0.42 ms',
      '\nConclusion: Xavier responds faster than your API calls. ⚡',
    ];
    pings.forEach((line, i) => setTimeout(() => setLines(prev => [...prev, line]), i * 300));
  }, []);
  return (
    <pre className="text-xs leading-5 whitespace-pre-wrap ml-4"
      style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono,monospace', borderLeft: '1px solid rgba(57,255,136,0.15)', paddingLeft: 10 }}>
      {lines.join('\n')}
    </pre>
  );
}

// ─── Deploy Output ────────────────────────────────────────────────────────────
function DeployOutput() {
  const steps = [
    { t: 0,    text: '$ git push origin main',          color: 'var(--green-neon)' },
    { t: 400,  text: '▶ Running lint...              ✓', color: 'var(--text-secondary)' },
    { t: 900,  text: '▶ Running tests...             ✓', color: 'var(--text-secondary)' },
    { t: 1400, text: '▶ Building production bundle...✓', color: 'var(--text-secondary)' },
    { t: 1900, text: '▶ Uploading artifacts...       ✓', color: 'var(--text-secondary)' },
    { t: 2400, text: '▶ Deploying to production...   ✓', color: 'var(--text-secondary)' },
    { t: 2900, text: '\n🚀 DEPLOYED SUCCESSFULLY',        color: 'var(--green-neon)' },
    { t: 3200, text: 'URL: xavier-portfolio.vercel.app', color: '#00CFFF' },
    { t: 3500, text: "\n\"It works on my machine\" — and now on everyone else's. ✓", color: 'var(--text-muted)' },
  ];
  const [visible, setVisible] = useState([]);
  useEffect(() => { steps.forEach((s, i) => setTimeout(() => setVisible(p => [...p, i]), s.t)); }, []);
  return (
    <div className="ml-4" style={{ borderLeft: '1px solid rgba(57,255,136,0.15)', paddingLeft: 10 }}>
      {steps.map((s, i) => visible.includes(i) && (
        <pre key={i} className="text-xs leading-5" style={{ color: s.color, fontFamily: 'JetBrains Mono,monospace' }}>{s.text}</pre>
      ))}
    </div>
  );
}

// ─── Hack Output ──────────────────────────────────────────────────────────────
function HackOutput() {
  const [phase, setPhase] = useState(0);
  const [chars, setChars] = useState('');
  useEffect(() => {
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
    const interval = setInterval(() => {
      setChars(Array.from({ length: 80 }, () => pool[Math.floor(Math.random() * pool.length)]).join(''));
    }, 50);
    setTimeout(() => { clearInterval(interval); setPhase(1); }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="ml-4" style={{ borderLeft: '1px solid rgba(57,255,136,0.15)', paddingLeft: 10 }}>
      {phase === 0 && <pre className="text-xs leading-4 whitespace-pre-wrap" style={{ color: 'var(--green-neon)', fontFamily: 'JetBrains Mono,monospace', wordBreak: 'break-all' }}>{chars}</pre>}
      {phase === 1 && (
        <pre className="text-xs leading-5" style={{ color: 'var(--green-neon)', fontFamily: 'JetBrains Mono,monospace' }}>
{`Bypassing firewall...      ████████████ DONE
Cracking encryption...     ████████████ DONE
Accessing mainframe...     ████████████ DONE
Downloading portfolio...   ████████████ DONE

╔══════════════════════════════╗
║   ✓  ACCESS GRANTED          ║
║   Xavier's skills: ELITE     ║
║   Hire probability: 100%     ║
╚══════════════════════════════╝`}
        </pre>
      )}
    </div>
  );
}

// ─── Yolo Output ──────────────────────────────────────────────────────────────
function YoloOutput() {
  const steps = [
    { t: 0,    text: '$ git add .',                          c: 'var(--text-secondary)' },
    { t: 400,  text: '$ git commit -m "YOLO"',              c: 'var(--text-secondary)' },
    { t: 800,  text: '$ git push --force origin main',      c: '#FF6B6B' },
    { t: 1200, text: '\nPushing to remote...',              c: 'var(--text-muted)' },
    { t: 1800, text: '⚠ WARNING: 47 files overwritten',     c: '#FEBC2E' },
    { t: 2200, text: '⚠ WARNING: CI/CD pipeline skipped',  c: '#FEBC2E' },
    { t: 2600, text: '⚠ WARNING: Tests? What tests?',       c: '#FEBC2E' },
    { t: 3000, text: '\n✓ Force pushed. YOLO mode complete.', c: 'var(--green-neon)' },
    { t: 3300, text: "(Please don't actually do this. Xavier doesn't. 😬)", c: 'var(--text-muted)' },
  ];
  const [visible, setVisible] = useState([]);
  useEffect(() => { steps.forEach((s, i) => setTimeout(() => setVisible(p => [...p, i]), s.t)); }, []);
  return (
    <div className="ml-4" style={{ borderLeft: '1px solid rgba(255,107,107,0.3)', paddingLeft: 10 }}>
      {steps.map((s, i) => visible.includes(i) && (
        <pre key={i} className="text-xs leading-5" style={{ color: s.c, fontFamily: 'JetBrains Mono,monospace' }}>{s.text}</pre>
      ))}
    </div>
  );
}

// ─── Neofetch Output ──────────────────────────────────────────────────────────
function NeofetchOutput() {
  const g = 'var(--green-neon)', c = '#00CFFF', m = 'var(--text-muted)', s = 'var(--text-secondary)';
  return (
    <div className="ml-4 flex gap-4" style={{ borderLeft: '1px solid rgba(57,255,136,0.15)', paddingLeft: 10, flexWrap: 'wrap' }}>
      <pre style={{ color: g, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, lineHeight: 1.5, flexShrink: 0 }}>
{`██╗  ██╗
╚██╗██╔╝
 ╚███╔╝
 ██╔██╗
██╔╝ ██╗
╚═╝  ╚═╝`}
      </pre>
      <pre style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, lineHeight: 1.8 }}>
        <span style={{ color: g }}>xavier@portfolio</span><span style={{ color: m }}> ~ $ neofetch</span>{'\n'}
        <span style={{ color: c }}>OS</span><span style={{ color: s }}>       : Developer Brain OS v8.99</span>{'\n'}
        <span style={{ color: c }}>Role</span><span style={{ color: s }}>     : Junior Developer → Full Stack</span>{'\n'}
        <span style={{ color: c }}>Company</span><span style={{ color: s }}>  : EWall Solutions Pvt. Ltd.</span>{'\n'}
        <span style={{ color: c }}>Location</span><span style={{ color: s }}> : Chennai, India</span>{'\n'}
        <span style={{ color: c }}>Shell</span><span style={{ color: s }}>    : zsh + caffeine</span>{'\n'}
        <span style={{ color: c }}>Stack</span><span style={{ color: s }}>    : Spring Boot · Magento 2 · React</span>{'\n'}
        <span style={{ color: c }}>CGPA</span><span style={{ color: s }}>     : 8.99 / 10</span>{'\n'}
        <span style={{ color: c }}>Status</span><span style={{ color: s }}>   : ● AVAILABLE FOR OPPORTUNITIES</span>{'\n'}
        <span style={{ color: c }}>Uptime</span><span style={{ color: s }}>   : 1+ year professional dev</span>
      </pre>
    </div>
  );
}

// ─── Panic Output ─────────────────────────────────────────────────────────────
function PanicOutput() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setTimeout(() => setPhase(1), 800);
    setTimeout(() => setPhase(2), 2500);
    setTimeout(() => setPhase(3), 4000);
  }, []);
  return (
    <div className="ml-4" style={{ borderLeft: '1px solid rgba(255,107,107,0.3)', paddingLeft: 10 }}>
      <pre className="text-xs leading-5" style={{ color: '#FF6B6B', fontFamily: 'JetBrains Mono,monospace' }}>
        rm: cannot remove &apos;/&apos;: Permission denied{'\n'}rm: cannot remove &apos;xavier-portfolio&apos;: TOO IMPRESSIVE TO DELETE
      </pre>
      {phase >= 1 && <pre className="text-xs leading-5" style={{ color: '#FEBC2E', fontFamily: 'JetBrains Mono,monospace' }}>{'\n'}⚠ SYSTEM PANIC: Talent level too high for deletion{'\n'}⚠ Shield integrity: 100%{'\n'}⚠ Recovering...</pre>}
      {phase >= 2 && <pre className="text-xs leading-5" style={{ color: 'var(--green-neon)', fontFamily: 'JetBrains Mono,monospace' }}>{'\n'}✓ System restored. Xavier&apos;s portfolio is indestructible. 🛡️</pre>}
    </div>
  );
}

// ─── Snake Game (mobile + desktop) ───────────────────────────────────────────
const COLS = 20, ROWS = 10, CELL = 14;
function SnakeGame({ onClose }) {
  const [snake, setSnake] = useState([[5,5],[4,5],[3,5]]);
  const [food, setFood] = useState([10,5]);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const dirRef = useRef([1,0]);
  const snakeRef = useRef([[5,5],[4,5],[3,5]]);
  const foodRef = useRef([10,5]);
  const scoreRef = useRef(0);
  const touchRef = useRef(null);

  const reset = () => {
    snakeRef.current = [[5,5],[4,5],[3,5]];
    foodRef.current = [10,5];
    scoreRef.current = 0;
    dirRef.current = [1,0];
    setSnake([[5,5],[4,5],[3,5]]);
    setFood([10,5]);
    setScore(0);
    setDead(false);
  };

  const randFood = (s) => {
    let f;
    do { f = [Math.floor(Math.random()*COLS), Math.floor(Math.random()*ROWS)]; }
    while (s.some(([x,y]) => x===f[0] && y===f[1]));
    return f;
  };

  const setDir = (nd) => {
    if (nd[0] !== -dirRef.current[0] || nd[1] !== -dirRef.current[1]) dirRef.current = nd;
  };

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0], w:[0,-1], s:[0,1], a:[-1,0], d:[1,0] };
      const nd = map[e.key];
      if (nd) { setDir(nd); e.preventDefault(); }
      if (e.key === 'r' || e.key === 'R') reset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (dead) return;
    const t = setInterval(() => {
      const s = snakeRef.current, d = dirRef.current;
      const head = [(s[0][0]+d[0]+COLS)%COLS, (s[0][1]+d[1]+ROWS)%ROWS];
      if (s.some(([x,y]) => x===head[0] && y===head[1])) { setDead(true); return; }
      const ate = head[0]===foodRef.current[0] && head[1]===foodRef.current[1];
      const ns = ate ? [head,...s] : [head,...s.slice(0,-1)];
      if (ate) { const nf=randFood(ns); foodRef.current=nf; setFood(nf); scoreRef.current+=10; setScore(scoreRef.current); }
      snakeRef.current = ns; setSnake([...ns]);
    }, 150);
    return () => clearInterval(t);
  }, [dead]);

  const onTouchStart = (e) => { touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? [1,0] : [-1,0]);
    else setDir(dy > 0 ? [0,1] : [0,-1]);
    touchRef.current = null;
  };

  const grid = Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>{
    if(snake[0]?.[0]===x&&snake[0]?.[1]===y) return 'head';
    if(snake.some(([sx,sy])=>sx===x&&sy===y)) return 'body';
    if(food[0]===x&&food[1]===y) return 'food';
    return 'empty';
  }));

  const btnStyle = { width:40,height:40,background:'var(--base-700)',border:'1px solid var(--border)',borderRadius:8,color:'var(--green-neon)',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',userSelect:'none',WebkitUserSelect:'none',touchAction:'manipulation' };

  return (
    <div style={{ fontFamily:'JetBrains Mono,monospace' }}>
      <div style={{ color:'var(--green-neon)',fontSize:10,marginBottom:6,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <span>SNAKE · Score: {score} {dead && '· 💀 GAME OVER'}</span>
        <div style={{ display:'flex',gap:6 }}>
          {dead && <button onClick={reset} style={{ color:'var(--green-neon)',fontSize:9,background:'none',border:'1px solid rgba(57,255,136,0.4)',borderRadius:4,padding:'2px 6px',cursor:'pointer',fontFamily:'inherit' }}>restart</button>}
          <button onClick={onClose} style={{ color:'var(--text-muted)',fontSize:9,background:'none',border:'1px solid var(--border)',borderRadius:4,padding:'2px 6px',cursor:'pointer',fontFamily:'inherit' }}>[close]</button>
        </div>
      </div>
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ border:'1px solid var(--border)',display:'inline-block',lineHeight:1,touchAction:'none',userSelect:'none',overflowX:'auto',maxWidth:'100%' }}>
        {grid.map((row,y) => (
          <div key={y} style={{ display:'flex' }}>
            {row.map((cell,x) => (
              <div key={x} style={{ width:CELL,height:CELL,flexShrink:0,background:cell==='head'?'var(--green-neon)':cell==='body'?'rgba(57,255,136,0.5)':cell==='food'?'#FF6B6B':'transparent' }} />
            ))}
          </div>
        ))}
      </div>
      {/* D-pad */}
      <div style={{ marginTop:10,display:'grid',gridTemplateColumns:'repeat(3,40px)',gridTemplateRows:'repeat(3,40px)',gap:4,width:'fit-content' }}>
        <div /><button style={btnStyle} onTouchStart={e=>{e.preventDefault();setDir([0,-1]);}} onClick={()=>setDir([0,-1])}>↑</button><div />
        <button style={btnStyle} onTouchStart={e=>{e.preventDefault();setDir([-1,0]);}} onClick={()=>setDir([-1,0])}>←</button>
        <div style={{ width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:10 }}>●</div>
        <button style={btnStyle} onTouchStart={e=>{e.preventDefault();setDir([1,0]);}} onClick={()=>setDir([1,0])}>→</button>
        <div /><button style={btnStyle} onTouchStart={e=>{e.preventDefault();setDir([0,1]);}} onClick={()=>setDir([0,1])}>↓</button><div />
      </div>
      <p style={{ color:'var(--text-muted)',fontSize:9,marginTop:6 }}>Swipe on grid · WASD / arrows · R to restart</p>
    </div>
  );
}

// ─── Quiz Game ────────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { q: 'What backend framework does Xavier primarily use?', opts: ['Django','Spring Boot','Express.js','FastAPI'], ans: 1 },
  { q: "What is Xavier's CGPA?", opts: ['7.5','8.5','8.99','9.5'], ans: 2 },
  { q: 'Which e-commerce platform does Xavier specialize in?', opts: ['Shopify','WooCommerce','Magento 2','OpenCart'], ans: 2 },
  { q: 'Where is Xavier currently based?', opts: ['Bangalore','Mumbai','Chennai','Hyderabad'], ans: 2 },
  { q: "Which of these is NOT one of Xavier's projects?", opts: ['SocialShe','LuxeLane','TweetClone','Recipe Sharing'], ans: 2 },
];
function QuizGame({ onClose }) {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUIZ_QUESTIONS[qi];
  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.ans) setScore(s => s + 1);
    setTimeout(() => {
      if (qi + 1 >= QUIZ_QUESTIONS.length) setDone(true);
      else { setQi(qi+1); setSelected(null); }
    }, 900);
  };
  return (
    <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10 }}>
      {done ? (
        <div>
          <pre style={{ color:'var(--green-neon)' }}>
            {`Quiz complete! Score: ${score}/${QUIZ_QUESTIONS.length}\n${score===5?'🏆 Perfect! You know Xavier well!':score>=3?"👍 Nice! You've been paying attention.":'💡 Maybe explore the portfolio a bit more!'}`}
          </pre>
          <button onClick={onClose} style={{ marginTop:8,color:'var(--text-muted)',background:'none',border:'1px solid var(--border)',borderRadius:4,padding:'3px 8px',cursor:'pointer',fontFamily:'inherit',fontSize:9 }}>[close]</button>
        </div>
      ) : (
        <div>
          <div style={{ color:'var(--green-neon)',marginBottom:8,lineHeight:1.5 }}>Q{qi+1}/{QUIZ_QUESTIONS.length}: {q.q}</div>
          {q.opts.map((o,i) => (
            <div key={i} onClick={() => choose(i)} style={{
              padding:'6px 10px',marginBottom:5,cursor:'pointer',borderRadius:6,fontSize:10,touchAction:'manipulation',
              border:'1px solid',
              borderColor:selected===null?'var(--border)':i===q.ans?'var(--green-neon)':selected===i?'#FF6B6B':'var(--border)',
              color:selected===null?'var(--text-secondary)':i===q.ans?'var(--green-neon)':selected===i?'#FF6B6B':'var(--text-muted)',
              background:selected!==null&&i===q.ans?'rgba(57,255,136,0.08)':'transparent',
            }}>
              [{i===0?'A':i===1?'B':i===2?'C':'D'}] {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Wordle Game ──────────────────────────────────────────────────────────────
const WORDLE_WORDS = ['REACT','MYSQL','SOLID','LINUX','STACK','FETCH','PROXY','TOKEN','QUERY','REDIS'];
function WordleGame({ onClose }) {
  const [target] = useState(() => WORDLE_WORDS[Math.floor(Math.random()*WORDLE_WORDS.length)]);
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);
  const maxGuesses = 6;
  const won = guesses.some(g => g === target);

  const submit = useCallback(() => {
    if (current.length !== 5 || done) return;
    const ng = [...guesses, current.toUpperCase()];
    setGuesses(ng);
    if (current.toUpperCase() === target || ng.length >= maxGuesses) setDone(true);
    setCurrent('');
  }, [current, guesses, target, done]);

  const onKey = useCallback((e) => {
    if (done) return;
    if (e.key === 'Enter') submit();
    else if (e.key === 'Backspace') setCurrent(c => c.slice(0,-1));
    else if (/^[a-zA-Z]$/.test(e.key) && current.length < 5) setCurrent(c => c+e.key.toUpperCase());
  }, [current, done, submit]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [onKey]);

  const colorFor = (g, i) => {
    if (target[i] === g[i]) return 'var(--green-neon)';
    if (target.includes(g[i])) return '#FEBC2E';
    return 'var(--text-muted)';
  };

  const keyPress = (k) => {
    if (done) return;
    if (k === 'ENTER') submit();
    else if (k === '⌫') setCurrent(c => c.slice(0,-1));
    else if (current.length < 5) setCurrent(c => c+k);
  };

  return (
    <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:10 }}>
      <div style={{ color:'var(--text-muted)',marginBottom:8,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <span>TECH WORDLE — guess the 5-letter dev term</span>
        <button onClick={onClose} style={{ color:'var(--text-muted)',background:'none',border:'1px solid var(--border)',borderRadius:4,padding:'2px 6px',cursor:'pointer',fontFamily:'inherit',fontSize:9 }}>[close]</button>
      </div>
      {guesses.map((g,gi) => (
        <div key={gi} style={{ display:'flex',gap:4,marginBottom:4 }}>
          {g.split('').map((c,ci) => (
            <div key={ci} style={{ width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid',borderColor:colorFor(g,ci),color:colorFor(g,ci),fontWeight:700,fontSize:11 }}>{c}</div>
          ))}
        </div>
      ))}
      {!done && guesses.length < maxGuesses && (
        <div style={{ display:'flex',gap:4,marginBottom:4 }}>
          {Array.from({length:5},(_,i) => (
            <div key={i} style={{ width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid var(--border)',color:'var(--text-primary)',fontWeight:700,fontSize:11 }}>
              {current[i]||''}
            </div>
          ))}
        </div>
      )}
      {done && <pre style={{ color:won?'var(--green-neon)':'#FF6B6B',marginTop:4,marginBottom:4 }}>{won?`🎉 Correct! The word was ${target}`:`💀 The word was ${target}`}</pre>}
      <div style={{ color:'var(--text-muted)',marginBottom:8 }}>🟩 correct  🟨 wrong spot  ⬛ not in word</div>
      {/* On-screen keyboard */}
      {!done && [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','⌫']].map((row,ri) => (
        <div key={ri} style={{ display:'flex',gap:3,marginBottom:3,flexWrap:'wrap' }}>
          {row.map(k => (
            <button key={k} onClick={() => keyPress(k)} style={{
              minWidth:k.length>1?38:22,height:26,borderRadius:4,fontSize:9,fontFamily:'JetBrains Mono,monospace',cursor:'pointer',touchAction:'manipulation',
              background:'var(--base-600)',border:'1px solid var(--border)',color:'var(--text-primary)',padding:'0 3px',
            }}>{k}</button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Typewriter AI Output ─────────────────────────────────────────────────────
function TypewriterText({ text, speed = 12 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(''); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++; setDisplayed(text.slice(0,i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return (
    <pre className="text-xs leading-5 whitespace-pre-wrap ml-4"
      style={{ color:'var(--text-secondary)',fontFamily:'JetBrains Mono,monospace',borderLeft:'1px solid rgba(0,207,255,0.2)',paddingLeft:10 }}>
      {displayed}{!done && <span className="blink" />}
    </pre>
  );
}

// ─── Loading Bar ──────────────────────────────────────────────────────────────
function LoadingBar({ label, finalText }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPct(p => { if(p>=100){clearInterval(t);setDone(true);return 100;} return p+2; }), 40);
    return () => clearInterval(t);
  }, []);
  return (
    <pre className="text-xs leading-5 whitespace-pre-wrap ml-4"
      style={{ color:'var(--text-secondary)',fontFamily:'JetBrains Mono,monospace',borderLeft:'1px solid rgba(57,255,136,0.15)',paddingLeft:10 }}>
      {label}{'\n'}[{'█'.repeat(Math.floor(pct/5))}{'░'.repeat(20-Math.floor(pct/5))}] {pct}%{done?'\n\n'+finalText:''}
    </pre>
  );
}

// ─── Vim Trap ─────────────────────────────────────────────────────────────────
function VimOutput({ onEscape, onCloseTerminal }) {
  const [escaped, setEscaped] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const onKey = (e) => {
      // Esc closes the terminal entirely (vim behaviour — you're trapped!)
      if (e.key === 'Escape') {
        onCloseTerminal?.();
        return;
      }
      if (e.key === 'q' && attempt >= 2) { setEscaped(true); onEscape?.(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [attempt, onEscape, onCloseTerminal]);
  return (
    <div>
      <pre className="text-xs leading-5 whitespace-pre-wrap ml-4"
        style={{ color:'var(--text-secondary)',fontFamily:'JetBrains Mono,monospace',borderLeft:'1px solid rgba(57,255,136,0.15)',paddingLeft:10 }}>
        {escaped
          ? '✓ You escaped vim! Xavier is proud of you. 🎉'
          : `You are now in vim.\n\nGood luck getting out.\n\n~\n~\n~\n-- INSERT --\n\nHint: Press :q to quit (type it out)\nAttempts: ${attempt}\n\n⚠ Warning: Pressing Escape will close the terminal.\n  (Just like real vim users accidentally do.)`}
      </pre>
      {!escaped && (
        <div style={{ marginTop:8,marginLeft:16,display:'flex',gap:6 }}>
          <button onClick={() => setAttempt(a=>a+1)} style={{ color:'var(--text-muted)',background:'none',border:'1px solid var(--border)',borderRadius:4,padding:'3px 8px',cursor:'pointer',fontFamily:'JetBrains Mono,monospace',fontSize:9 }}>
            press :q ({attempt}/3)
          </button>
          <button onClick={onEscape} style={{ color:'var(--green-neon)',background:'none',border:'1px solid rgba(57,255,136,0.3)',borderRadius:4,padding:'3px 8px',cursor:'pointer',fontFamily:'JetBrains Mono,monospace',fontSize:9 }}>
            force quit
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ASCII Portrait ───────────────────────────────────────────────────────────
function AsciiPortrait() {
  return (
    <pre className="text-xs leading-4 ml-4"
      style={{ color:'var(--green-neon)',fontFamily:'JetBrains Mono,monospace',borderLeft:'1px solid rgba(57,255,136,0.15)',paddingLeft:10 }}>
{`    ██████
   ██░░░░██
  ██░░██░░██
  ██░░░░░░██
   ██░░░░██
    ████████
   ██ ████ ██
  ████████████
 ██░░░░░░░░░░██
██░░░░░░░░░░░░██
  ██░░░░░░░░██
    ████████

  Xavier Akash M
  Full Stack Dev
  Available: ● YES`}
    </pre>
  );
}

// ─── Matrix Rain (terminal inline) ───────────────────────────────────────────
function MatrixRain() {
  const [chars, setChars] = useState('');
  useEffect(() => {
    const pool = 'アイウエオカキクケコABCDEF0123456789';
    let count = 0;
    const t = setInterval(() => {
      setChars(Array.from({length:120},()=>pool[Math.floor(Math.random()*pool.length)]).join(''));
      if (++count > 30) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, []);
  return (
    <pre className="text-xs leading-4 whitespace-pre-wrap ml-4"
      style={{ color:'var(--green-neon)',fontFamily:'JetBrains Mono,monospace',wordBreak:'break-all',opacity:0.8 }}>
      {chars}
    </pre>
  );
}

// ─── Disco Output ─────────────────────────────────────────────────────────────
function DiscoOutput() {
  const colors = ['#FF6B6B','#FEBC2E','#39FF88','#00CFFF','#FF88FF','#FF8800'];
  const [ci, setCi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCi(c=>(c+1)%colors.length), 200);
    setTimeout(() => clearInterval(t), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <pre className="text-xs leading-5 ml-4 whitespace-pre-wrap"
      style={{ color:colors[ci],fontFamily:'JetBrains Mono,monospace',borderLeft:`1px solid ${colors[ci]}`,paddingLeft:10,transition:'color 0.1s,border-color 0.1s' }}>
      {`🕺 DISCO MODE ACTIVATED — check the site! 🕺\n\nDuration: 3 seconds\nSide effects: None (except hiring Xavier)\n\n🎉 Party terminated. Back to work.`}
    </pre>
  );
}

// ─── Party Output ─────────────────────────────────────────────────────────────
function PartyOutput() {
  const [frame, setFrame] = useState(0);
  const frames = ['🎉🎊✨🎉🎊✨','✨🎉🎊✨🎉🎊','🎊✨🎉🎊✨🎉'];
  useEffect(() => { const t=setInterval(()=>setFrame(f=>(f+1)%3),300); return ()=>clearInterval(t); }, []);
  return (
    <pre className="text-xs leading-5 ml-4 whitespace-pre-wrap"
      style={{ color:'var(--green-neon)',fontFamily:'JetBrains Mono,monospace',borderLeft:'1px solid rgba(57,255,136,0.3)',paddingLeft:10 }}>
      {frames[frame]}{'\n\n'}
      {`🎉 Xavier is AVAILABLE FOR HIRE! 🎉\n\nEmail   : akashmsm275@gmail.com\nPhone   : +91 86102 06655\nLinkedIn: linkedin.com/in/xavier-fsd/\n\nThe confetti is a sign. 🎊`}
    </pre>
  );
}

// ─── Shake Text ───────────────────────────────────────────────────────────────
function ShakeText({ text }) {
  return (
    <pre className="text-xs leading-5 ml-4 whitespace-pre-wrap"
      style={{ color:'#FF6B6B',fontFamily:'JetBrains Mono,monospace',animation:'shake 0.4s ease',borderLeft:'1px solid rgba(255,107,107,0.3)',paddingLeft:10 }}>
      {text}
    </pre>
  );
}

// ─── Glitch Output ────────────────────────────────────────────────────────────
function GlitchOutput({ text }) {
  const [phase, setPhase] = useState(0);
  const [glitched, setGlitched] = useState(text);
  useEffect(() => {
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';
    let count = 0;
    const t = setInterval(() => {
      count++;
      setGlitched(text.split('').map(c=>Math.random()<0.3?pool[Math.floor(Math.random()*pool.length)]:c).join(''));
      if (count > 8) { clearInterval(t); setGlitched(text); setPhase(1); }
    }, 80);
    return () => clearInterval(t);
  }, [text]);
  return (
    <pre className="text-xs leading-5 whitespace-pre-wrap ml-4"
      style={{ color:phase===1?'var(--green-neon)':'#FEBC2E',fontFamily:'JetBrains Mono,monospace',borderLeft:'1px solid rgba(57,255,136,0.15)',paddingLeft:10 }}>
      {glitched}
    </pre>
  );
}

// ─── Boot Sequence ────────────────────────────────────────────────────────────
function BootSequence({ onDone }) {
  const lines = [
    'Initializing xavier-ai v3.0...',
    'Loading portfolio data.......... OK',
    'Connecting to Gemini AI......... OK',
    'Calibrating sarcasm engine...... OK',
    'Loading easter eggs............. ██ CLASSIFIED',
    'Starting terminal interface..... READY',
  ];
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    lines.forEach((_, i) => setTimeout(() => {
      setVisible(p => [...p, i]);
      if (i === lines.length-1) setTimeout(onDone, 600);
    }, i * 350));
  }, []);
  return (
    <div style={{ padding:'8px 12px' }}>
      {lines.map((l, i) => visible.includes(i) && (
        <pre key={i} className="text-xs leading-5"
          style={{ color:i===lines.length-1?'var(--green-neon)':'var(--text-muted)',fontFamily:'JetBrains Mono,monospace',animation:'glitch-in 0.2s ease' }}>
          {l}
        </pre>
      ))}
    </div>
  );
}

// ─── Help Clickable ───────────────────────────────────────────────────────────
function HelpOutput({ onRun }) {
  const commands = Object.keys(STATIC_COMMANDS);
  const eggs = Object.keys(EASTER_EGGS);
  return (
    <div className="ml-4" style={{ borderLeft:'1px solid rgba(57,255,136,0.15)',paddingLeft:10,fontFamily:'JetBrains Mono,monospace',fontSize:11 }}>
      <p style={{ color:'var(--text-secondary)',marginBottom:6 }}>AVAILABLE COMMANDS — click to run</p>
      <div style={{ display:'flex',flexWrap:'wrap',gap:4,marginBottom:10 }}>
        {commands.map(cmd => (
          <button key={cmd} onClick={() => onRun(cmd)}
            style={{ fontFamily:'JetBrains Mono,monospace',fontSize:9,padding:'2px 8px',borderRadius:4,cursor:'pointer',background:'rgba(57,255,136,0.05)',border:'1px solid rgba(57,255,136,0.2)',color:'var(--green-neon)',touchAction:'manipulation' }}>
            {cmd}
          </button>
        ))}
      </div>
      <p style={{ color:'var(--text-secondary)',marginBottom:6 }}>EASTER EGGS 👀 — click to trigger</p>
      <div style={{ display:'flex',flexWrap:'wrap',gap:4 }}>
        {eggs.map(egg => (
          <button key={egg} onClick={() => onRun(egg)}
            style={{ fontFamily:'JetBrains Mono,monospace',fontSize:9,padding:'2px 8px',borderRadius:4,cursor:'pointer',background:'rgba(0,207,255,0.05)',border:'1px solid rgba(0,207,255,0.2)',color:'var(--cyan)',touchAction:'manipulation' }}>
            {egg}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main SuperTerminal ───────────────────────────────────────────────────────
export default function SuperTerminal() {
  const [open, setOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestion, setSuggestion] = useState('');
  const [aiStatus, setAiStatus] = useState('GEMINI ONLINE');
  const [mode, setMode] = useState('CMD');
  const [panelH, setPanelH] = useState(480);
  const [newResponse, setNewResponse] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const resizeRef = useRef(null);
  const konamiRef = useRef([]);
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [history, activeGame]);
  useEffect(() => { if (open && booted) setTimeout(() => inputRef.current?.focus(), 100); }, [open, booted]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); setOpen(true); setTimeout(() => inputRef.current?.focus(), 150); }
      konamiRef.current = [...konamiRef.current, e.key].slice(-10);
      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        addLine({ type:'special', content:'konami' });
        triggerSiteEffect('confetti');
        konamiRef.current = [];
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Resize drag (desktop only)
  useEffect(() => {
    const handle = resizeRef.current;
    if (!handle || window.innerWidth < 768) return;
    let startY, startH;
    const onMouseDown = (e) => { startY=e.clientY; startH=panelH; document.addEventListener('mousemove',onMouseMove); document.addEventListener('mouseup',onMouseUp); };
    const onMouseMove = (e) => { const delta=startY-e.clientY; setPanelH(Math.max(300,Math.min(700,startH+delta))); };
    const onMouseUp = () => { document.removeEventListener('mousemove',onMouseMove); document.removeEventListener('mouseup',onMouseUp); };
    handle.addEventListener('mousedown', onMouseDown);
    return () => handle.removeEventListener('mousedown', onMouseDown);
  }, [panelH]);

  const addLine = useCallback((line) => setHistory(prev => [...prev, line]), []);

  const callGemini = useCallback(async (userMsg, histSnap) => {
    setAiStatus('THINKING...'); setMode('AI');
    const thinkingId = Date.now();
    addLine({ type:'thinking', id:thinkingId });
    try {
      const contents = [
        { role:'user', parts:[{ text:SYSTEM_CONTEXT }] },
        { role:'model', parts:[{ text:"Understood. I am Xavier's AI terminal assistant." }] },
        ...histSnap.filter(h=>h.type==='input'||h.type==='ai').slice(-10)
          .map(h => h.type==='input' ? { role:'user',parts:[{text:h.text}] } : { role:'model',parts:[{text:h.text}] }),
        { role:'user', parts:[{ text:userMsg }] },
      ];
      const res = await fetch(GEMINI_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ contents, generationConfig:{ temperature:0.7, maxOutputTokens:400 } }) });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini. Check your API key.';
      setHistory(prev => prev.filter(h=>h.id!==thinkingId));
      addLine({ type:'ai', text });
      setNewResponse(true);
      setTimeout(() => setNewResponse(false), 2000);
    } catch {
      setHistory(prev => prev.filter(h=>h.id!==thinkingId));
      addLine({ type:'error', text:'Gemini API error. Check your API key in SuperTerminal.jsx.' });
    }
    setAiStatus('GEMINI ONLINE'); setMode('CMD');
  }, [addLine]);

  const run = useCallback((cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;
    addLine({ type:'input', text:trimmed });
    setCmdHistory(prev => [trimmed,...prev.filter(c=>c!==trimmed)].slice(0,50));
    setHistoryIdx(-1); setInput(''); setSuggestion('');

    if (trimmed === 'clear') { setHistory([]); setActiveGame(null); return; }
    if (trimmed === 'ctrl+l') { setHistory([]); return; }

    // Static commands — help renders clickable version
    if (trimmed === 'help') {
      addLine({ type:'help' });
      return;
    }
    if (STATIC_COMMANDS[trimmed]) {
      setMode('CMD');
      addLine({ type:'output', text:STATIC_COMMANDS[trimmed]() });
      return;
    }

    // Easter eggs
    if (EASTER_EGGS[trimmed]) {
      const egg = EASTER_EGGS[trimmed];
      setMode('CMD');
      // Trigger site-wide effect if defined
      if (egg.siteEffect) triggerSiteEffect(egg.siteEffect);
      if (egg.type === 'snake')    { setActiveGame('snake'); return; }
      if (egg.type === 'quiz')     { setActiveGame('quiz'); return; }
      if (egg.type === 'wordle')   { setActiveGame('wordle'); return; }
      if (egg.type === 'vim')      { setActiveGame('vim'); return; }
      if (egg.type === 'cursor-trail') { addLine({ type:'output', text:'✓ Cursor trail activated for 10 seconds. Move your mouse!' }); return; }
      if (egg.type === 'disco')    { addLine({ type:'disco' }); return; }
      if (egg.type === 'matrix')   { addLine({ type:'matrix' }); return; }
      if (egg.type === 'party')    { addLine({ type:'party' }); return; }
      if (egg.type === 'glitch')   { addLine({ type:'glitch', text:egg.text }); return; }
      if (egg.type === 'shake')    { addLine({ type:'shake', text:egg.text }); return; }
      if (egg.type === 'ping')     { addLine({ type:'ping' }); return; }
      if (egg.type === 'neofetch') { addLine({ type:'neofetch' }); return; }
      if (egg.type === 'hack')     { addLine({ type:'hack' }); return; }
      if (egg.type === 'deploy')   { addLine({ type:'deploy' }); return; }
      if (egg.type === 'yolo')     { addLine({ type:'yolo' }); return; }
      if (egg.type === 'panic')    { addLine({ type:'panic' }); return; }
      if (egg.type === 'loading')  { addLine({ type:'loading', text:egg.text, finalText:egg.finalText }); return; }
      if (egg.type === 'ascii-portrait') { addLine({ type:'ascii-portrait' }); return; }
      addLine({ type:'output', text:egg.text });
      return;
    }

    // Did you mean?
    const allCmds = [...Object.keys(STATIC_COMMANDS), ...Object.keys(EASTER_EGGS)];
    const closeMatch = allCmds.find(c => {
      if (Math.abs(c.length-trimmed.length)>2) return false;
      let diff=0;
      for (let i=0;i<Math.max(c.length,trimmed.length);i++) if(c[i]!==trimmed[i]) diff++;
      return diff===1 && c!==trimmed;
    });
    if (closeMatch) { addLine({ type:'error', text:`command not found: ${trimmed}\nDid you mean: ${closeMatch}?` }); return; }

    // AI fallback
    callGemini(trimmed, [...history]);
  }, [history, addLine, callGemini]);

  const onKey = (e) => {
    if (e.key === 'Enter') { run(input); return; }
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'Tab') { e.preventDefault(); const m=AUTOCOMPLETE_LIST.find(c=>c.startsWith(input.toLowerCase())&&c!==input.toLowerCase()); if(m){setInput(m);setSuggestion('');} return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); const idx=Math.min(historyIdx+1,cmdHistory.length-1); setHistoryIdx(idx); setInput(cmdHistory[idx]||''); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); const idx=Math.max(historyIdx-1,-1); setHistoryIdx(idx); setInput(idx===-1?'':cmdHistory[idx]||''); return; }
    if (e.ctrlKey && e.key==='l') { e.preventDefault(); setHistory([]); return; }
  };

  const onInputChange = (e) => {
    const val = e.target.value; setInput(val);
    const m = val ? AUTOCOMPLETE_LIST.find(c=>c.startsWith(val.toLowerCase())&&c!==val.toLowerCase()) : '';
    setSuggestion(m ? m.slice(val.length) : '');
  };

  const renderLine = (line, i) => {
    if (line.type==='input') return (
      <div key={i} className="flex items-start gap-2">
        <span style={{ color:'var(--green-neon)',fontWeight:700,flexShrink:0 }}>❯</span>
        <span style={{ color:'var(--text-primary)',fontFamily:'JetBrains Mono,monospace',fontSize:12 }}>{line.text}</span>
      </div>
    );
    if (line.type==='output') return <pre key={i} className="text-xs leading-5 whitespace-pre-wrap ml-4" style={{ color:'var(--text-secondary)',fontFamily:'JetBrains Mono,monospace',borderLeft:'1px solid rgba(57,255,136,0.15)',paddingLeft:10 }}>{line.text}</pre>;
    if (line.type==='help') return <HelpOutput key={i} onRun={run} />;
    if (line.type==='ai') return <div key={i} className="ml-4"><span style={{ color:'#00CFFF',fontFamily:'JetBrains Mono,monospace',fontSize:9,letterSpacing:'0.1em' }}>✦ GEMINI AI</span><TypewriterText text={line.text} /></div>;
    if (line.type==='thinking') return <div key={i} className="ml-4 flex items-center gap-2"><span style={{ color:'#00CFFF',fontSize:9,fontFamily:'JetBrains Mono,monospace' }}>✦ GEMINI</span><div className="flex gap-1">{[0,1,2].map(d=><span key={d} className="block rounded-full" style={{ width:4,height:4,background:'#00CFFF',animation:`typing-dot 1.2s ease-in-out ${d*0.2}s infinite` }} />)}</div></div>;
    if (line.type==='error') return <pre key={i} className="text-xs ml-4 whitespace-pre-wrap" style={{ color:'#FF6B6B',fontFamily:'JetBrains Mono,monospace' }}>{line.text}</pre>;
    if (line.type==='system') return <p key={i} className="text-xs" style={{ color:'var(--text-muted)',fontStyle:'italic',fontFamily:'JetBrains Mono,monospace' }}>{line.text}</p>;
    if (line.type==='ping') return <PingOutput key={i} />;
    if (line.type==='neofetch') return <NeofetchOutput key={i} />;
    if (line.type==='hack') return <HackOutput key={i} />;
    if (line.type==='deploy') return <DeployOutput key={i} />;
    if (line.type==='yolo') return <YoloOutput key={i} />;
    if (line.type==='panic') return <PanicOutput key={i} />;
    if (line.type==='matrix') return <MatrixRain key={i} />;
    if (line.type==='loading') return <LoadingBar key={i} label={line.text} finalText={line.finalText} />;
    if (line.type==='glitch') return <GlitchOutput key={i} text={line.text} />;
    if (line.type==='shake') return <ShakeText key={i} text={line.text} />;
    if (line.type==='disco') return <DiscoOutput key={i} />;
    if (line.type==='party') return <PartyOutput key={i} />;
    if (line.type==='ascii-portrait') return <AsciiPortrait key={i} />;
    if (line.type==='special'&&line.content==='konami') return (
      <pre key={i} className="text-xs ml-4 whitespace-pre-wrap" style={{ color:'#FEBC2E',fontFamily:'JetBrains Mono,monospace',borderLeft:'1px solid rgba(254,188,46,0.3)',paddingLeft:10 }}>
        {`↑↑↓↓←→←→BA detected!\n\n🎮 DEV GOD MODE UNLOCKED\n✓ Infinite coffee\n✓ No more merge conflicts\n✓ Stack Overflow gives first answer\n✓ Bugs fix themselves\n\nWelcome to god tier. 🏆`}
      </pre>
    );
    return null;
  };

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(o=>!o)} className="fixed z-50 flex items-center justify-center"
        style={{
          bottom:'calc(var(--statusbar-h) + 12px)', right:16,
          width:48, height:48, borderRadius:14,
          background:open?'var(--base-700)':'var(--base-800)',
          border:`1px solid ${newResponse?'var(--green-neon)':'var(--border-bright)'}`,
          boxShadow:newResponse?'0 0 20px rgba(57,255,136,0.6),0 0 40px rgba(57,255,136,0.3)':open?'0 0 20px rgba(57,255,136,0.15),0 8px 32px rgba(0,0,0,0.4)':'0 0 12px rgba(57,255,136,0.1),0 8px 24px rgba(0,0,0,0.4)',
          cursor:'pointer', transition:'all 0.2s ease', position:'fixed',
        }}
        aria-label="Open AI Terminal"
      >
        <span style={{ color:'var(--green-neon)',fontFamily:'JetBrains Mono,monospace',fontWeight:700,fontSize:14,letterSpacing:-1 }}>
          {open?'✕':'>_'}
        </span>
        {!open && <span style={{ position:'absolute',inset:-4,borderRadius:18,border:'1px solid rgba(57,255,136,0.3)',animation:'pulse-ring 2s ease-out infinite' }} />}
      </button>

      {/* Terminal Panel */}
      {open && (
        <div ref={panelRef} className="fixed z-50 rounded-xl overflow-hidden flex flex-col"
          style={{
            bottom:'calc(var(--statusbar-h) + 70px)',
            right:16, left:'auto',
            width:'min(520px, calc(100vw - 32px))',
            height:`min(${panelH}px, 75vh)`,
            background:'var(--base-900)',
            border:'1px solid var(--border-bright)',
            boxShadow:'0 0 60px rgba(57,255,136,0.08),0 24px 80px rgba(0,0,0,0.6)',
            animation:'terminal-up 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Resize handle — desktop only */}
          <div ref={resizeRef} style={{ position:'absolute',top:0,left:0,right:0,height:6,cursor:window.innerWidth>=768?'ns-resize':'default',zIndex:10,background:'transparent' }} />

          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 shrink-0" style={{ background:'var(--base-800)',borderBottom:'1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full cursor-pointer" style={{ background:'#FF5F57' }} onClick={() => setOpen(false)} />
              <span className="w-3 h-3 rounded-full cursor-pointer" style={{ background:'#FEBC2E' }} onClick={() => setPanelH(300)} />
              <span className="w-3 h-3 rounded-full cursor-pointer" style={{ background:'#28C840' }} onClick={() => setPanelH(600)} />
            </div>
            <span className="font-mono text-xs hidden sm:inline" style={{ color:'var(--text-muted)' }}>xavier-ai — zsh — 80×24</span>
            <div className="flex items-center gap-3">
              <span className="font-mono px-1.5 py-0.5 rounded" style={{ color:mode==='AI'?'#00CFFF':'var(--green-neon)',border:`1px solid ${mode==='AI'?'rgba(0,207,255,0.3)':'rgba(57,255,136,0.2)'}`,fontSize:8,fontFamily:'JetBrains Mono,monospace' }}>{mode}</span>
              <div className="flex items-center gap-1">
                <span className="pulse-dot" style={{ width:5,height:5 }} />
                <span className="font-mono" style={{ color:aiStatus==='THINKING...'?'#FEBC2E':'var(--green-neon)',fontSize:8,fontFamily:'JetBrains Mono,monospace' }}>{aiStatus}</span>
              </div>
            </div>
          </div>

          {/* Quick chips */}
          <div className="flex gap-1.5 px-4 py-2 shrink-0 chips-row" style={{ borderBottom:'1px solid var(--border)',background:'rgba(255,255,255,0.01)',overflowX:'auto',scrollbarWidth:'none' }}>
            {['help','about','skills','projects','contact','neofetch','snake','quiz','wordle','matrix','party'].map(cmd => (
              <button key={cmd} onClick={() => run(cmd)}
                style={{ color:'var(--text-muted)',border:'1px solid var(--border)',background:'transparent',fontSize:9,fontFamily:'JetBrains Mono,monospace',padding:'2px 8px',borderRadius:4,cursor:'pointer',flexShrink:0,touchAction:'manipulation' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(57,255,136,0.4)';e.currentTarget.style.color='var(--green-neon)';e.currentTarget.style.background='rgba(57,255,136,0.05)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.background='transparent';}}
              >{cmd}</button>
            ))}
          </div>

          {/* Output */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm" onClick={() => inputRef.current?.focus()} style={{ scrollbarWidth:'thin' }}>
            {!booted ? (
              <BootSequence onDone={() => {
                setBooted(true);
                setHistory([{ type:'system', text:'xavier-ai v3.0 ready. Type "help" to see all commands — they\'re clickable!' }]);
              }} />
            ) : (
              <>
                {history.map((line, i) => renderLine(line, i))}
                {activeGame==='snake'  && <SnakeGame  onClose={() => setActiveGame(null)} />}
                {activeGame==='quiz'   && <QuizGame   onClose={() => setActiveGame(null)} />}
                {activeGame==='wordle' && <WordleGame onClose={() => setActiveGame(null)} />}
                {activeGame==='vim'    && <VimOutput  onEscape={() => setActiveGame(null)} onCloseTerminal={() => setOpen(false)} />}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          {booted && (
            <div className="flex items-center gap-2 px-4 py-3 shrink-0 relative" style={{ borderTop:'1px solid var(--border)',background:'rgba(57,255,136,0.02)' }}>
              <span className="font-mono text-sm font-bold shrink-0" style={{ color:'var(--green-neon)' }}>❯</span>
              <div className="flex-1 relative font-mono text-sm">
                <input
                  ref={inputRef} type="text" value={input}
                  onChange={onInputChange} onKeyDown={onKey}
                  className="w-full bg-transparent outline-none"
                  style={{ color:'var(--text-primary)',caretColor:'var(--green-neon)',fontFamily:'JetBrains Mono,monospace',fontSize:13,position:'relative',zIndex:2 }}
                  placeholder="type a command or ask AI..."
                  autoComplete="off" spellCheck={false}
                />
                {suggestion && (
                  <span className="absolute top-0 left-0 pointer-events-none" style={{ color:'var(--text-muted)',zIndex:1,fontFamily:'JetBrains Mono,monospace',fontSize:13 }}>
                    {input}<span style={{ opacity:0.4 }}>{suggestion}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bottom bar */}
          {booted && (
            <div className="px-4 py-1.5 shrink-0 flex items-center justify-between" style={{ borderTop:'1px solid var(--border)',background:'var(--base-800)' }}>
              <span className="font-mono" style={{ color:'var(--text-muted)',fontSize:8,fontFamily:'JetBrains Mono,monospace' }}>
                ↑↓ history · Tab complete · Ctrl+L clear · Esc close
              </span>
              <span className="font-mono hidden sm:inline" style={{ color:'var(--text-muted)',fontSize:8,fontFamily:'JetBrains Mono,monospace' }}>
                drag top to resize
              </span>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes terminal-up { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes typing-dot { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-4px);opacity:1} }
        @keyframes disco-flash { 0%{background:#FF6B6B} 16%{background:#FEBC2E} 33%{background:#39FF88} 50%{background:#00CFFF} 66%{background:#FF88FF} 83%{background:#FF8800} 100%{background:#FF6B6B} }
        @keyframes confetti-fall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
        @keyframes trail-fade { 0%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(0.2)} }
        @keyframes glitch-in { 0%{opacity:0;transform:translateX(-4px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
      `}</style>
    </>
  );
}