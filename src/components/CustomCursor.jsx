import { useEffect } from 'react';

/*
  Strategy: inject cursor nodes DIRECTLY onto document.body (not inside React tree).
  This bypasses all React stacking contexts and z-index trapping from transforms.
  Both nodes sit at z-index: 2147483647 as direct children of <body>.
  No will-change: transform — use left/top via translate3d with position:fixed.
*/

export default function CustomCursor() {
  useEffect(() => {
    /* ── Create & inject nodes directly on body ── */
    const bracket = document.createElement('div');
    bracket.id = 'xc-bracket';
    bracket.setAttribute('aria-hidden', 'true');
    bracket.dataset.state = 'default';

    const caret = document.createElement('div');
    caret.id = 'xc-caret';
    caret.setAttribute('aria-hidden', 'true');
    caret.dataset.state = 'default';

    document.body.appendChild(bracket);
    document.body.appendChild(caret);

    const stateRef = { current: 'default' };
    const pos      = { x: -200, y: -200 };
    const lerped   = { x: -200, y: -200 };
    let raf;

    /* ── snap bracket to exact mouse pos ── */
    const snap = (x, y) => {
      bracket.style.transform = `translate3d(${x}px,${y}px,0)`;
    };

    /* ── mouse move ── */
    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      snap(e.clientX, e.clientY);

      /* detect cursor type from element under pointer */
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;

      const tag  = el.tagName.toLowerCase();
      const role = el.getAttribute('role');
      const type = el.getAttribute('type');
      const style = window.getComputedStyle(el).cursor;

      let newState = 'default';

      if (style === 'ns-resize' || style === 'row-resize')             newState = 'resize';
      else if (style === 'grab' || style === 'grabbing')               newState = 'grab';
      else if (tag === 'input' || tag === 'textarea' || style === 'text') newState = 'text';
      else if (
        tag === 'a' || tag === 'button' || tag === 'select' ||
        role === 'button' || role === 'link' || role === 'tab' ||
        style === 'pointer' ||
        el.closest('button, a, [role="button"], [role="tab"]')
      ) newState = 'pointer';

      if (newState !== stateRef.current) {
        stateRef.current      = newState;
        bracket.dataset.state = newState;
        caret.dataset.state   = newState;
      }
    };

    /* ── lerp animation loop ── */
    const animate = () => {
      lerped.x += (pos.x - lerped.x) * 0.11;
      lerped.y += (pos.y - lerped.y) * 0.11;
      caret.style.transform = `translate3d(${lerped.x}px,${lerped.y}px,0)`;
      raf = requestAnimationFrame(animate);
    };

    /* ── hide cursor on enter, restore on leave ── */
    const onEnter = () => {
      bracket.style.opacity = '1';
      caret.style.opacity   = '1';
    };
    const onLeave = () => {
      bracket.style.opacity = '0';
      caret.style.opacity   = '0';
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      bracket.remove();
      caret.remove();
    };
  }, []);

  return (
    <>

      <style>{`
        /* ─── Force cursor:none everywhere, including SuperTerminal ─── */
        *,
        *::before,
        *::after {
          cursor: none !important;
        }

        /* ─── Base: both elements ─── */
        #xc-bracket,
        #xc-caret {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none !important;
          z-index: 2147483647 !important;
          transform: translate3d(-200px, -200px, 0);
          transition: opacity 0.2s;
          font-family: 'JetBrains Mono', 'Fira Mono', monospace;
          line-height: 1;
          user-select: none;
          isolation: isolate;
        }

        /* ══════════════════════════════════════
           STATE: default  →  < _
        ══════════════════════════════════════ */
        #xc-bracket[data-state="default"]::before {
          content: '<';
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: var(--green-neon);
          text-shadow: 0 0 10px rgba(57,255,136,0.8);
          margin-top: -7px;
          margin-left: 1px;
        }
        #xc-caret[data-state="default"]::before {
          content: '_';
          display: block;
          font-size: 19px;
          font-weight: 500;
          color: rgba(57,255,136,0.65);
          text-shadow: 0 0 8px rgba(57,255,136,0.5);
          margin-top: 3px;
          margin-left: -1px;
          animation: xc-blink 1s step-end infinite;
        }

        /* ══════════════════════════════════════
           STATE: pointer  →  { }  curly braces
        ══════════════════════════════════════ */
        #xc-bracket[data-state="pointer"]::before {
          content: '{';
          display: block;
          font-size: 19px;
          font-weight: 700;
          color: var(--cyan, #00CFFF);
          text-shadow: 0 0 12px rgba(0,207,255,0.9);
          margin-top: -9px;
          margin-left: -2px;
        }
        #xc-caret[data-state="pointer"]::before {
          content: '}';
          display: block;
          font-size: 19px;
          font-weight: 700;
          color: rgba(0,207,255,0.5);
          text-shadow: 0 0 8px rgba(0,207,255,0.4);
          margin-top: -9px;
          margin-left: 10px;
          animation: none;
          opacity: 1;
        }

        /* ══════════════════════════════════════
           STATE: text  →  styled I-beam
        ══════════════════════════════════════ */
        #xc-bracket[data-state="text"]::before {
          content: '|';
          display: block;
          font-size: 18px;
          font-weight: 300;
          color: var(--green-neon);
          text-shadow: 0 0 8px rgba(57,255,136,0.7);
          margin-top: -10px;
          margin-left: -1px;
        }
        #xc-caret[data-state="text"]::before {
          content: '';
          display: block;
          width: 6px;
          height: 2px;
          background: rgba(57,255,136,0.4);
          border-radius: 1px;
          margin-top: -1px;
          margin-left: -3px;
          animation: none;
          opacity: 1;
        }

        /* ══════════════════════════════════════
           STATE: resize  →  ↕
        ══════════════════════════════════════ */
        #xc-bracket[data-state="resize"]::before {
          content: '↕';
          display: block;
          font-size: 14px;
          color: #FEBC2E;
          text-shadow: 0 0 10px rgba(254,188,46,0.8);
          margin-top: -8px;
          margin-left: -3px;
        }
        #xc-caret[data-state="resize"]::before {
          content: '─';
          display: block;
          font-size: 10px;
          color: rgba(254,188,46,0.4);
          margin-top: -2px;
          margin-left: -2px;
          animation: none;
          opacity: 1;
        }

        /* ══════════════════════════════════════
           STATE: grab  →  ✥
        ══════════════════════════════════════ */
        #xc-bracket[data-state="grab"]::before {
          content: '✥';
          display: block;
          font-size: 13px;
          color: #FF88FF;
          text-shadow: 0 0 10px rgba(255,136,255,0.8);
          margin-top: -7px;
          margin-left: -3px;
        }
        #xc-caret[data-state="grab"]::before {
          content: '·';
          display: block;
          font-size: 16px;
          color: rgba(255,136,255,0.4);
          animation: none;
          opacity: 1;
        }

        /* ─── Blink animation for caret ─── */
        @keyframes xc-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ─── Disable on touch / reduced motion ─── */
        @media (pointer: coarse) {
          #xc-bracket, #xc-caret { display: none !important; }
          *, *::before, *::after  { cursor: auto !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          #xc-caret[data-state="default"]::before { animation: none; opacity: 1; }
        }
      `}</style>
    </>
  );
}