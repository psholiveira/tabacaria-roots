// desktop/CartDrawer.jsx — drawer lateral com carrinho + checkout

import { useState } from 'react';
import { formatBRL } from '../data.js';
import { WHATSAPP_COLOR } from '../config.js';
import { Icon } from '../components/Icons.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { useCheckout, ModeCard } from '../hooks/useCheckout.jsx';
import { Label, Row } from '../mobile/Shell.jsx';

export function DesktopCartDrawer({ cart, onClose }) {
  const [step, setStep] = useState('cart');
  const { name, setName, mode, setMode, address, setAddress, payment, setPayment, total, canSend, send } = useCheckout(cart);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 80,
      }}/>
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, maxWidth: '100vw',
        background: 'var(--bg)', borderLeft: '1px solid var(--line)',
        zIndex: 90, display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="display" style={{ fontSize: 17, letterSpacing: '0.06em' }}>
            {step === 'cart' ? `SACOLA · ${cart.count}` : step === 'checkout' ? 'FINALIZAR' : 'PEDIDO ENVIADO'}
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer' }}><Icon.close /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          {step === 'cart' && (
            cart.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-mute)' }}>
                <Icon.cart size={36} style={{ marginBottom: 12 }}/>
                <div>Sua sacola tá vazia</div>
              </div>
            ) : cart.items.map(item => (
              <div key={item.key} className="r-card" style={{ display: 'flex', gap: 12, padding: 10, marginBottom: 10 }}>
                <div style={{ width: 70, height: 70, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                  <ProductImage product={item.product} size="sm" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25 }}>{item.product.name}</div>
                  {item.variation && <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{item.variation}</div>}
                  <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid var(--line)', borderRadius: 99, padding: 2 }}>
                      <button onClick={() => cart.dec(item.key)} style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}><Icon.minus size={11}/></button>
                      <span style={{ minWidth: 16, textAlign: 'center', fontWeight: 700, fontSize: 12 }}>{item.qty}</span>
                      <button onClick={() => cart.inc(item.key)} style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}><Icon.plus size={11}/></button>
                    </div>
                    <div className="display" style={{ fontSize: 14 }}>{formatBRL(item.product.price * item.qty)}</div>
                  </div>
                </div>
                <button onClick={() => cart.remove(item.key)} style={{ background: 'transparent', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer', alignSelf: 'flex-start' }}><Icon.trash size={14}/></button>
              </div>
            ))
          )}

          {step === 'checkout' && (
            <>
              <div style={{ marginBottom: 18 }}>
                <Label>Como receber?</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  <ModeCard label="Retirada" sub="Grátis" active={mode === 'retirada'} onClick={() => setMode('retirada')} />
                  <ModeCard label="Entrega" sub="A combinar . Entregador Próprio" active={mode === 'entrega'} onClick={() => setMode('entrega')} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Label>Nome</Label>
                <input className="r-input" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} style={{ marginTop: 6 }}/>
              </div>
              {mode === 'entrega' && (
                <div style={{ marginBottom: 14 }}>
                  <Label>Endereço</Label>
                  <input className="r-input" placeholder="Rua, número, bairro" value={address} onChange={e => setAddress(e.target.value)} style={{ marginTop: 6 }}/>
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <Label>Pagamento</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {['Pix', 'Cartão', 'Dinheiro'].map(p => (
                    <button key={p} className={`chip ${payment === p ? 'active' : ''}`} onClick={() => setPayment(p)}>{p}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 70, height: 70, borderRadius: 99, margin: '0 auto 18px', background: WHATSAPP_COLOR, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.whatsapp size={32}/>
              </div>
              <div className="display" style={{ fontSize: 20 }}>IRIE!</div>
              <p style={{ fontSize: 13, color: 'var(--ink-dim)', marginTop: 8, lineHeight: 1.5 }}>
                Seu pedido foi aberto no WhatsApp.<br/>É só confirmar com a gente.
              </p>
            </div>
          )}
        </div>

        {cart.items.length > 0 && step !== 'done' && (
          <div style={{ padding: 22, borderTop: '1px solid var(--line)' }}>
            {step === 'checkout' && <Row k="Entrega" v={mode === 'entrega' ? 'a combinar' : 'Grátis'} muted />}
            <div style={{ height: 1, background: 'var(--line)', margin: '8px 0' }}/>
            <Row k={<span className="display" style={{ fontSize: 13, letterSpacing: '0.04em' }}>SUBTOTAL</span>}
                 v={<span className="display-tight" style={{ fontSize: 22, color: 'var(--accent)' }}>{formatBRL(total)}</span>}/>
            {step === 'cart' && (
              <button className="btn-primary" style={{ width: '100%', marginTop: 12, padding: 14, background: WHATSAPP_COLOR, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={() => setStep('checkout')}>
                <Icon.whatsapp size={16}/> Continuar
              </button>
            )}
            {step === 'checkout' && (
              <button className="btn-primary" disabled={!canSend} style={{
                width: '100%', marginTop: 12, padding: 14, background: WHATSAPP_COLOR, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: canSend ? 1 : 0.5,
              }} onClick={() => send(() => setStep('done'))}>
                <Icon.whatsapp size={16}/> Enviar pelo WhatsApp
              </button>
            )}
          </div>
        )}
        {step === 'done' && (
          <div style={{ padding: 22, borderTop: '1px solid var(--line)' }}>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => { cart.clear(); setStep('cart'); onClose(); }}>
              Voltar pra navegar
            </button>
          </div>
        )}
      </div>
    </>
  );
}
