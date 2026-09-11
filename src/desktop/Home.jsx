// desktop/Home.jsx — hero + vitrine (componentes compartilhados) + categorias + novidades

import { CATEGORIES, CAT_COLORS } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { SkeletonGrid } from '../components/SkeletonCard.jsx';
import { useProductsLoading } from '../store/products.js';
import { SectionHeader } from './Chrome.jsx';
import { FadeIn } from '../components/FadeIn.jsx';
import { Hero } from '../components/Hero.jsx';
import { VitrineRail } from '../components/VitrineRail.jsx';

export function DesktopHome({ products, go, openProduct, addToCart }) {
  const loading   = useProductsLoading();
  const novidades = products.filter(p => (p.tags || []).includes('novo'));

  return (
    <div>
      <Hero />

      {/* ───────────────────────── DIVISOR ───────────────────────── */}
      <div className="rasta-stripe" style={{ height: 6 }} aria-hidden="true" />

      <VitrineRail products={products} loading={loading} go={go} openProduct={openProduct} addToCart={addToCart} />

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
