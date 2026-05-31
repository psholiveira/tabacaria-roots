// components/CartToast.jsx — confirmação ao adicionar item no carrinho

import { useEffect } from 'react';
import { Icon } from './Icons.jsx';

const DISMISS_MS = 2800;

export function CartToast({ product, onClose, onViewCart, mobile = false }) {
  useEffect(() => {
    const t = setTimeout(onClose, DISMISS_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        zIndex: 400,
        ...(mobile
          ? { bottom: 78, left: 12, right: 12 }
          : { top: 20, right: 20, maxWidth: 320, width: '100%' }
        ),
        background: 'var(--bg-elev-2)',
        border: '1px solid var(--line-strong)',
        borderRadius: 14,
        padding: '12px 12px 12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        boxShadow: '0 10px 40px rgba(0,0,0,0.55)',
        animation: `${mobile ? 'toast-slide-up' : 'toast-slide-in'} 0.22s ease`,
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: 'var(--positive)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L19 7"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, color: 'var(--positive)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>
          Na sacola!
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onViewCart(); }}
        style={{
          background: 'var(--accent)', color: 'var(--accent-ink)',
          border: 'none', borderRadius: 8, padding: '8px 13px',
          fontSize: 11.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.02em',
        }}
      >
        Ver sacola
      </button>
    </div>
  );
}
