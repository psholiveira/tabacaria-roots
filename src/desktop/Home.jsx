// desktop/Home.jsx — hero com assinatura animada + vitrine em rail infinito (GSAP)

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES, CAT_COLORS, STORE_INFO, formatBRL } from '../data.js';
import { isStoreOpen, getCloseTimeLabel } from '../config.js';
import { Icon } from '../components/Icons.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { SkeletonGrid } from '../components/SkeletonCard.jsx';
import { useProductsLoading } from '../store/products.js';
import { SectionHeader } from './Chrome.jsx';
import { FadeIn } from '../components/FadeIn.jsx';

gsap.registerPlugin(ScrollTrigger);

const WA_LINK = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Fala Roots! Quero fazer um pedido.')}`;
const RASTA_H     = 'linear-gradient(90deg,#1f6b35 0 33.33%,#f5b528 33.33% 66.66%,#c8232c 66.66% 100%)';
const RASTA_H_REV = 'linear-gradient(90deg,#c8232c 0 33.33%,#f5b528 33.33% 66.66%,#1f6b35 66.66% 100%)';
const MONO = "'JetBrains Mono', monospace";

const RAIL_SECONDS    = 44;
const RAIL_MIN_ITEMS  = 8;      // abaixo disso a lista repete pra encher a faixa
const VITRINE_SPEED   = 1;      // 0.3 – 2.5 (divide os segundos do loop)
const SIGNATURE_LOOP  = true;   // false = desenha "ROOTS" uma vez só

const RAIL_TAGS = {
  top:    { label: 'Mais vendido', bg: '#1f6b35', ink: '#ffffff' },
  novo:   { label: 'Novo',         bg: '#f5b528', ink: '#1a1408' },
  import: { label: 'Importado',    bg: '#c8232c', ink: '#ffffff' },
};

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

