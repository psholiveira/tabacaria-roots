// components/KineticMenu.jsx — menu fullscreen com painéis em cascata + botão "Menu/Fechar"
// Adaptado do "Sterling Gate Kinetic Navigation" pra paleta e navegação da Roots.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { STORE_INFO } from '../data.js';

gsap.registerPlugin(CustomEase);
CustomEase.create('knav', '0.65, 0.01, 0.05, 0.99');

const WA_LINK = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Fala Roots! Quero fazer um pedido.')}`;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const LINKS = [
  { id: 'home',    label: 'Início',        shape: 1 },
  { id: 'catalog', label: 'Catálogo',      shape: 2 },
  { id: 'kit',     label: 'Monte seu kit', shape: 3 },
  { id: 'store',   label: 'A loja',        shape: 4 },
  { id: 'whats',   label: 'Falar no Whats', shape: 5, href: WA_LINK },
];

// ─── Botão do header: texto "Menu"/"Fechar" desliza, ícone "+" vira "×" ──────
export function MenuButton({ open, onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const texts = el.querySelectorAll('.knav-btn-text p');
    const icon  = el.querySelector('.knav-icon');
    const d = reducedMotion() ? 0 : 0.6;
    gsap.to(texts, { yPercent: open ? -100 : 0, stagger: open ? 0.08 : 0, duration: d, ease: 'knav', overwrite: 'auto' });
    gsap.to(icon,  { rotate: open ? 315 : 0, duration: d, ease: 'knav', overwrite: 'auto' });
    return () => gsap.killTweensOf([texts, icon]);
  }, [open]);

  return (
    <button ref={ref} className="knav-btn" onClick={onClick} aria-expanded={open} aria-controls="knav">
      <span className="knav-btn-text" aria-hidden="true">
        <p>Menu</p>
        <p>Fechar</p>
      </span>
      <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
      <svg className="knav-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"/>
        <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"/>
        <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"/>
        <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"/>
        <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"/>
        <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"/>
      </svg>
    </button>
  );
}

