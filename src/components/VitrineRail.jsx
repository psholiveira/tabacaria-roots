// components/VitrineRail.jsx — "O que tá saindo da prateleira": rail infinito de cards
// (loop com GSAP, desacelera no hover, acelera com o scroll) + título palavra por palavra.
// Usado na Home desktop e mobile.

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES, formatBRL } from '../data.js';
import { Icon } from './Icons.jsx';
import { ProductImage } from './ProductImage.jsx';
import { SkeletonGrid } from './SkeletonCard.jsx';
import { reducedMotion } from '../lib/motion.js';
import { attachMagnets, MONO } from './Hero.jsx';

gsap.registerPlugin(ScrollTrigger);

const RAIL_SECONDS    = 44;
const RAIL_MIN_ITEMS  = 8;      // abaixo disso a lista repete pra encher a faixa
const VITRINE_SPEED   = 1;      // 0.3 – 2.5 (divide os segundos do loop)

const RAIL_TAGS = {
  top:    { label: 'Mais vendido', bg: '#1f6b35', ink: '#ffffff' },
  novo:   { label: 'Novo',         bg: '#f5b528', ink: '#1a1408' },
  import: { label: 'Importado',    bg: '#c8232c', ink: '#ffffff' },
};

function railTag(p) {
  const tags = p.tags || [];
  if (p.bestseller || tags.includes('top')) return RAIL_TAGS.top;
  if (tags.includes('novo'))   return RAIL_TAGS.novo;
  if (tags.includes('import')) return RAIL_TAGS.import;
  return null;
}

// Mais vendidos primeiro, depois novos e importados, depois o resto — e repete até ter
// cards suficientes pro loop não deixar buraco na tela.
function pickRailItems(products) {
  const rank = p => {
    const tags = p.tags || [];
    if (p.bestseller || tags.includes('top')) return 0;
    if (tags.includes('novo'))   return 1;
    if (tags.includes('import')) return 2;
    return 3;
  };
  const base = products.slice().sort((a, b) => rank(a) - rank(b)).slice(0, 12);
  if (!base.length) return [];
  const out = [];
  while (out.length < RAIL_MIN_ITEMS) out.push(...base);
  return out;
}