function scrollToVitrine() {
  document.getElementById('vitrine')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

export function DesktopHome({ products, go, openProduct, addToCart }) {
  const loading   = useProductsLoading();
  const rootRef   = useRef(null);
  const railItems = useMemo(() => pickRailItems(products), [products]);
  const novidades = products.filter(p => (p.tags || []).includes('novo'));

  // largura dos cards muda com o viewport → recria o loop
  const [resizeTick, setResizeTick] = useState(0);
  useEffect(() => {
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => setResizeTick(n => n + 1), 200); };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  // ── hero: assinatura, intro, parallax, títulos e botões magnéticos ──────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const listeners = [];
    let cancelled = false;

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
      const heroScrub = { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-hero-inner]', { y: -110, opacity: 0, ease: 'none', scrollTrigger: heroScrub });
      root.querySelectorAll('[data-smoke]').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? -140 : 180, ease: 'none', scrollTrigger: heroScrub });
      });

      // títulos palavra por palavra
      root.querySelectorAll('[data-head]').forEach(head => {
        const words = head.querySelectorAll('[data-word]');
        if (!words.length) return;
        gsap.from(words, {
          yPercent: 115, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.05,
          scrollTrigger: { trigger: head, start: 'top 86%' },
        });
      });

      // botões magnéticos
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
        listeners.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); });
      });

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
    return () => { cancelled = true; listeners.forEach(off => off()); ctx.revert(); };
  }, []);

  // ── rail: loop infinito, desacelera no hover, acelera com o scroll ──────────
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
          mask.addEventListener('mouseenter', slow);
          mask.addEventListener('mouseleave', back);
          listeners.push(() => { mask.removeEventListener('mouseenter', slow); mask.removeEventListener('mouseleave', back); });
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
  }, [railItems, resizeTick]);

  const open = isStoreOpen();
  const statusText = open ? `Aberto agora · até ${getCloseTimeLabel()}` : 'Fechado agora · pedidos pelo Whats';

  return (
    <div ref={rootRef}>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section data-hero="" style={{
        position: 'relative', minHeight: 'calc(100svh - 72px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: 'var(--rasta-green-deep)',
        padding: 'clamp(64px,7vw,100px) clamp(16px,5vw,64px)',
      }}>
        <Smoke style={{ top: '-18%', right: '-8%', width: 'min(70vw,780px)', height: 'min(70vw,780px)' }}
          inner={{ background: 'radial-gradient(circle,#f5b528 0%,transparent 62%)', opacity: .22, filter: 'blur(10px)', animation: 'rootsDrift 18s ease-in-out infinite' }} />
        <Smoke style={{ bottom: '-26%', left: '-14%', width: 'min(60vw,680px)', height: 'min(60vw,680px)' }}
          inner={{ background: 'radial-gradient(circle,#c8232c 0%,transparent 60%)', opacity: .16, filter: 'blur(20px)', animation: 'rootsDrift 24s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(12,12,10,.42) 0%,rgba(13,61,29,0) 34%,rgba(12,12,10,.86) 100%)', pointerEvents: 'none' }} />

        <div data-lion="" style={{ position: 'absolute', inset: 0, margin: 'auto', width: 'min(52vw,620px)', height: 'fit-content', pointerEvents: 'none' }}>
          <img data-lion-img="" src="/assets/logo-roots-mark.png" alt="" style={{ display: 'block', width: '100%', opacity: .16, filter: 'drop-shadow(0 40px 80px rgba(0,0,0,.6))' }} />
        </div>

        <div data-hero-inner="" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1180, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div data-hero-item="" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'clamp(18px,3vw,30px)' }}>
            <span style={{ width: 34, height: 3, background: RASTA_H }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.34em', textTransform: 'uppercase', color: 'var(--accent)' }}>Tabacaria · Recife · desde 2017</span>
            <span style={{ width: 34, height: 3, background: RASTA_H_REV }} />
          </div>

          <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>Roots Tabacaria — Recife</h1>

          <div data-hero-item="" style={{ width: '100%', maxWidth: 1100 }}>
            <svg viewBox="0 0 1200 280" role="img" aria-label="Roots" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
              <defs>
                <linearGradient id="rootsInk" x1="0%" y1="0%" x2="100%" y2="30%">
                  <stop offset="0%" stopColor="#f5b528" />
                  <stop offset="52%" stopColor="#ffe08a" />
                  <stop offset="100%" stopColor="#c8232c" />
                </linearGradient>
              </defs>
              <text data-sig-fill="" x="600" y="200" textAnchor="middle" fill="url(#rootsInk)" opacity="0"
                fontFamily="Bebas Neue, Impact, sans-serif" fontSize="240" letterSpacing="14">ROOTS</text>
              <text data-sig-text="" x="600" y="200" textAnchor="middle" fill="none" stroke="url(#rootsInk)" strokeWidth="2.4"
                strokeLinejoin="round" strokeLinecap="round" opacity="0"
                fontFamily="Bebas Neue, Impact, sans-serif" fontSize="240" letterSpacing="14">ROOTS</text>
            </svg>
          </div>

          <p data-hero-item="" className="display-tight" style={{ fontSize: 'clamp(22px,3.4vw,42px)', letterSpacing: '.05em', lineHeight: 1.05, marginTop: 'clamp(4px,1vw,10px)', color: 'var(--ink)' }}>
            One love, <span style={{ color: 'var(--accent)' }}>one heart,</span> one session.
          </p>

          <p data-hero-item="" style={{ maxWidth: 560, marginTop: 18, fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.6, color: 'rgba(246,241,228,.78)', textWrap: 'pretty' }}>
            Curadoria de tabaco, narguilé, sedas, bongs e acessórios. Pedido direto no WhatsApp, retirada no balcão da Boa Vista ou entrega em toda a Região Metropolitana do Recife.
          </p>

          <div data-hero-item="" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 'clamp(24px,3.5vw,38px)' }}>
            <a data-magnet="" className="hero-cta hero-cta-solid" href={WA_LINK} target="_blank" rel="noreferrer">
              Fazer pedido no Whats <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
            </a>
            <button data-magnet="" className="hero-cta hero-cta-outline" onClick={scrollToVitrine}>
              Ver a vitrine
            </button>
          </div>

          <div data-hero-item="" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'clamp(22px,3vw,34px)', fontFamily: MONO, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,241,228,.62)' }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: open ? 'var(--positive)' : 'var(--danger)',
              boxShadow: `0 0 0 4px ${open ? 'rgba(78,163,94,.18)' : 'rgba(200,35,44,.18)'}`,
            }} />
            <span>{statusText}</span>
          </div>
        </div>

      </section>

      {/* ───────────────────────── DIVISOR ───────────────────────── */}
      <div className="rasta-stripe" style={{ height: 6 }} aria-hidden="true" />

      {/* ───────────────────────── VITRINE ───────────────────────── */}
      <section id="vitrine" style={{ position: 'relative', scrollMarginTop: 72, padding: 'clamp(64px,9vw,120px) 0 clamp(56px,8vw,100px)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto clamp(30px,4vw,52px)', padding: '0 clamp(16px,5vw,64px)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div data-head="" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* marcador: três listras curtas nas cores do reggae */}
            <span aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
              {['var(--rasta-red)', 'var(--rasta-green)', 'var(--rasta-gold)'].map(c => (
                <span key={c} style={{ display: 'block', width: 28, height: 3, borderRadius: 2, background: c }} />
              ))}
            </span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3.2vw,42px)', lineHeight: 1.04, letterSpacing: '-.02em', margin: 0 }}>
              {['O', 'que', 'tá', 'saindo', 'da', 'prateleira.'].map((w, i) => (
                <Fragment key={i}>{i > 0 && ' '}<span data-word="" style={{ display: 'inline-block' }}>{w}</span></Fragment>
              ))}
            </h2>
          </div>
          <p style={{ maxWidth: 340, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-dim)', textWrap: 'pretty' }}>
            Estoque girando todo dia. Passa o olho, escolhe e manda o nome no Whats que a gente separa.
          </p>
        </div>

        {loading ? (
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px,5vw,64px)' }}>
            <SkeletonGrid count={4} columns={4} gap={18} />
          </div>
        ) : railItems.length > 0 ? (
          <div data-rail-mask="" style={{
            position: 'relative', width: '100%', overflow: 'hidden',
            WebkitMaskImage: 'linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%)',
            maskImage: 'linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%)',
          }}>
            <div data-rail="" style={{ display: 'flex', gap: 18, width: 'max-content', padding: '8px 18px 8px 0', willChange: 'transform' }}>
              {railItems.concat(railItems).map((p, i) => (
                <RailCard key={`${p.id}-${i}`} product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ maxWidth: 1440, margin: 'clamp(30px,4vw,46px) auto 0', padding: '0 clamp(16px,5vw,64px)' }}>
          <button data-magnet="" className="hero-cta hero-cta-line" onClick={() => go('catalog')}>
            Ver catálogo completo <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
          </button>
        </div>
      </section>

      {/* ───────────────────────── CATEGORIAS ───────────────────────── */}
      <section style={{ padding: '20px clamp(16px,5vw,64px) 20px', maxWidth: 1440, margin: '0 auto' }}>
        <FadeIn><SectionHeader title="Navegue por categoria" /></FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {CATEGORIES.slice(1).map((c, i) => (
            <FadeIn key={c.id} delay={i * 50}>
            <button onClick={() => go('catalog', { cat: c.id })} className="r-card r-card-lift" style={{
              padding: '22px 20px', width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', background: 'var(--bg-elev)', color: 'var(--ink)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: CAT_COLORS[c.id] + '33',
                  color: CAT_COLORS[c.id],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Bebas Neue', fontSize: 21,
                }}>{c.label.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, textAlign: 'left' }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1 }}>
                    {products.filter(p => p.cat === c.id).length} produtos
                  </div>
                </div>
              </div>
              <Icon.arrow size={16} style={{ color: 'var(--ink-mute)' }}/>
            </button>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ───────────────────────── NOVIDADES ───────────────────────── */}
      <section style={{ padding: '40px clamp(16px,5vw,64px) 80px', maxWidth: 1440, margin: '0 auto' }}>
        <FadeIn><SectionHeader title="Novidades" sub="Chegaram essa semana" /></FadeIn>
        {loading ? (
          <SkeletonGrid count={4} columns={4} gap={16} />
        ) : novidades.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr', gap: 16 }}>
            {novidades.slice(0, 4).map((p, i) => (
              <FadeIn key={p.id} delay={i * 60} style={{ height: '100%' }}>
                <ProductCard product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
              </FadeIn>
            ))}
          </div>
        ) : null}
      </section>
    </div>
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

function RailCard({ product, onTap, addToCart }) {
  const tag = railTag(product);
  const cat = CATEGORIES.find(c => c.id === product.cat)?.label || product.cat;
  return (
    <article className="rail-card" onClick={onTap}>
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
      <div style={{ padding: '16px 16px 18px', borderTop: '1px solid var(--line)' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 7 }}>{cat}</div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, minHeight: 36, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
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
