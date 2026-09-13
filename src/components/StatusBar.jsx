import { useState, useEffect } from 'react';
import { GitBranch, Cpu } from 'lucide-react';

export default function StatusBar({ activeSection }) {
  const [memUsage] = useState(() => (Math.random() * 30 + 40).toFixed(1));
  const [cpu] = useState(() => (Math.random() * 15 + 2).toFixed(1));
  const [animCpu, setAnimCpu] = useState(parseFloat(cpu));

  useEffect(() => {
    const t = setInterval(() => {
      setAnimCpu(prev => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.max(1, Math.min(25, prev + delta));
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-3"
      style={{
        height: 'var(--statusbar-h)',
        background: 'var(--base-950)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <GitBranch size={10} style={{ color: 'var(--green-neon)' }} />
          <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>main</span>
        </div>
        <span className="font-mono hidden sm:block" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
          ● 0 errors
        </span>
      </div>

      {/* Center */}
      <div className="font-mono hidden md:block" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
        {activeSection}.tsx — UTF-8
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 hidden sm:flex">
          <Cpu size={9} style={{ color: 'var(--text-muted)' }} />
          <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
            {animCpu.toFixed(1)}%
          </span>
        </div>
        <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'none' }} id="mem-stat">
          {memUsage}MB
        </span>
        <div className="flex items-center gap-1.5">
          <span className="pulse-dot" style={{ width: 5, height: 5 }} />
          <span className="font-mono" style={{ color: 'var(--green-neon)', fontSize: '9px' }}>ONLINE</span>
        </div>
      </div>
    </footer>
  );
}
