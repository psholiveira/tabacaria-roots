// components/CartButton.jsx — botão da sacola só com o ícone, animado com GSAP:
//  • hover: ícone balança e um pill com o total desliza pra fora
//  • clique: squish + onda dourada
//  • item adicionado: miniatura do produto voa até a sacola, ícone pula, badge estoura

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { formatBRL } from '../data.js';
import { Icon } from './Icons.jsx';
import { thumbUrl } from '../lib/images.js';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// última posição do ponteiro — origem da miniatura que voa até a sacola
let lastPointer = null;
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', e => { lastPointer = { x: e.clientX, y: e.clientY }; }, { passive: true, capture: true });
}

export function CartButton({ count = 0, total = 0, onClick, lastAdded }) {
  const btnRef   = useRef(null);
  const iconRef  = useRef(null);
  const badgeRef = useRef(null);
  const totalRef = useRef(null);
  const ringRef  = useRef(null);
  const prevCount = useRef(count);

  // hover: ícone balança + total desliza
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const enter = () => {
      if (reducedMotion()) return;
      gsap.timeline({ defaults: { overwrite: 'auto' } })
        .to(iconRef.current, { rotate: -12, y: -2, duration: 0.18, ease: 'power2.out' })
        .to(iconRef.current, { rotate: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.35)' });
      gsap.to(totalRef.current, { width: 'auto', opacity: 1, marginLeft: 8, duration: 0.45, ease: 'expo.out', overwrite: 'auto' });
    };
    const leave = () => {
      if (reducedMotion()) return;
      gsap.to(totalRef.current, { width: 0, opacity: 0, marginLeft: 0, duration: 0.35, ease: 'expo.out', overwrite: 'auto' });
    };
    btn.addEventListener('mouseenter', enter);
    btn.addEventListener('mouseleave', leave);
    return () => { btn.removeEventListener('mouseenter', enter); btn.removeEventListener('mouseleave', leave); };
  }, []);

  // item adicionado: miniatura voa + ícone pula + badge estoura
  useEffect(() => {
    if (count <= prevCount.current) { prevCount.current = count; return; }
    prevCount.current = count;
    const btn = btnRef.current;
    if (!btn) return;
    const pop = () => {
      if (reducedMotion()) return;
      gsap.timeline()
        .fromTo(btn, { scale: 1 }, { scale: 0.86, duration: 0.1, ease: 'power2.in' })
        .to(btn, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' })
        .fromTo(iconRef.current, { y: 0 }, { y: -7, duration: 0.14, ease: 'power2.out' }, 0)
        .to(iconRef.current, { y: 0, duration: 0.55, ease: 'bounce.out' }, 0.14)
        .fromTo(badgeRef.current, { scale: 0.2 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1.2,0.4)' }, 0.05)
        .fromTo(badgeRef.current, { background: '#ffe08a' }, { background: '#f5b528', duration: 0.8, ease: 'power2.out' }, 0.05);
    };
    if (reducedMotion() || !lastPointer) { pop(); return; }
    flyToCart(btn, lastAdded?.product, pop);
  }, [count]);

  // clique: squish + onda
  const handleClick = () => {
    if (!reducedMotion()) {
      gsap.timeline()
        .to(btnRef.current, { scale: 0.88, duration: 0.1, ease: 'power2.in' })
        .to(btnRef.current, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.45)' })
        .fromTo(ringRef.current, { scale: 0.6, opacity: 0.7 }, { scale: 2.2, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0);
    }
    onClick?.();
  };

  return (
    <button ref={btnRef} className="cartbtn" onClick={handleClick} aria-label={`Abrir sacola, ${count} ${count === 1 ? 'item' : 'itens'}`}>
      <span ref={ringRef} className="cartbtn-ring" aria-hidden="true" />
      <span ref={iconRef} className="cartbtn-icon"><Icon.cart size={17} /></span>
      <span ref={totalRef} className="cartbtn-total" aria-hidden="true">{count > 0 ? formatBRL(total) : 'Sacola vazia'}</span>
      {count > 0 && <span ref={badgeRef} className="cartbtn-badge">{count > 99 ? '99+' : count}</span>}
    </button>
  );
}

// Cria uma miniatura fixa na posição do clique e anima em arco até o botão.
function flyToCart(btn, product, onArrive) {
  const { x, y } = lastPointer;
  const r = btn.getBoundingClientRect();
  const tx = r.left + r.width / 2, ty = r.top + r.height / 2;

  const el = document.createElement('div');
  const photo = product?.photos?.[0] || product?.photo;
  el.className = 'cartbtn-fly';
  if (photo) el.style.backgroundImage = `url("${thumbUrl(photo)}")`;
  else el.classList.add('is-dot');
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
  document.body.appendChild(el);

  const dx = tx - x, dy = ty - y;
  // pico do arco: um pouco acima do botão, mas nunca fora da viewport
  const peakY = Math.max(Math.min(-60, dy - 60), 30 - y);
  gsap.timeline({ onComplete: () => { el.remove(); onArrive(); } })
    .fromTo(el, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: 'back.out(2)' })
    .to(el, { x: dx, duration: 0.75, ease: 'power1.inOut' }, 0.1)
    .to(el, { y: peakY, duration: 0.4, ease: 'power2.out' }, 0.1)
    .to(el, { y: dy, duration: 0.35, ease: 'power2.in' }, 0.5)
    .to(el, { scale: 0.25, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.7);
}
