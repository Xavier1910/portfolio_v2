import { useState, useRef, useEffect } from 'react';
import { profile, experience, skills, projects, education, certifications } from '../data/portfolioData';
import CodeRain from './CodeRain';

const COMMANDS = {
  help: () => `Available commands:\n\n  about       — Developer identity\n  skills      — Full technology stack\n  experience  — Work history\n  projects    — Project repositories\n  education   — Education & certifications\n  contact     — Contact information\n  stack       — Quick stack overview\n  clear       — Clear terminal\n  whoami      — Short intro`,

  about: () => `${profile.name}\n${profile.title} @ EWall Solutions Pvt. Ltd.\nLocation: ${profile.location}\n\n${profile.summary}`,

  whoami: () => `${profile.name}\nRole    : ${profile.title}\nCompany : EWall Solutions Pvt. Ltd.\nLocation: ${profile.location}\nStatus  : ${profile.available ? '● AVAILABLE FOR OPPORTUNITIES' : '○ NOT AVAILABLE'}`,

  stack: () => `CURRENT STACK\n─────────────\nBackend  : Spring Boot · Magento 2 · PHP · Laravel\nFrontend : React.js · Alpine.js · Tailwind CSS\nDatabase : MySQL · Oracle\nLanguages: Java · PHP · JavaScript\nTools    : Git · Postman · Linux CLI`,

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

  contact: () => `Email   : ${profile.email}\nPhone   : ${profile.phone}\nGitHub  : ${profile.github}\nLinkedIn: ${profile.linkedin}\n\nStatus  : ● AVAILABLE FOR OPPORTUNITIES`,
};

const AUTOCOMPLETE = Object.keys(COMMANDS);

export default function InteractiveTerminal() {
  const [history, setHistory] = useState([
    { type: 'system', text: 'Developer Terminal v2.0 · type "help" for commands · Tab to autocomplete · ↑↓ for history' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestion, setSuggestion] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const run = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', text: trimmed }];

    if (trimmed === 'clear') {
      setHistory([{ type: 'system', text: 'Terminal cleared. Type "help" for commands.' }]);
    } else if (trimmed === '') {
      setHistory(newHistory);
    } else if (COMMANDS[trimmed]) {
      setHistory([...newHistory, { type: 'output', text: COMMANDS[trimmed]() }]);
    } else {
      setHistory([...newHistory, { type: 'error', text: `command not found: ${trimmed}\ntype "help" for available commands` }]);
    }

    setCmdHistory(prev => trimmed ? [trimmed, ...prev.filter(c => c !== trimmed)].slice(0, 50) : prev);
    setHistoryIdx(-1);
    setInput('');
    setSuggestion('');
  };

  const onKey = (e) => {
    if (e.key === 'Enter') { run(input); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const match = AUTOCOMPLETE.find(c => c.startsWith(input.toLowerCase()) && c !== input);
      if (match) { setInput(match); setSuggestion(''); }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(idx);
      setInput(cmdHistory[idx] || '');
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? '' : cmdHistory[idx] || '');
      return;
    }
  };

  const onInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    const match = val ? AUTOCOMPLETE.find(c => c.startsWith(val.toLowerCase()) && c !== val) : '';
    setSuggestion(match ? match.slice(val.length) : '');
  };

  return (
    <section id="terminal" className="px-5 py-20 relative" style={{ paddingLeft: 'max(1.25rem, calc(var(--sidebar-w) + 1.5rem))' }}>

      {/* Header */}
      <div className="reveal-up mb-10">
        <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px', letterSpacing: '0.15em' }}>terminal.sh</span>
        <h2 className="text-3xl font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>Terminal</h2>
        <div className="mt-2 h-px w-12" style={{ background: 'var(--green-neon)' }} />
      </div>

      <div className="reveal-up max-w-3xl" data-delay={100}>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'var(--base-800)',
            border: '1px solid var(--border)',
            boxShadow: '0 0 50px rgba(57,255,136,0.05), 0 20px 60px rgba(0,0,0,0.35)',
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div
            className="relative flex items-center justify-between px-4 py-2.5 overflow-hidden"
            style={{ background: 'var(--base-700)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>xavier-fsd — zsh — 80×24</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <span className="font-mono" style={{ color: 'var(--green-neon)', fontSize: '9px' }}>ACTIVE</span>
            </div>
          </div>

          {/* Quick command chips */}
          <div
            className="flex flex-wrap gap-2 px-4 py-2.5"
            style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}
          >
            {['help', 'about', 'skills', 'experience', 'projects', 'contact'].map(cmd => (
              <button
                key={cmd}
                onClick={() => run(cmd)}
                className="font-mono text-xs px-2 py-0.5 rounded transition-all"
                style={{
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: '9px',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(57,255,136,0.4)'; e.currentTarget.style.color = 'var(--green-neon)'; e.currentTarget.style.background = 'rgba(57,255,136,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Output area */}
          <div
            className="p-4 overflow-y-auto font-mono text-sm space-y-2"
            style={{ height: 300, position: 'relative' }}
          >
            {history.map((line, i) => {
              if (line.type === 'input') return (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: 'var(--green-neon)', flexShrink: 0, fontWeight: 700 }}>❯</span>
                  <span style={{ color: 'var(--text-primary)' }}>{line.text}</span>
                </div>
              );
              if (line.type === 'output') return (
                <pre
                  key={i}
                  className="text-xs leading-5 whitespace-pre-wrap ml-4"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'JetBrains Mono, monospace',
                    borderLeft: '1px solid rgba(57,255,136,0.15)',
                    paddingLeft: '10px',
                  }}
                >
                  {line.text}
                </pre>
              );
              if (line.type === 'error') return (
                <pre
                  key={i}
                  className="text-xs ml-4"
                  style={{ color: '#FF6B6B', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {line.text}
                </pre>
              );
              return (
                <p key={i} className="text-xs" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {line.text}
                </p>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div
            className="flex items-center gap-2 px-4 py-3 relative"
            style={{ borderTop: '1px solid var(--border)', background: 'rgba(57,255,136,0.02)' }}
          >
            <span className="font-mono text-sm font-bold shrink-0" style={{ color: 'var(--green-neon)' }}>❯</span>
            <div className="flex-1 relative font-mono text-sm">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={onInputChange}
                onKeyDown={onKey}
                className="w-full bg-transparent outline-none"
                style={{ color: 'var(--text-primary)', caretColor: 'var(--green-neon)', position: 'relative', zIndex: 2 }}
                placeholder="type a command..."
                aria-label="Terminal input"
                autoComplete="off"
                spellCheck={false}
              />
              {/* Autocomplete ghost text */}
              {suggestion && (
                <span
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ color: 'var(--text-muted)', zIndex: 1 }}
                >
                  {input}<span style={{ opacity: 0.5 }}>{suggestion}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          Tip: ↑↓ history · <kbd style={{ background: 'var(--base-700)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' }}>Tab</kbd> autocomplete · click shortcuts above
        </p>
      </div>
    </section>
  );
}
