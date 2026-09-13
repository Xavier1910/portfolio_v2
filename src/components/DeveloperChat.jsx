import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { chatResponses } from '../data/portfolioData';

const SUGGESTIONS = [
  'Who is this developer?',
  "What are his skills?",
  'Show me his projects.',
  'How can I contact him?',
  'What is his experience?',
];

function findResponse(query) {
  const q = query.toLowerCase().trim();
  for (const [key, val] of Object.entries(chatResponses)) {
    if (q.includes(key) || key.includes(q)) return val;
  }
  if (q.match(/skill|tech|stack|language/)) return chatResponses['what are his skills'];
  if (q.match(/project|built|work|repo/))   return chatResponses['show me his projects'];
  if (q.match(/exp|job|company|work/))       return chatResponses["tell me about his experience"];
  if (q.match(/contact|email|reach|call/))  return chatResponses['how can i contact him'];
  if (q.match(/who|about|dev|tell/))        return chatResponses['who is this developer'];
  if (q.match(/edu|study|degree|cgpa/))     return chatResponses['what is his education'];
  return `I can answer questions about Xavier's skills, experience, projects, education, or contact info. Try: "What technologies does he use?"`;
}

export default function DeveloperChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Xavier's developer assistant. Ask me anything about his background, skills, or projects." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: findResponse(trimmed) }]);
    }, 700 + Math.random() * 500);
  };

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: 'var(--base-800)',
        border: '1px solid var(--border)',
        height: 380,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{ background: 'var(--base-700)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#FF5F57' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#FEBC2E' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#28C840' }} />
          <span className="font-mono text-xs ml-2" style={{ color: 'var(--text-muted)' }}>developer_assistant.exe</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="pulse-dot" style={{ width: 5, height: 5 }} />
          <span className="font-mono" style={{ color: 'var(--green-neon)', fontSize: '8px' }}>ONLINE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animation: 'msg-in 0.2s ease' }}
          >
            <div
              className="max-w-[80%] rounded-xl px-3 py-2"
              style={{
                background: msg.role === 'user'
                  ? 'rgba(57,255,136,0.1)'
                  : 'var(--base-700)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(57,255,136,0.25)' : 'var(--border)'}`,
              }}
            >
              {msg.role === 'assistant' && (
                <p className="font-mono mb-1" style={{ color: 'var(--green-neon)', fontSize: '7px', letterSpacing: '0.1em' }}>ASSISTANT</p>
              )}
              <pre
                className="text-xs leading-5 whitespace-pre-wrap"
                style={{
                  color: msg.role === 'user' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {msg.text}
              </pre>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-xl px-3 py-2.5" style={{ background: 'var(--base-700)', border: '1px solid var(--border)' }}>
              <p className="font-mono mb-1.5" style={{ color: 'var(--green-neon)', fontSize: '7px' }}>ASSISTANT</p>
              <div className="flex gap-1">
                {[0, 1, 2].map(d => (
                  <span key={d} className="block rounded-full" style={{
                    width: 5, height: 5,
                    background: 'var(--green-neon)',
                    animation: `typing-dot 1.2s ease-in-out ${d * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      <div
        className="px-3 py-2 flex gap-1.5 overflow-x-auto shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => send(s)}
            className="font-mono text-xs px-2 py-1 rounded-full whitespace-nowrap transition-all shrink-0"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent', fontSize: '9px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(57,255,136,0.3)'; e.currentTarget.style.color = 'var(--green-neon)'; e.currentTarget.style.background = 'rgba(57,255,136,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: 'var(--text-primary)', caretColor: 'var(--green-neon)' }}
          placeholder="Ask something..."
          aria-label="Chat input"
        />
        <button
          onClick={() => send(input)}
          className="p-1.5 rounded-lg transition-all"
          style={{
            color: input.trim() ? 'var(--green-neon)' : 'var(--text-muted)',
            border: '1px solid var(--border)',
            background: input.trim() ? 'rgba(57,255,136,0.08)' : 'transparent',
            transition: 'all 0.15s',
          }}
          aria-label="Send"
        >
          <Send size={13} />
        </button>
      </div>

      <style>{`
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing-dot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
