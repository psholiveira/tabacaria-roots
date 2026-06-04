// components/ProductImage.jsx — placeholder por categoria, ou foto real com carrossel

import { useState, useRef } from 'react';
import { CAT_COLORS } from '../data.js';

const Silhouettes = {
  narguile: (
    <svg viewBox="0 0 100 140" width="50%" height="80%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6">
      <ellipse cx="50" cy="115" rx="28" ry="14"/>
      <path d="M50 105V60"/><circle cx="50" cy="50" r="14"/>
      <path d="M50 36V20M40 28h20"/><path d="M64 50q20 5 22 28" />
    </svg>
  ),
  sedas: (
    <svg viewBox="0 0 100 100" width="60%" height="60%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6">
      <rect x="22" y="22" width="56" height="72" rx="3"/>
      <path d="M30 36h40M30 46h40M30 56h40M30 66h40"/>
    </svg>
  ),
  tabacos: (
    <svg viewBox="0 0 100 100" width="60%" height="55%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6">
      <path d="M20 35h60v45H20z"/>
      <path d="M30 45h40v25H30z"/><path d="M30 35V25h40v10"/>
    </svg>
  ),
  palhas: (
    <svg viewBox="0 0 100 100" width="50%" height="60%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6">
      <path d="M50 20v60M40 20l20 60M60 20 40 80"/>
    </svg>
  ),
  charutos: (
    <svg viewBox="0 0 120 50" width="65%" height="35%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6">
      <rect x="10" y="20" width="90" height="14" rx="7"/>
      <circle cx="105" cy="27" r="3"/>
    </svg>
  ),
  piteiras: (
    <svg viewBox="0 0 100 100" width="60%" height="55%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6">
      <path d="M22 60q-2-22 18-22h20q22 0 22 22"/>
      <path d="M40 38V25M60 38V25"/>
    </svg>
  ),
  isqueiros: (
    <svg viewBox="0 0 100 100" width="40%" height="65%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6">
      <rect x="32" y="30" width="36" height="55" rx="3"/>
      <path d="M50 25q-6-10 0-18 6 8 0 18Z"/>
    </svg>
  ),
  bongs: (
    <svg viewBox="0 0 100 140" width="45%" height="80%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6">
      <path d="M30 130h40q4 0 4-4V70q-12-8-12-30V20H38v20q0 22-12 30v56q0 4 4 4Z"/>
      <path d="M62 22V16H38v6"/>
    </svg>
  ),
};

export function ProductImage({ product, size = 'md', carousel = false, children }) {
  const allPhotos = product.photos?.length > 0
    ? product.photos
    : (product.photo ? [product.photo] : []);

  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);

  const c = CAT_COLORS[product.cat] || '#3a3a35';
  const heights = { sm: 110, md: 180, lg: 320 };
  const h = heights[size] || heights.md;

  const multi = carousel && allPhotos.length > 1;

  const prev = (e) => {
    e.stopPropagation();
    setIdx(i => (i - 1 + allPhotos.length) % allPhotos.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setIdx(i => (i + 1) % allPhotos.length);
  };

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIdx(i => (i + 1) % allPhotos.length);
      else        setIdx(i => (i - 1 + allPhotos.length) % allPhotos.length);
    }
    touchX.current = null;
  };

  if (allPhotos.length > 0) {
    return (
      <div
        style={{
          width: '100%', borderRadius: 'inherit',
          background: 'var(--bg-elev-2)',
          position: 'relative', overflow: 'hidden',
          userSelect: 'none',
        }}
        onTouchStart={multi ? onTouchStart : undefined}
        onTouchEnd={multi ? onTouchEnd : undefined}
      >
        <img
          src={allPhotos[idx]}
          alt={product.name}
          style={{ display: 'block', width: '100%', height: 'auto', pointerEvents: 'none' }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 8, height: '100%',
          background: 'linear-gradient(180deg, var(--rasta-green) 0 33.33%, var(--rasta-gold) 33.33% 66.66%, var(--rasta-red) 66.66% 100%)',
        }}/>

        {multi && (
          <>
            <button onClick={prev} style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              width: 34, height: 34, borderRadius: 99,
              background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, zIndex: 2, lineHeight: 1,
            }}>‹</button>
            <button onClick={next} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 34, height: 34, borderRadius: 99,
              background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, zIndex: 2, lineHeight: 1,
            }}>›</button>

            <div style={{
              position: 'absolute', bottom: 10, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: 5, zIndex: 2,
            }}>
              {allPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                  style={{
                    width: i === idx ? 18 : 6, height: 6, borderRadius: 99,
                    background: i === idx ? 'var(--rasta-gold)' : 'rgba(255,255,255,0.4)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'width 0.2s ease, background 0.2s ease',
                  }}
                />
              ))}
            </div>

            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(0,0,0,0.55)', borderRadius: 99,
              padding: '2px 8px', fontSize: 11, color: '#fff', fontWeight: 600,
              zIndex: 2,
            }}>{idx + 1}/{allPhotos.length}</div>
          </>
        )}

        {children}
      </div>
    );
  }

  return (
    <div className="placeholder-img" style={{
      width: '100%', height: h, borderRadius: 'inherit',
      background: `radial-gradient(circle at 30% 30%, ${c}40 0%, transparent 70%), var(--bg-elev-2)`,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 14, height: '100%',
        background: 'linear-gradient(180deg, var(--rasta-green) 0 33.33%, var(--rasta-gold) 33.33% 66.66%, var(--rasta-red) 66.66% 100%)',
        opacity: 0.85,
      }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Silhouettes[product.cat] || null}
      </div>
      <div style={{
        position: 'absolute', left: 22, bottom: 10, right: 10,
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 11, letterSpacing: '0.16em',
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase',
      }}>{product.brand}</div>
      {children}
    </div>
  );
}
