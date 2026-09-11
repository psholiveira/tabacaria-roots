// components/Hero.jsx — hero da Home (desktop e mobile): assinatura "ROOTS" desenhada,
// leão fixo no centro, fumaça com parallax, tagline, CTAs e status da loja.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORE_INFO } from '../data.js';
import { isStoreOpen, getCloseTimeLabel } from '../config.js';
import { reducedMotion } from '../lib/motion.js';

gsap.registerPlugin(ScrollTrigger);

export const WA_LINK = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Fala Roots! Quero fazer um pedido.')}`;
const RASTA_H     = 'linear-gradient(90deg,#1f6b35 0 33.33%,#f5b528 33.33% 66.66%,#c8232c 66.66% 100%)';
const RASTA_H_REV = 'linear-gradient(90deg,#c8232c 0 33.33%,#f5b528 33.33% 66.66%,#1f6b35 66.66% 100%)';
export const MONO = "'JetBrains Mono', monospace";

const SIGNATURE_LOOP = true;   // false = desenha "ROOTS" uma vez só

export function scrollToVitrine() {
  document.getElementById('vitrine')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

// Botões magnéticos (só faz sentido com mouse). Devolve a função de limpeza.
export function attachMagnets(root) {
  const offs = [];
  root.querySelectorAll('[data-magnet]').forEach(el => {
    const move = e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.22,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.5, ease: 'power3.out',
      });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    offs.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); });
  });
  return () => offs.forEach(off => off());
}

