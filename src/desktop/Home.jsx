// desktop/Home.jsx

import { CATEGORIES, CAT_COLORS, STORE_INFO } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { SkeletonGrid } from '../components/SkeletonCard.jsx';
import { useProductsLoading } from '../store/products.js';
import { SectionHeader } from './Chrome.jsx';
import { FadeIn } from '../components/FadeIn.jsx';

export function DesktopHome({ products, go, openProduct, addToCart }) {
  const loading   = useProductsLoading();
  const tops      = products.filter(p => p.bestseller).slice(0, 4);
  const novidades = products.filter(p => (p.tags || []).includes('novo'));

  return (
    <div>
      <section style={{
        background: '#0d3d1d', position: 'relative', overflow: 'hidden',
        padding: '64px 36px 80px',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -100, right: -100, width: 500, height: 500,
            borderRadius: '50%', background: 'radial-gradient(circle, #f5b528 0%, transparent 65%)', opacity: 0.25,
          }}/>
          <img src="/assets/logo-roots.png" alt="" style={{
            position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
            width: 380, height: 380,
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
          }} />
          <div style={{ position: 'relative', maxWidth: 600 }}>
            <FadeIn y={24}>
            <div style={{ fontSize: 11, color: '#f5b528', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
              Tabacaria · Recife · 2017
            </div>
            <h1 className="display-tight" style={{
              fontSize: 88, lineHeight: 0.9, color: '#fff', margin: 0,
              letterSpacing: '0.005em',
            }}>
              ONE LOVE,<br/>
              <span style={{ color: '#f5b528' }}>ONE HEART,</span><br/>
              ONE SESSION.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 22, maxWidth: 460, lineHeight: 1.5 }}>
              Curadoria de tabaco, narguilé, sedas, bongs e acessórios premium.
              Pedido direto no WhatsApp, retirada na loja ou entrega em toda grande Recife e região metropolitana.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
              <button className="btn-primary" onClick={() => go('catalog')} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                Ver catálogo <Icon.arrow size={16}/>
              </button>
              <a href={`https://wa.me/${STORE_INFO.whatsapp}`} target="_blank" rel="noreferrer" style={{
                padding: '16px 24px', borderRadius: 999, border: '2px solid rgba(255,255,255,0.3)',
                background: 'transparent', color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700,
                fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Icon.whatsapp size={14}/> Falar no Whats
              </a>
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 36px 20px', maxWidth: 1440, margin: '0 auto' }}>
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

      <section style={{ padding: '40px 36px 20px', maxWidth: 1440, margin: '0 auto' }}>
        <FadeIn><SectionHeader title="Mais vendidos" sub="O que tá saindo da prateleira" /></FadeIn>
        {loading ? (
          <SkeletonGrid count={4} columns={4} gap={16} />
        ) : tops.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {tops.map((p, i) => (
              <FadeIn key={p.id} delay={i * 60} style={{ height: '100%' }}>
                <ProductCard product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
              </FadeIn>
            ))}
          </div>
        ) : null}
      </section>

      <section style={{ padding: '40px 36px 80px', maxWidth: 1440, margin: '0 auto' }}>
        <FadeIn><SectionHeader title="Novidades" sub="Chegaram essa semana" /></FadeIn>
        {loading ? (
          <SkeletonGrid count={4} columns={4} gap={16} />
        ) : novidades.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
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
