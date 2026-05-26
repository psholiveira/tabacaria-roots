// mobile/Cart.jsx — Sacola

import { formatBRL } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { MobileHeader, Row } from './Shell.jsx';

export function MobileCart({ cart, onBack, go }) {
  if (cart.items.length === 0) {
    return (
      <div style={{ padding: 0 }}>
        <MobileHeader title="Sacola" onBack={onBack} />
        <div style={{ padding: '60px 30px', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 99, margin: '0 auto 20px',
            background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink-mute)',
          }}><Icon.cart size={32}/></div>
          <div className="display" style={{ fontSize: 18, letterSpacing: '0.04em' }}>SUA SACOLA TÁ VAZIA</div>
          <p style={{ fontSize: 13, color: 'var(--ink-dim)', marginTop: 8, lineHeight: 1.5 }}>
            Bora dar uma olhada no catálogo?<br/>
            Tem coisa boa esperando.
          </p>
          <button className="btn-primary" style={{ marginTop: 22 }} onClick={() => go('catalog')}>
            Ver catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <MobileHeader title="Sacola" onBack={onBack} />
      <div style={{ padding: '0 16px' }}>
        {cart.items.map(item => (
          <div key={item.key} className="r-card" style={{ display: 'flex', gap: 12, padding: 10, marginBottom: 10 }}>
            <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
              <ProductImage product={item.product} size="sm" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 9.5, color: 'var(--ink-mute)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.product.brand}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.25, marginTop: 2 }}>{item.product.name}</div>
              {item.variation && <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 3 }}>{item.variation}</div>}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid var(--line)', borderRadius: 99, padding: 2 }}>
                  <button onClick={() => cart.dec(item.key)} style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}><Icon.minus size={11}/></button>
                  <span style={{ minWidth: 16, textAlign: 'center', fontWeight: 700, fontSize: 12 }}>{item.qty}</span>
                  <button onClick={() => cart.inc(item.key)} style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}><Icon.plus size={11}/></button>
                </div>
                <div className="display" style={{ fontSize: 14 }}>{formatBRL(item.product.price * item.qty)}</div>
              </div>
            </div>
            <button onClick={() => cart.remove(item.key)} style={{ background: 'transparent', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer', alignSelf: 'flex-start', padding: 4 }}>
              <Icon.trash size={15}/>
            </button>
          </div>
        ))}

        <div style={{ padding: '18px 4px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row k="Subtotal" v={formatBRL(cart.total)} />
          <Row k="Entrega" v="A combinar" muted />
          <div style={{ height: 1, background: 'var(--line)', margin: '6px 0' }}/>
          <Row k={<span className="display" style={{ fontSize: 14, letterSpacing: '0.04em' }}>TOTAL</span>}
               v={<span className="display-tight" style={{ fontSize: 24, color: 'var(--accent)' }}>{formatBRL(cart.total)}</span>}/>
        </div>
      </div>

      <div style={{
        position: 'sticky', bottom: 0,
        padding: '14px 16px',
        background: 'var(--bg)', borderTop: '1px solid var(--line)',
        zIndex: 25, marginTop: 20,
      }}>
        <button className="btn-primary" style={{
          width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: '#25D366', color: '#fff',
        }} onClick={() => go('checkout')}>
          <Icon.whatsapp size={18}/> Finalizar pedido no Whats
        </button>
      </div>
    </div>
  );
}