export function Hero({ mobile = false, minHeight = 'calc(100svh - 72px)' }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;
    let offMagnets = () => {};

    const ctx = gsap.context(() => {
      const stroke = root.querySelector('[data-sig-text]');
      const fill   = root.querySelector('[data-sig-fill]');

      if (reducedMotion()) {
        if (fill) fill.style.opacity = 1;
        return;
      }

      // intro
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-hero-item]', { y: 34, opacity: 0, duration: 1.1, stagger: 0.14 })
        .from('[data-lion-img]', { opacity: 0, x: 90, scale: 1.12, duration: 1.6 }, 0.1);

      // saída do hero + parallax da fumaça (o leão fica fixo no centro)
      const heroScrub = { trigger: root, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-hero-inner]', { y: -110, opacity: 0, ease: 'none', scrollTrigger: heroScrub });
      root.querySelectorAll('[data-smoke]').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? -140 : 180, ease: 'none', scrollTrigger: heroScrub });
      });

      if (!mobile) offMagnets = attachMagnets(root);

      // assinatura "ROOTS" — precisa da Bebas carregada pra medir o traço
      if (!stroke || !fill) return;
      document.fonts.ready.catch(() => {}).then(() => {
        if (cancelled) return;
        ctx.add(() => {
          let len = 2400;
          try { len = Math.max(600, (stroke.getComputedTextLength() || 900) * 2.35); } catch {}
          gsap.set(stroke, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
          const tl = gsap.timeline({ repeat: SIGNATURE_LOOP ? -1 : 0, repeatDelay: 3.2, delay: 0.25 });
          tl.to(stroke, { strokeDashoffset: 0, duration: 3.6, ease: 'power1.inOut' })
            .to(fill, { opacity: 1, duration: 1.1, ease: 'power2.out' }, '-=1.15');
          if (SIGNATURE_LOOP) tl.to(fill, { opacity: 0, duration: 0.7, ease: 'power2.in' }, '+=2.4');
        });
      });
    }, root);

    ScrollTrigger.refresh();
    return () => { cancelled = true; offMagnets(); ctx.revert(); };
  }, [mobile]);

  const open = isStoreOpen();
  const statusText = open ? `Aberto agora · até ${getCloseTimeLabel()}` : 'Fechado agora · pedidos pelo Whats';

  return (
    <section ref={rootRef} data-hero="" style={{
      position: 'relative', minHeight,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: 'var(--rasta-green-deep)',
      padding: mobile ? '56px 20px' : 'clamp(64px,7vw,100px) clamp(16px,5vw,64px)',
    }}>
      <Smoke style={{ top: '-18%', right: '-8%', width: mobile ? '90vw' : 'min(70vw,780px)', height: mobile ? '90vw' : 'min(70vw,780px)' }}
        inner={{ background: 'radial-gradient(circle,#f5b528 0%,transparent 62%)', opacity: .22, filter: 'blur(10px)', animation: 'rootsDrift 18s ease-in-out infinite' }} />
      <Smoke style={{ bottom: '-26%', left: '-14%', width: mobile ? '80vw' : 'min(60vw,680px)', height: mobile ? '80vw' : 'min(60vw,680px)' }}
        inner={{ background: 'radial-gradient(circle,#c8232c 0%,transparent 60%)', opacity: .16, filter: 'blur(20px)', animation: 'rootsDrift 24s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(12,12,10,.42) 0%,rgba(13,61,29,0) 34%,rgba(12,12,10,.86) 100%)', pointerEvents: 'none' }} />

      <div data-lion="" style={{ position: 'absolute', inset: 0, margin: 'auto', width: mobile ? 'min(82vw,380px)' : 'min(52vw,620px)', height: 'fit-content', pointerEvents: 'none' }}>
        <img data-lion-img="" src="/assets/logo-roots-mark.png" alt="" style={{ display: 'block', width: '100%', opacity: .16, filter: 'drop-shadow(0 40px 80px rgba(0,0,0,.6))' }} />
      </div>

      <div data-hero-inner="" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1180, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div data-hero-item="" style={{ display: 'flex', alignItems: 'center', gap: mobile ? 10 : 14, marginBottom: mobile ? 16 : 'clamp(18px,3vw,30px)' }}>
          <span style={{ width: mobile ? 22 : 34, height: 3, background: RASTA_H }} />
          <span style={{ fontFamily: MONO, fontSize: mobile ? 9.5 : 11, letterSpacing: mobile ? '.24em' : '.34em', textTransform: 'uppercase', color: 'var(--accent)', whiteSpace: 'nowrap' }}>Tabacaria · Recife · desde 2017</span>
          <span style={{ width: mobile ? 22 : 34, height: 3, background: RASTA_H_REV }} />
        </div>

        <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>Roots Tabacaria — Recife</h1>

        <div data-hero-item="" style={{ width: '100%', maxWidth: 1100 }}>
          {/* no mobile o viewBox recorta as margens laterais pra letra encher a largura */}
          <svg viewBox={mobile ? '190 0 820 280' : '0 0 1200 280'} role="img" aria-label="Roots" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
            <defs>
              <linearGradient id="rootsInk" x1="0%" y1="0%" x2="100%" y2="30%">
                <stop offset="0%" stopColor="#f5b528" />
                <stop offset="52%" stopColor="#ffe08a" />
                <stop offset="100%" stopColor="#c8232c" />
              </linearGradient>
            </defs>
            <text data-sig-fill="" x="600" y="200" textAnchor="middle" fill="url(#rootsInk)" opacity="0"
              fontFamily="Bebas Neue, Impact, sans-serif" fontSize="240" letterSpacing="14">ROOTS</text>
            <text data-sig-text="" x="600" y="200" textAnchor="middle" fill="none" stroke="url(#rootsInk)" strokeWidth={mobile ? 3.2 : 2.4}
              strokeLinejoin="round" strokeLinecap="round" opacity="0"
              fontFamily="Bebas Neue, Impact, sans-serif" fontSize="240" letterSpacing="14">ROOTS</text>
          </svg>
        </div>

        <p data-hero-item="" className="display-tight" style={{ fontSize: mobile ? 'clamp(26px,7.4vw,34px)' : 'clamp(22px,3.4vw,42px)', letterSpacing: '.05em', lineHeight: 1.05, marginTop: mobile ? 2 : 'clamp(4px,1vw,10px)', color: 'var(--ink)' }}>
          One love, <span style={{ color: 'var(--accent)' }}>one heart,</span> one session.
        </p>

        <p data-hero-item="" style={{ maxWidth: 560, marginTop: mobile ? 14 : 18, fontSize: mobile ? 13.5 : 'clamp(14px,1.5vw,16px)', lineHeight: 1.6, color: 'rgba(246,241,228,.78)', textWrap: 'pretty' }}>
          {mobile
            ? 'Curadoria de tabaco, narguilé, sedas, bongs e acessórios. Pedido direto no WhatsApp, retirada na Boa Vista ou entrega no Recife.'
            : 'Curadoria de tabaco, narguilé, sedas, bongs e acessórios. Pedido direto no WhatsApp, retirada no balcão da Boa Vista ou entrega em toda a Região Metropolitana do Recife.'}
        </p>

        <div data-hero-item="" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: mobile ? 24 : 'clamp(24px,3.5vw,38px)', width: mobile ? '100%' : 'auto' }}>
          <a data-magnet="" className="hero-cta hero-cta-solid" href={WA_LINK} target="_blank" rel="noreferrer" style={mobile ? { flex: '1 1 100%', justifyContent: 'center' } : undefined}>
            Fazer pedido no Whats <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
          </a>
          <button data-magnet="" className="hero-cta hero-cta-outline" onClick={scrollToVitrine} style={mobile ? { flex: '1 1 100%', justifyContent: 'center' } : undefined}>
            Ver a vitrine
          </button>
        </div>

        <div data-hero-item="" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: mobile ? 22 : 'clamp(22px,3vw,34px)', fontFamily: MONO, fontSize: mobile ? 10 : 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,241,228,.62)' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: open ? 'var(--positive)' : 'var(--danger)',
            boxShadow: `0 0 0 4px ${open ? 'rgba(78,163,94,.18)' : 'rgba(200,35,44,.18)'}`,
          }} />
          <span>{statusText}</span>
        </div>
      </div>
    </section>
  );
}

// Fumaça: o wrapper recebe o parallax do GSAP, o miolo fica com o drift em CSS —
// os dois mexem em transform e se fossem o mesmo elemento um anularia o outro.
function Smoke({ style, inner }) {
  return (
    <div data-smoke="" style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <div data-smoke-drift="" style={{ position: 'absolute', inset: 0, borderRadius: '50%', ...inner }} />
    </div>
  );
}
