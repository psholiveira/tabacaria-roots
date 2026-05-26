// components/ProductCard.jsx — card de produto (compact)

import { memo, useState } from 'react';
import { Icon } from './Icons.jsx';
import { ProductImage } from './ProductImage.jsx';
import { formatBRL } from '../data.js';

export const ProductCard = memo(function ProductCard({ product, onTap, addToCart }) {
  const variations = product.variations || [];
  const [selectedVar, setSelectedVar] = useState(variations[0] ?? null);

  const promoTag = product.tags?.includes('top') ? { cls: 'tag-top', t: 'TOP' }
    : product.tags?.includes('novo') ? { cls: 'tag-novo', t: 'NOVO' }
    : product.tags?.includes('import') ? { cls: 'tag-import', t: 'IMPORT' }
    : product.oldPrice ? { cls: 'tag-promo', t: 'PROMO' } : null;

  return (
    <div className="r-card" onClick={onTap} style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', overflow: 'hidden' }}>
        <ProductImage product={product} size="sm" />
        {promoTag && (
          <span className={`tag ${promoTag.cls}`} style={{ position: 'absolute', top: 8, right: 8 }}>{promoTag.t}</span>
        )}
      </div>
      <div style={{ padding: '10px 11px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontSize: 9.5, color: 'var(--ink-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {product.brand}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25, color: 'var(--ink)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32 }}>
          {product.name}
        </div>
        {product.rating != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Icon.star size={11} style={{ color: 'var(--rasta-gold)' }}/>
            <span style={{ fontSize: 11, color: 'var(--ink-dim)' }}>{product.rating.toFixed(1)}</span>
            {product.ratings ? <span style={{ fontSize: 10, color: 'var(--ink-mute)' }}>({product.ratings})</span> : null}
          </div>
        )}
        {product.desc && (
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.desc}
          </div>
        )}
        {variations.length > 0 && (
          <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
            {variations.map((v) => (
              <button
                key={v}
                onClick={(e) => { e.stopPropagation(); setSelectedVar(v); }}
                style={{
                  padding: '2px 7px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                  border: `1.5px solid ${selectedVar === v ? 'var(--accent)' : 'var(--border)'}`,
                  background: selectedVar === v ? 'var(--accent)' : 'transparent',
                  color: selectedVar === v ? 'var(--accent-ink)' : 'var(--ink-dim)',
                  cursor: 'pointer', lineHeight: 1.6, flexShrink: 0,
                }}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 }}>
          <div>
            {product.oldPrice ? (
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                {formatBRL(product.oldPrice)}
              </div>
            ) : null}
            <div className="display" style={{ fontSize: 16, lineHeight: 1 }}>{formatBRL(product.price || 0)}</div>
          </div>
          {addToCart && (
            <button onClick={(e) => { e.stopPropagation(); addToCart({ ...product, selectedVariation: selectedVar }); }} style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: 'var(--accent)', color: 'var(--accent-ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <Icon.plus />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
