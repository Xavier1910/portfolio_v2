import { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]();';

export default function CodeRain({ opacity = 0.07 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const cols = () => Math.floor(canvas.width / 16);
    let drops = Array(cols()).fill(1);

    // Throttle: only draw every ~60 ms (~16 fps) — enough for ambient rain
    let last = 0;
    let raf;

    const draw = (ts) => {
      raf = requestAnimationFrame(draw); // schedule next before heavy work

      if (ts - last < 60) return;
      last = ts;

      ctx.fillStyle = 'rgba(5,11,20,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px JetBrains Mono, monospace';

      // Sync drops array length with current column count
      const c = cols();
      if (drops.length !== c) drops = Array(c).fill(1);

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const brightness = Math.random();
        ctx.fillStyle = brightness > 0.95 ? '#ffffff'
                      : brightness > 0.8  ? '#39FF88'
                      :                     '#0B3D22';
        ctx.fillText(char, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity, zIndex: 0 }}
      aria-hidden="true"
    />
  );
}