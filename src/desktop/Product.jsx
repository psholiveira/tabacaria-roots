// desktop/Product.jsx

import { useState } from 'react';
import { CATEGORIES, formatBRL } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { Label } from '../mobile/Shell.jsx';
import { SectionHeader } from './Chrome.jsx';

export function DesktopProduct({ products, product, go, openProduct, addToCart }) {
  const [variation, setVariation] = useState(product.variations?.[0] || '');
  const [qty, setQty] = useState(1);
  const related = products.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4);

  return (
    <div style={{ padding: '30px 36px 80px', maxWidth: 1440, margin: '0 auto' }}>
      <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginBottom: 24 }}>
        <button onClick={() => go('home')} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Início</button>
        <span style={{ margin: '0 8px' }}>/</span>
        <button onClick={() => go('catalog', { cat: product.cat })} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>{CATEGORIES.find(c => c.id === product.cat)?.label}</button>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--ink-dim)' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 50 }}>
        <div style={{ borderRadius: 18, overflow: 'hidden' }}>
          <ProductImage product={product} size="lg" />
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{product.brand}</div>
          <h1 className="display" style={{ fontSize: 36, margin: '8px 0 14px', lineHeight: 1.1 }}>{product.name}</h1>

          {product.rating != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {[1,2,3,4,5].map(i => (
                  <Icon.star key={i} size={15} style={{ color: i <= Math.round(product.rating) ? 'var(--rasta-gold)' : 'var(--line-strong)' }}/>
                ))}
              </div>
              <span style={{ fontSize: 13, color: 'var(--ink-dim)' }}>{product.rating.toFixed(1)} · {product.ratings} avaliações</span>
            </div>
          )}

          <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="display-tight" style={{ fontSize: 54, lineHeight: 1, color: 'var(--accent)' }}>{formatBRL(product.price)}</span>
            {product.oldPrice ? (
              <span style={{ fontSize: 16, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>{formatBRL(product.oldPrice)}</span>
            ) : null}
          </div>

          {product.desc && <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)', marginTop: 26 }}>{product.desc}</p>}

          {product.variations && product.variations.length > 1 && (
            <div style={{ marginTop: 22 }}>
              <Label>Variação</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {product.variations.map(v => (
                  <button key={v} className={`chip ${variation === v ? 'active' : ''}`} onClick={() => setVariation(v)}>{v}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1.5px solid var(--line)', borderRadius: 999, padding: 5 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 32, height: 32, borderRadius: 999, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}><Icon.minus /></button>
              <span style={{ width: 28, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 32, height: 32, borderRadius: 999, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}><Icon.plus /></button>
            </div>
            <button className="btn-primary" style={{ flex: 1, padding: '16px' }} onClick={() => { for (let i = 0; i < qty; i++) addToCart(product, variation); }}>
              Adicionar à sacola — {formatBRL(product.price * qty)}
            </button>
          </div>

          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Perk icon={<Icon.whatsapp size={16}/>} title="Pedido pelo WhatsApp." sub="Atendimento direto."/>
            <Perk icon={<Icon.pin size={16}/>} title="Entrega em toda grande Recife!" sub="Ou retirada na loja."/>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 70 }}>
          <SectionHeader title="Você também vai gostar" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} onTap={() => openProduct(p)} addToCart={addToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Perk({ icon, title, sub }) {
  return (
    <div className="r-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-elev-2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}
