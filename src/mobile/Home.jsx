// mobile/Home.jsx — tela inicial mobile

import { CATEGORIES, CAT_COLORS, STORE_INFO, formatBRL } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { SkeletonGrid } from '../components/SkeletonCard.jsx';
import { useProductsLoading } from '../store/products.js';
import { Section } from './Shell.jsx';

export function MobileHome({ products, go, addToCart, openProduct }) {
  const loading = useProductsLoading();

  const bestSellers = products.filter(p => p.bestseller).slice(0, 4);
  const novidades   = products.filter(p => (p.tags || []).includes('novo')).slice(0, 4);
  const promos      = products.filter(p => p.oldPrice);

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 40, height: 40 }} />
            <div>
              <div className="display" style={{ fontSize: 14, lineHeight: 1, letterSpacing: '0.04em' }}>ROOTS</div>
              <div style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>Recife</div>
            </div>
          </div>
          <button onClick={() => go('cart')} style={{
            width: 40, height: 40, borderRadius: 999,
            border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Icon.cart size={18}/>
          </button>
        </div>

        <div style={{
          background: '#0d3d1d',
          borderRadius: 16, padding: '22px 20px 24px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -30, width: 140, height: 140,
            borderRadius: '50%', background: 'radial-gradient(circle, #f5b528 0%, transparent 70%)', opacity: 0.4,
          }}/>
          <div className="display-tight" style={{
            fontSize: 44, color: '#fff', lineHeight: 0.95, letterSpacing: '0.01em',
          }}>
            ONE LOVE,<br/>
            <span style={{ color: '#f5b528' }}>ONE HEART,</span><br/>
            ONE SESSION.
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12.5, marginTop: 14, marginBottom: 18, maxWidth: 240, lineHeight: 1.45 }}>
            Curadoria de tabaco, narguilé e acessórios. Direto no seu Whats, em até 40 min.
          </p>
          <button className="btn-primary" onClick={() => go('catalog')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 18px',
          }}>
            Ver tudo <Icon.arrow size={16}/>
          </button>
          <div style={{ position: 'absolute', right: 14, bottom: 14, top: 14, width: 3,
            background: 'linear-gradient(180deg, var(--rasta-green) 0 33.33%, var(--rasta-gold) 33.33% 66.66%, var(--rasta-red) 66.66% 100%)',
            opacity: 0.5,
          }}/>
        </div>
      </div>

      <div style={{ padding: '8px 0 4px' }}>
        <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 className="display" style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-dim)', margin: 0 }}>Categorias</h3>
          <button onClick={() => go('catalog')} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Ver todas →</button>
        </div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px' }}>
          {CATEGORIES.slice(1).map(c => (
            <button key={c.id} onClick={() => go('catalog', { cat: c.id })} style={{
              flexShrink: 0,
              minWidth: 84, height: 90,
              background: 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              color: 'var(--ink)', cursor: 'pointer',
              padding: 8,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: CAT_COLORS[c.id] + '33',
                color: CAT_COLORS[c.id],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bebas Neue', fontSize: 15, fontWeight: 700,
              }}>{c.label.charAt(0)}</div>
              <span style={{ fontSize: 10.5, fontWeight: 500, textAlign: 'center', lineHeight: 1.1 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Section title="Mais vendidos" subtitle="Top da casa">
        <div style={{ padding: '0 16px' }}>
          {loading ? (
            <SkeletonGrid count={4} columns={2} gap={12} />
          ) : bestSellers.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {bestSellers.map(p => (
                <ProductCard key={p.id} product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
              ))}
            </div>
          ) : null}
        </div>
      </Section>

      {!loading && promos[0] && (
        <div style={{ padding: '20px 16px 4px' }}>
          <div onClick={() => openProduct(promos[0])} style={{
            background: '#161613',
            border: '2px solid var(--ink)',
            borderRadius: 6,
            padding: 18,
            display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(135deg, transparent 0 18px, rgba(245,181,40,0.04) 18px 19px)',
            }}/>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ fontSize: 9.5, color: 'var(--rasta-red)', fontWeight: 700, letterSpacing: '0.2em', marginBottom: 4 }}>EM OFERTA</div>
              <div className="display" style={{ fontSize: 16, color: '#fff', lineHeight: 1.15, marginBottom: 8 }}>{promos[0].name}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span className="display-tight" style={{ fontSize: 24, color: 'var(--rasta-gold)' }}>{formatBRL(promos[0].price)}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>{formatBRL(promos[0].oldPrice)}</span>
              </div>
            </div>
            <Icon.arrow style={{ color: 'var(--rasta-gold)' }}/>
          </div>
        </div>
      )}

      <Section title="Novidades" subtitle="Acabaram de chegar">
        <div style={{ padding: '0 16px' }}>
          {loading ? (
            <SkeletonGrid count={2} columns={2} gap={12} />
          ) : novidades.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {novidades.slice(0, 2).map(p => (
                <ProductCard key={p.id} product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
              ))}
            </div>
          ) : null}
        </div>
      </Section>

      <div style={{ padding: '24px 16px 16px' }}>
        <div className="r-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
            <div>
              <div className="display" style={{ fontSize: 14, letterSpacing: '0.06em' }}>VISITE A LOJA</div>
              <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 6, lineHeight: 1.5 }}>
                {STORE_INFO.address.split(' — ')[0]}<br/>{STORE_INFO.address.split(' — ')[1]}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11.5, color: 'var(--positive)', fontWeight: 600 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--positive)' }}/>
                Aberto agora · até 22:00
              </div>
            </div>
            <button onClick={() => go('store')} style={{
              background: 'transparent', border: '1.5px solid var(--ink)', color: 'var(--ink)',
              padding: '8px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0,
            }}>Como chegar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
