// mobile/Product.jsx — página do produto

import { useState } from 'react';
import { CATEGORIES, formatBRL } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { MobileHeader } from './Shell.jsx';

export function MobileProduct({ products, product, addToCart, onBack, openProduct }) {
  const [variation, setVariation] = useState(product.variations?.[0] || '');
  const [qty, setQty] = useState(1);
  const related = products.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 3);

  return (
    <div style={{ paddingBottom: 110 }}>
      <MobileHeader title="" onBack={onBack} />

      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ borderRadius: 16, overflow: 'hidden' }}>
          <ProductImage product={product} size="lg" />
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        <div style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
          {product.brand} · {CATEGORIES.find(c => c.id === product.cat)?.label}
        </div>
        <h1 className="display" style={{ fontSize: 24, margin: 0, lineHeight: 1.15, letterSpacing: '0.005em' }}>
          {product.name}
        </h1>
        {product.rating != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {[1,2,3,4,5].map(i => (
                <Icon.star key={i} size={13} style={{ color: i <= Math.round(product.rating) ? 'var(--rasta-gold)' : 'var(--line-strong)' }}/>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--ink-dim)' }}>{product.rating.toFixed(1)} · {product.ratings} avaliações</span>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span className="display-tight" style={{ fontSize: 38, lineHeight: 1, color: 'var(--accent)' }}>{formatBRL(product.price)}</span>
          {product.oldPrice ? (
            <span style={{ fontSize: 13, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>{formatBRL(product.oldPrice)}</span>
          ) : null}
        </div>

        {product.variations && product.variations.length > 1 && (
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>Variação</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {product.variations.map(v => (
                <button key={v} className={`chip ${variation === v ? 'active' : ''}`} onClick={() => setVariation(v)}>{v}</button>
              ))}
            </div>
          </div>
        )}

        {product.desc && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Sobre o produto</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-dim)', margin: 0 }}>{product.desc}</p>
          </div>
        )}

        {related.length > 0 && (
          <div style={{ marginTop: 30, marginBottom: 30 }}>
            <div className="display" style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Você também vai gostar</div>
            <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -18px', padding: '0 18px' }}>
              {related.map(p => (
                <div key={p.id} style={{ width: 140, flexShrink: 0 }}>
                  <ProductCard product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{
        position: 'sticky', bottom: 0,
        padding: '14px 16px 14px',
        background: 'var(--bg)',
        borderTop: '1px solid var(--line)',
        display: 'flex', gap: 10, alignItems: 'center', zIndex: 25,
        marginTop: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1.5px solid var(--line)', borderRadius: 999, padding: '4px' }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 30, height: 30, borderRadius: 999, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}><Icon.minus /></button>
          <span style={{ width: 22, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)} style={{ width: 30, height: 30, borderRadius: 999, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}><Icon.plus /></button>
        </div>
        <button className="btn-primary" style={{ flex: 1, padding: '14px' }} onClick={() => {
          for (let i = 0; i < qty; i++) addToCart(product, variation);
        }}>
          Adicionar — {formatBRL(product.price * qty)}
        </button>
      </div>
    </div>
  );
}