export function VitrineRail({ products, loading, go, openProduct, addToCart, mobile = false, scrollMarginTop = 72 }) {
  const rootRef   = useRef(null);
  const railItems = useMemo(() => pickRailItems(products), [products]);

  // largura dos cards muda com o viewport → recria o loop. Só a LARGURA conta:
  // no celular a barra de endereço some/aparece ao rolar e dispara resize só de
  // altura — recriar o loop aí zerava a vitrine a cada rolada.
  const [resizeTick, setResizeTick] = useState(0);
  useEffect(() => {
    let t, lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(t); t = setTimeout(() => setResizeTick(n => n + 1), 200);
    };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  // título palavra por palavra + botão magnético
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    let offMagnets = () => {};
    const ctx = gsap.context(() => {
      root.querySelectorAll('[data-head]').forEach(head => {
        const words = head.querySelectorAll('[data-word]');
        if (!words.length) return;
        gsap.from(words, {
          yPercent: 115, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.05,
          scrollTrigger: { trigger: head, start: 'top 86%' },
        });
      });
      if (!mobile) offMagnets = attachMagnets(root);
    }, root);
    return () => { offMagnets(); ctx.revert(); };
  }, [mobile]);

  // rail: loop infinito, desacelera no hover/toque, acelera com o scroll
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    const listeners = [];
    let idle;
    let cancelled = false;
    let ctx;

    document.fonts.ready.catch(() => {}).then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const loopX = (el, seconds) => {
          if (!el) return null;
          const half = el.scrollWidth / 2;
          if (!half) return null;
          gsap.set(el, { x: 0 });
          return gsap.to(el, {
            x: -half, duration: seconds / VITRINE_SPEED, ease: 'none', repeat: -1,
            modifiers: { x: v => (parseFloat(v) % half) + 'px' },
          });
        };

        const rail = loopX(root.querySelector('[data-rail]'), RAIL_SECONDS);

        const mask = root.querySelector('[data-rail-mask]');
        if (mask && rail) {
          const slow = () => gsap.to(rail, { timeScale: 0.18, duration: 0.5 });
          const back = () => gsap.to(rail, { timeScale: 1, duration: 0.7 });
          const on = mobile ? ['touchstart', 'touchend'] : ['mouseenter', 'mouseleave'];
          mask.addEventListener(on[0], slow, { passive: true });
          mask.addEventListener(on[1], back, { passive: true });
          listeners.push(() => { mask.removeEventListener(on[0], slow); mask.removeEventListener(on[1], back); });
        }

        if (rail) {
          ScrollTrigger.create({
            start: 0, end: 'max',
            onUpdate: self => {
              const boost = 1 + Math.min(7, Math.abs(self.getVelocity()) / 320);
              const dir = self.direction === -1 ? -1 : 1;
              rail.timeScale(boost * dir);
              clearTimeout(idle);
              idle = setTimeout(() => {
                gsap.to(rail, { timeScale: 1, duration: 0.8, ease: 'power2.out' });
              }, 180);
            },
          });
        }
      }, root);
    });

    return () => { cancelled = true; clearTimeout(idle); listeners.forEach(off => off()); ctx?.revert(); };
  }, [railItems, resizeTick, mobile]);

  const padX = mobile ? '16px' : 'clamp(16px,5vw,64px)';

  return (
    <section ref={rootRef} id="vitrine" style={{
      position: 'relative', scrollMarginTop,
      padding: mobile ? '44px 0 40px' : 'clamp(64px,9vw,120px) 0 clamp(56px,8vw,100px)',
      background: 'var(--bg)',
    }}>
      <div style={{ maxWidth: 1440, margin: `0 auto ${mobile ? '22px' : 'clamp(30px,4vw,52px)'}`, padding: `0 ${padX}`, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: mobile ? 12 : 20 }}>
        <div data-head="" style={{ display: 'flex', alignItems: 'center', gap: mobile ? 12 : 16 }}>
          {/* marcador: três listras curtas nas cores do reggae */}
          <span aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
            {['var(--rasta-red)', 'var(--rasta-green)', 'var(--rasta-gold)'].map(c => (
              <span key={c} style={{ display: 'block', width: mobile ? 22 : 28, height: 3, borderRadius: 2, background: c }} />
            ))}
          </span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: mobile ? 'clamp(24px,7vw,30px)' : 'clamp(26px,3.2vw,42px)', lineHeight: 1.04, letterSpacing: '-.02em', margin: 0 }}>
            {['O', 'que', 'tá', 'saindo', 'da', 'prateleira.'].map((w, i) => (
              <Fragment key={i}>{i > 0 && ' '}<span data-word="" style={{ display: 'inline-block' }}>{w}</span></Fragment>
            ))}
          </h2>
        </div>
        <p style={{ maxWidth: 340, fontSize: mobile ? 13 : 14, lineHeight: 1.65, color: 'var(--ink-dim)', textWrap: 'pretty', margin: 0 }}>
          Estoque girando todo dia. Passa o olho, escolhe e manda o nome no Whats que a gente separa.
        </p>
      </div>

      {loading ? (
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: `0 ${padX}` }}>
          <SkeletonGrid count={mobile ? 2 : 4} columns={mobile ? 2 : 4} gap={mobile ? 12 : 18} />
        </div>
      ) : railItems.length > 0 ? (
        <div data-rail-mask="" style={{
          position: 'relative', width: '100%', overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%)',
          maskImage: 'linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%)',
        }}>
          <div data-rail="" style={{ display: 'flex', gap: mobile ? 12 : 18, width: 'max-content', padding: mobile ? '6px 12px 6px 0' : '8px 18px 8px 0', willChange: 'transform' }}>
            {railItems.concat(railItems).map((p, i) => (
              <RailCard key={`${p.id}-${i}`} product={p} onTap={() => openProduct(p)} addToCart={addToCart} mobile={mobile} />
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ maxWidth: 1440, margin: `${mobile ? '22px' : 'clamp(30px,4vw,46px)'} auto 0`, padding: `0 ${padX}` }}>
        <button data-magnet="" className="hero-cta hero-cta-line" onClick={() => go('catalog')} style={mobile ? { width: '100%', justifyContent: 'center' } : undefined}>
          Ver catálogo completo <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
        </button>
      </div>
    </section>
  );
}

function RailCard({ product, onTap, addToCart, mobile }) {
  const tag = railTag(product);
  const cat = CATEGORIES.find(c => c.id === product.cat)?.label || product.cat;
  return (
    <article className="rail-card" onClick={onTap} style={mobile ? { width: 'min(62vw, 240px)' } : undefined}>
      <div style={{ position: 'relative', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
        <ProductImage product={product} size="sm" />
        {tag && (
          <span style={{
            position: 'absolute', left: 12, top: 12, padding: '4px 9px', borderRadius: 3,
            fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
            background: tag.bg, color: tag.ink,
          }}>{tag.label}</span>
        )}
      </div>
      <div style={{ padding: mobile ? '12px 12px 14px' : '16px 16px 18px', borderTop: '1px solid var(--line)' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 7 }}>{cat}</div>
        <div style={{ fontSize: mobile ? 13 : 14, fontWeight: 600, lineHeight: 1.3, minHeight: 36, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          <div>
            {product.oldPrice ? (
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>{formatBRL(product.oldPrice)}</div>
            ) : null}
            <div className="display" style={{ fontSize: 16, lineHeight: 1 }}>{formatBRL(product.price || 0)}</div>
          </div>
          {addToCart && (
            <button
              aria-label={`Adicionar ${product.name} à sacola`}
              onClick={(e) => { e.stopPropagation(); addToCart({ ...product, selectedVariation: product.variations?.[0] ?? null }); }}
              style={{
                width: 32, height: 32, borderRadius: 8, border: 'none',
                background: 'var(--accent)', color: 'var(--accent-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <Icon.plus />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