// ─── Overlay fullscreen ───────────────────────────────────────────────────────
export function KineticMenu({ open, onClose, go, screen }) {
  const ref = useRef(null);
  const firstRender = useRef(true);

  // abre / fecha
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wrap    = root;
    const overlay = root.querySelector('.knav-overlay');
    const menu    = root.querySelector('.knav-menu');
    const panels  = root.querySelectorAll('.knav-panel');
    const links   = root.querySelectorAll('.knav-link');
    const fades   = root.querySelectorAll('[data-menu-fade]');

    // primeira montagem: só garante fechado, sem animar
    if (firstRender.current) {
      firstRender.current = false;
      gsap.set(wrap, { display: 'none' });
      return;
    }

    document.body.style.overflow = open ? 'hidden' : '';

    if (reducedMotion()) {
      gsap.set(wrap, { display: open ? 'block' : 'none' });
      gsap.set([overlay, menu, panels, links, fades], { clearProps: 'all' });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'knav', duration: 0.7 } });
    if (open) {
      wrap.setAttribute('data-nav', 'open');
      tl.set(wrap, { display: 'block' })
        .set(menu, { xPercent: 0 }, '<')
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, '<')
        .fromTo(panels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, '<')
        .fromTo(links, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, '<+=0.35')
        .fromTo(fades, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: 'all' }, '<+=0.2');
    } else {
      wrap.setAttribute('data-nav', 'closed');
      tl.to(overlay, { autoAlpha: 0 })
        .to(menu, { xPercent: 120 }, '<')
        .set(wrap, { display: 'none' });
    }
    return () => tl.kill();
  }, [open]);

  // formas de fundo reagindo ao hover de cada link
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const shapesBox = root.querySelector('.knav-shapes');
    const offs = [];
    root.querySelectorAll('.knav-item[data-shape]').forEach(item => {
      const shape = shapesBox?.querySelector(`.knav-shape-${item.dataset.shape}`);
      if (!shape) return;
      const els = shape.querySelectorAll('.shape-element');
      const enter = () => {
        shapesBox.querySelectorAll('.knav-shape').forEach(s => s.classList.remove('active'));
        shape.classList.add('active');
        gsap.fromTo(els,
          { scale: 0.5, opacity: 0, rotation: -10, transformOrigin: '50% 50%' },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)', overwrite: 'auto' });
      };
      const leave = () => {
        gsap.to(els, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto',
          onComplete: () => shape.classList.remove('active') });
      };
      item.addEventListener('mouseenter', enter);
      item.addEventListener('mouseleave', leave);
      offs.push(() => { item.removeEventListener('mouseenter', enter); item.removeEventListener('mouseleave', leave); });
    });
    return () => offs.forEach(off => off());
  }, []);

  // Esc fecha
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // se desmontar aberto, libera o scroll
  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  const pick = (l) => { onClose(); if (!l.href) go(l.id); };

  return (
    <div ref={ref} id="knav" className="knav-wrap" data-nav="closed" aria-hidden={!open}>
      <div className="knav-overlay" onClick={onClose} />
      <nav className="knav-menu" aria-label="Menu principal">
        <div className="knav-bg">
          <div className="knav-panel first" />
          <div className="knav-panel second" />
          <div className="knav-panel" />
          <Shapes />
        </div>

        <div className="knav-content">
          <ul className="knav-list">
            {LINKS.map((l, i) => (
              <li key={l.id} className="knav-item" data-shape={l.shape}>
                {l.href ? (
                  <a className="knav-link" href={l.href} target="_blank" rel="noreferrer" onClick={onClose}>
                    <span className="knav-idx">0{i + 1}</span>
                    <span className="knav-link-text">{l.label}</span>
                    <span className="knav-link-bg" />
                  </a>
                ) : (
                  <button className={`knav-link ${screen === l.id ? 'is-active' : ''}`} onClick={() => pick(l)}>
                    <span className="knav-idx">0{i + 1}</span>
                    <span className="knav-link-text">{l.label}</span>
                    <span className="knav-link-bg" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="knav-footer">
            <div data-menu-fade>
              <div className="knav-foot-label">Lojas</div>
              <div>Av. Conde da Boa Vista, 247</div>
              <div>Rua do Hospício, 250</div>
              <div className="knav-foot-dim">Boa Vista · Recife/PE</div>
            </div>
            <div data-menu-fade>
              <div className="knav-foot-label">Horário</div>
              {STORE_INFO.hours.map(h => <div key={h.day}>{h.day} · {h.time}</div>)}
            </div>
            <div data-menu-fade>
              <div className="knav-foot-label">Contato</div>
              <a href={WA_LINK} target="_blank" rel="noreferrer">{STORE_INFO.phone}</a>
              <a href="https://instagram.com/tabacariareciferoots" target="_blank" rel="noreferrer">{STORE_INFO.instagram}</a>
            </div>
            <div data-menu-fade className="knav-foot-note">
              <span className="rasta-stripe" style={{ width: 28, height: 3, display: 'inline-block' }} />
              One love, one heart, one session.
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Formas abstratas em tons rasta — uma por link, aparecem no hover
function Shapes() {
  const gold  = a => `rgba(245,181,40,${a})`;
  const green = a => `rgba(78,163,94,${a})`;
  const red   = a => `rgba(200,35,44,${a})`;
  return (
    <div className="knav-shapes" aria-hidden="true">
      <svg className="knav-shape knav-shape-1" viewBox="0 0 400 400" fill="none">
        <circle className="shape-element" cx="80"  cy="120" r="40" fill={gold(.18)} />
        <circle className="shape-element" cx="300" cy="80"  r="60" fill={green(.16)} />
        <circle className="shape-element" cx="200" cy="300" r="80" fill={red(.12)} />
        <circle className="shape-element" cx="350" cy="280" r="30" fill={gold(.18)} />
      </svg>
      <svg className="knav-shape knav-shape-2" viewBox="0 0 400 400" fill="none">
        <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke={gold(.22)} strokeWidth="60" />
        <path className="shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke={green(.18)} strokeWidth="40" />
      </svg>
      <svg className="knav-shape knav-shape-3" viewBox="0 0 400 400" fill="none">
        {[[50,50,8,gold],[150,50,8,green],[250,50,8,red],[350,50,8,gold],
          [100,150,12,green],[200,150,12,red],[300,150,12,gold],
          [50,250,10,red],[150,250,10,gold],[250,250,10,green],[350,250,10,red],
          [100,350,6,gold],[200,350,6,green],[300,350,6,red]].map(([x,y,r,c],i) => (
          <circle key={i} className="shape-element" cx={x} cy={y} r={r} fill={c(.35)} />
        ))}
      </svg>
      <svg className="knav-shape knav-shape-4" viewBox="0 0 400 400" fill="none">
        <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill={green(.16)} />
        <path className="shape-element" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill={red(.14)} />
      </svg>
      <svg className="knav-shape knav-shape-5" viewBox="0 0 400 400" fill="none">
        <line className="shape-element" x1="0"   y1="100" x2="300" y2="400" stroke={green(.2)} strokeWidth="30" />
        <line className="shape-element" x1="100" y1="0"   x2="400" y2="300" stroke={gold(.18)}  strokeWidth="25" />
        <line className="shape-element" x1="200" y1="0"   x2="400" y2="200" stroke={red(.14)}   strokeWidth="20" />
      </svg>
    </div>
  );
}
