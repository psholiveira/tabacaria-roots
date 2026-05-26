// desktop/Catalog.jsx

import { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, FILTERS, filterProducts } from '../data.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { SkeletonGrid } from '../components/SkeletonCard.jsx';
import { useProductsLoading } from '../store/products.js';
import { Label } from '../mobile/Shell.jsx';

export function DesktopCatalog({ products, initialCat, openProduct, addToCart }) {
  const loading = useProductsLoading();
  const [cat, setCat] = useState(initialCat || 'all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('relevance');
  const [priceId, setPriceId] = useState('p-all');

  useEffect(() => { setCat(initialCat || 'all'); }, [initialCat]);

  const items = useMemo(() => {
    const priceRange = FILTERS.preco.find(p => p.id === priceId);
    return filterProducts(products, { cat, q, priceRange, sort: sort === 'relevance' ? null : sort });
  }, [products, cat, q, priceId, sort]);

  return (
    <div style={{ padding: '40px 36px 80px', display: 'grid', gridTemplateColumns: '230px 1fr', gap: 36, maxWidth: 1440, margin: '0 auto' }}>
      <aside>
        <div style={{ position: 'sticky', top: 80 }}>
          <Label>Categorias</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 12 }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                background: cat === c.id ? 'var(--bg-elev)' : 'transparent',
                border: 'none', color: cat === c.id ? 'var(--ink)' : 'var(--ink-dim)',
                padding: '9px 12px', borderRadius: 7, cursor: 'pointer',
                fontSize: 13, fontWeight: cat === c.id ? 600 : 500,
                textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderLeft: cat === c.id ? '3px solid var(--accent)' : '3px solid transparent',
              }}>
                <span>{c.label}</span>
                <span style={{ fontSize: 10, color: 'var(--ink-mute)' }}>
                  {c.id === 'all' ? products.length : products.filter(p => p.cat === c.id).length}
                </span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 28 }}>
            <Label>Faixa de preço</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
              {FILTERS.preco.map(o => (
                <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12.5, color: priceId === o.id ? 'var(--ink)' : 'var(--ink-dim)', padding: '4px 0' }}>
                  <input type="radio" checked={priceId === o.id} onChange={() => setPriceId(o.id)} style={{ accentColor: 'var(--accent)' }}/>
                  {o.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 20, flexWrap: 'wrap' }}>
          <div>
            <h1 className="display" style={{ fontSize: 32, margin: 0, letterSpacing: '0.01em' }}>
              {cat === 'all' ? 'Tudo no catálogo' : CATEGORIES.find(c => c.id === cat)?.label}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--ink-mute)', marginTop: 6 }}>{items.length} produtos</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input className="r-input" placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} style={{ width: 220, fontSize: 13 }}/>
            <select value={sort} onChange={e => setSort(e.target.value)} className="r-input" style={{ width: 'auto', fontSize: 13, cursor: 'pointer' }}>
              {FILTERS.ordenar.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <SkeletonGrid count={6} columns={3} gap={16} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
            {items.map(p => (
              <ProductCard key={p.id} product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
            ))}
          </div>
        )}
        {!loading && items.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-mute)' }}>
            Nenhum produto encontrado. Tente outros filtros.
          </div>
        )}
      </div>
    </div>
  );
}
