import { useEffect, useState } from 'react';
import CodeRain from './CodeRain';

const STEPS = [
  { text: 'Initializing developer environment...', done: false },
  { text: 'Loading project repositories...', done: false },
  { text: 'Mounting experience timeline...', done: false },
  { text: 'Compiling skill dependencies...', done: false },
  { text: 'Running system checks...', done: false },
  { text: 'System ready.', done: true },
];

export default function BootLoader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState([]);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return Math.min(100, p + 3.5);
      });
    }, 35);

    // Lines appear sequentially
    STEPS.forEach((step, i) => {
      setTimeout(() => setLines(prev => [...prev, step]), i * 230);
    });

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        window.scrollTo(0, 0);
        onDone();
      }, 500);
    }, 1800);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, []);

  const filled = Math.floor(progress / 5);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'var(--base-950)',
        transition: 'opacity 0.5s ease',
        opacity: exiting ? 0 : 1,
      }}
    >
      {/* Code rain bg */}
      <CodeRain opacity={0.04} />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      {/* Glow */}
      <div className="absolute pointer-events-none" style={{
        top: '20%', left: '30%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(57,255,136,0.05) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 w-full max-w-lg px-8">
        {/* Logo / title */}
        <div className="mb-8 text-center">
          <div className="mx-auto relative flex items-center justify-center w-[200px]">
            <img src="/logo.png" alt="" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                }} />
          </div>
          <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>PORTFOLIO_v2 · BUILD_2025</p>
        </div>

        {/* Log lines */}
        <div className="mb-6 space-y-1.5 min-h-36">
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex items-center gap-2 font-mono text-xs"
              style={{
                color: line.done ? 'var(--green-neon)' : i === lines.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                animation: 'fadeSlideIn 0.2s ease',
              }}
            >
              <span style={{ color: line.done ? 'var(--green-neon)' : 'var(--green-mid)' }}>
                {line.done ? '✓' : '›'}
              </span>
              {line.text}
              {i === lines.length - 1 && !line.done && <span className="blink" style={{ height: '0.7em', width: 2 }} />}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="relative h-px w-full mb-2 rounded"
          style={{ background: 'var(--border)' }}
        >
          <div
            style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--green-neon), var(--cyan))',
              boxShadow: '0 0 10px var(--green-neon)',
              transition: 'width 0.05s linear',
              borderRadius: 4,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            [{'█'.repeat(filled)}{'░'.repeat(Math.max(0, 20 - filled))}]
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--green-neon)' }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
