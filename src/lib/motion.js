// lib/motion.js — helpers GSAP reaproveitados pelo drawer da sacola, kit e troca de telas

import gsap from 'gsap';

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pulo elástico num contador/badge quando o valor muda.
export function pop(el, from = 1.3) {
  if (!el || reducedMotion()) return;
  gsap.fromTo(el, { scale: from }, { scale: 1, duration: 0.55, ease: 'elastic.out(1,0.45)', overwrite: 'auto' });
}

// Balança horizontal curta — "não pode" / removido.
export function shake(el) {
  if (!el || reducedMotion()) return;
  gsap.fromTo(el, { x: 0 }, { x: -5, duration: 0.07, yoyo: true, repeat: 5, ease: 'power1.inOut', overwrite: 'auto', clearProps: 'x' });
}

// Some deslizando pro lado e recolhe a altura; chama onDone quando terminar
// (é aí que o React deve tirar o elemento do DOM).
export function collapseOut(el, onDone, { x = 48 } = {}) {
  if (!el || reducedMotion()) { onDone?.(); return; }
  el.style.overflow = 'hidden';
  el.style.pointerEvents = 'none';
  gsap.timeline({ onComplete: onDone })
    .to(el, { x, opacity: 0, duration: 0.24, ease: 'power2.in' })
    .to(el, { height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, borderWidth: 0, duration: 0.28, ease: 'power3.inOut' }, '-=0.06');
}

// Entrada em cascata de uma lista de elementos.
export function staggerIn(targets, { y = 22, x = 0, stagger = 0.05, delay = 0, duration = 0.6 } = {}) {
  if (!targets || !targets.length || reducedMotion()) return;
  return gsap.from(targets, { y, x, autoAlpha: 0, duration, stagger, delay, ease: 'expo.out', clearProps: 'transform,opacity,visibility' });
}
