// mobile/Catalog.jsx — Catálogo + filtros

import { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, FILTERS, filterProducts } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { SkeletonGrid } from '../components/SkeletonCard.jsx';
import { useProductsLoading } from '../store/products.js';
import { MobileHeader } from './Shell.jsx';

export function MobileCatalog({ products, initialCat, addToCart, openProduct, onBack }) {
  const loading = useProductsLoading();
  const [cat, setCat] = useState(initialCat || 'all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('relevance');

  useEffect(() => { setCat(initialCat || 'all'); }, [initialCat]);
  const [priceId, setPriceId] = useState('p-all');
  const [showFilters, setShowFilters] = useState(false);

  const items = useMemo(() => {
    const priceRange = FILTERS.preco.find(p => p.id === priceId);
    return filterProducts(products, { cat, q, priceRange, sort: sort === 'relevance' ? null : sort });
  }, [products, cat, q, priceId, sort]);
  const sortLabel = FILTERS.ordenar.find(o => o.id === sort)?.label || 'Relevância';

  return (
    <div style={{ paddingBottom: 24 }}>
      <MobileHeader title="Catálogo" onBack={onBack} />

      <div style={{ padding: '0 16px 12px', position: 'relative' }}>
        <Icon.search size={16} style={{ position: 'absolute', left: 30, top: 14, color: 'var(--ink-mute)' }} />
        <input
          className="r-input"
          placeholder="Buscar produtos, marcas..."
          style={{ paddingLeft: 40 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 14px' }}>
        {CATEGORIES.map(c => (
          <button key={c.id} className={`chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>
          <span style={{ color: 'var(--ink-dim)', fontWeight: 600 }}>{items.length}</span> produtos
        </div>
        <button onClick={() => setShowFilters(true)} style={{
          background: 'var(--bg-elev)', border: '1px solid var(--line)',
          color: 'var(--ink)', padding: '6px 12px', borderRadius: 999,
          fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon.filter size={13}/> {sortLabel}
        </button>
      </div>

      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <SkeletonGrid count={6} columns={2} gap={12} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {items.map(p => (
              <ProductCard key={p.id} product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-mute)', fontSize: 13 }}>
          Nenhum produto encontrado<br/>
          <button onClick={() => { setQ(''); setCat('all'); setPriceId('p-all'); }} style={{
            marginTop: 12, background: 'transparent', color: 'var(--accent)', border: 'none', cursor: 'pointer',
          }}>Limpar filtros</button>
        </div>
      )}

      {showFilters && (
        <FiltersSheet
          sort={sort} setSort={setSort}
          priceId={priceId} setPriceId={setPriceId}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}

function FiltersSheet({ sort, setSort, priceId, setPriceId, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 60,
      }}/>
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg)',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '14px 18px 28px',
        zIndex: 70, maxHeight: '80%', overflowY: 'auto',
        maxWidth: 480, margin: '0 auto',
      }}>
        <div style={{ width: 40, height: 4, background: 'var(--line-strong)', borderRadius: 99, margin: '0 auto 18px' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 className="display" style={{ fontSize: 16, letterSpacing: '0.06em', margin: 0 }}>FILTROS</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer' }}><Icon.close /></button>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>Ordenar por</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {FILTERS.ordenar.map(o => (
              <button key={o.id} className={`chip ${sort === o.id ? 'active' : ''}`} onClick={() => setSort(o.id)}>{o.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>Faixa de preço</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {FILTERS.preco.map(o => (
              <button key={o.id} className={`chip ${priceId === o.id ? 'active' : ''}`} onClick={() => setPriceId(o.id)}>{o.label}</button>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>Aplicar filtros</button>
      </div>
    </>
  );
}
