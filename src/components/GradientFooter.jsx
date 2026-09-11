// components/GradientFooter.jsx — footer com brilho rasta preso ao rodapé da viewport.
// O conteúdo vem primeiro; a faixa borrada fica fixa no chão e cresce nos últimos
// pixels de scroll, chegando à altura total exatamente no fim da página.
// Adaptado do "Ruixen Gradient Footer" (design do gradiente inspirado no Dia Browser).

import { useEffect, useId, useRef, useState } from 'react';

const VBW = 1271;
const VBH = 599;

// chão (0) → topo (1): preto → verde profundo → verde → dourado → vermelho → transparente
const ROOTS_STOPS = [
  { offset: 0,    color: '#0c0c0a' },
  { offset: 0.16, color: '#0d3d1d' },
  { offset: 0.34, color: '#1f6b35' },
  { offset: 0.52, color: '#f5b528' },
  { offset: 0.68, color: '#e89b1a' },
  { offset: 0.84, color: '#c8232c' },
  { offset: 1,    color: '#c8232c00' },
];

// Curva de altura em "pirâmide" suave: bordas baixas, meio mais alto.
function bellHeights(n, peak, valley) {
  const out = [];
  const mid = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid;
    const eased = 1 - Math.pow(t, 1.24);
    out.push(peak * VBH * (valley + (1 - valley) * eased));
  }
  return out;
}

const clamp01 = v => Math.max(0, Math.min(1, v));

export function GradientFooter({
  children,
  gradientHeight = '40vh', // altura da faixa; também é a distância de scroll da revelação
  minReveal = 0.045,       // tira fina no chão antes da revelação (0 = escondida)
  bars = 9,
  blur = 15,
  peak = 0.98,
  valley = 0.55,
  stops = ROOTS_STOPS,
  className,
  style,
}) {
  const uid = useId().replace(/:/g, '');
  const bandRef = useRef(null);
  const [progress, setProgress] = useState(minReveal);

  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    const doc = el.ownerDocument;
    const win = doc.defaultView ?? window;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const h = el.offsetHeight || 1;
      const left = doc.documentElement.scrollHeight - win.innerHeight - win.scrollY;
      const t = clamp01((h - left) / h);
      setProgress(minReveal + (1 - minReveal) * t);
    };
    const onScroll = () => { if (!raf) raf = win.requestAnimationFrame(measure); };
    measure();
    win.addEventListener('scroll', onScroll, { passive: true });
    win.addEventListener('resize', onScroll, { passive: true });
    // troca de tela muda a altura da página sem evento de scroll
    const ro = 'ResizeObserver' in win ? new win.ResizeObserver(onScroll) : null;
    ro?.observe(doc.documentElement);
    return () => {
      win.removeEventListener('scroll', onScroll);
      win.removeEventListener('resize', onScroll);
      ro?.disconnect();
      if (raf) win.cancelAnimationFrame(raf);
    };
  }, [minReveal]);

  const colW = VBW / bars;

  return (
    <footer className={className} style={{ paddingBottom: gradientHeight, ...style }}>
      {children}

      {/* fixo na viewport — um ancestral com transform/filter capturaria ele */}
      <div
        ref={bandRef}
        aria-hidden
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          height: gradientHeight, pointerEvents: 'none',
          transformOrigin: 'bottom', transform: `scaleY(${progress})`,
          willChange: 'transform',
        }}
      >
        <svg
          style={{ height: '100%', width: '100%', display: 'block' }}
          viewBox={`0 0 ${VBW} ${VBH}`}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`grad-${uid}`} x1="0" y1="1" x2="0" y2="0">
              {stops.map((s, i) => <stop key={i} offset={s.offset} stopColor={s.color} />)}
            </linearGradient>
            <filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={blur} />
            </filter>
          </defs>
          {bellHeights(bars, peak, valley).map((barH, i) => (
            <g key={i} filter={`url(#blur-${uid})`}>
              <rect x={i * colW} y={VBH - barH} width={colW * 1.23} height={barH} fill={`url(#grad-${uid})`} />
            </g>
          ))}
        </svg>
      </div>
    </footer>
  );
}
