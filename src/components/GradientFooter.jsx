// components/GradientFooter.jsx — footer com brilho rasta subindo do chão.
// O conteúdo vem primeiro; a faixa borrada fica ancorada no fim do próprio footer
// e entra na tela junto com o scroll (nada fixo na viewport).
// Adaptado do "Ruixen Gradient Footer" (design do gradiente inspirado no Dia Browser).

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
    out.push(peak * (valley + (1 - valley) * eased)); // fração da altura da faixa
  }
  return out;
}

export function GradientFooter({
  children,
  gradientHeight = '40vh', // altura da faixa no fim do footer
  bottom = 0,              // afasta a faixa do chão (ex: altura da bottom nav no mobile)
  bars = 9,
  blur = 18,               // px
  peak = 0.98,
  valley = 0.55,
  stops = ROOTS_STOPS,
  className,
  style,
}) {
  const gradient = `linear-gradient(to top, ${stops.map(s => `${s.color} ${s.offset * 100}%`).join(', ')})`;
  const bottomCss = typeof bottom === 'number' ? `${bottom}px` : bottom;

  return (
    <footer
      className={className}
      style={{ position: 'relative', paddingBottom: `calc(${gradientHeight} + ${bottomCss})`, ...style }}
    >
      {children}

      {/* barras em CSS: o blur é rasterizado na resolução da tela (SVG esticado borrava pixelado) */}
      <div
        aria-hidden
        style={{
          position: 'absolute', left: 0, right: 0, bottom,
          height: gradientHeight, pointerEvents: 'none', overflow: 'hidden',
        }}
      >
        {bellHeights(bars, peak, valley).map((h, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i * 100) / bars}%`, width: `${123 / bars}%`,
              // passa do chão pra borda de baixo do blur não clarear
              bottom: -2 * blur, height: `calc(${h * 100}% + ${2 * blur}px)`,
              background: gradient,
              filter: `blur(${blur}px)`,
            }}
          />
        ))}
      </div>
    </footer>
  );
}
