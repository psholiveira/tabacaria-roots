// mobile/Checkout.jsx

import { useState } from 'react';
import { formatBRL } from '../data.js';
import { WHATSAPP_COLOR } from '../config.js';
import { Icon } from '../components/Icons.jsx';
import { useCheckout, ModeCard } from '../hooks/useCheckout.jsx';
import { MobileHeader, Row, Label } from './Shell.jsx';

export function MobileCheckout({ cart, onBack }) {
  const [sent, setSent] = useState(false);
  const { name, setName, mode, setMode, address, setAddress, notes, setNotes, payment, setPayment, total, canSend, send } = useCheckout(cart);

  if (sent) {
    return (
      <div>
        <MobileHeader title="Pedido enviado" onBack={onBack} />
        <div style={{ padding: '40px 30px', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 99, margin: '0 auto 20px',
            background: WHATSAPP_COLOR, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.whatsapp size={36}/></div>
          <div className="display" style={{ fontSize: 22, letterSpacing: '0.02em' }}>IRIE!</div>
          <p style={{ fontSize: 13, color: 'var(--ink-dim)', marginTop: 8, lineHeight: 1.5 }}>
            Seu pedido foi aberto no WhatsApp. É só dar enviar pra confirmar com a gente.
          </p>
          <button className="btn-primary" style={{ marginTop: 22 }} onClick={() => { cart.clear(); onBack(); }}>
            Voltar pro catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <MobileHeader title="Finalizar" onBack={onBack} />
      <div style={{ padding: '0 18px' }}>
        <div style={{ marginBottom: 22 }}>
          <Label>Como você quer receber?</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <ModeCard label="Retirada" sub="Grátis" active={mode === 'retirada'} onClick={() => setMode('retirada')} />
            <ModeCard label="Entrega" sub="A combinar · Entregador Própio" active={mode === 'entrega'} onClick={() => setMode('entrega')} />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <Label>Seu nome</Label>
          <input className="r-input" placeholder="Como devo te chamar?" value={name} onChange={e => setName(e.target.value)} style={{ marginTop: 8 }}/>
        </div>

        {mode === 'entrega' && (
          <>
            <div style={{ marginBottom: 18 }}>
              <Label>Endereço de entrega</Label>
              <input className="r-input" placeholder="Rua, número, bairro" value={address} onChange={e => setAddress(e.target.value)} style={{ marginTop: 8 }}/>
            </div>
            <div style={{ marginBottom: 18 }}>
              <Label>Complemento / referência</Label>
              <input className="r-input" placeholder="Apto, ponto de referência..." value={notes} onChange={e => setNotes(e.target.value)} style={{ marginTop: 8 }}/>
            </div>
          </>
        )}

        <div style={{ marginBottom: 18 }}>
          <Label>Pagamento</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {['Pix', 'Cartão na entrega', 'Dinheiro'].map(p => (
              <button key={p} className={`chip ${payment === p ? 'active' : ''}`} onClick={() => setPayment(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div className="r-card" style={{ padding: 14, marginTop: 18 }}>
          <Label>Resumo</Label>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cart.items.map(i => (
              <div key={i.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: 'var(--ink-dim)' }}>{i.qty}× {i.product.name}</span>
                <span>{formatBRL(i.qty * i.product.price)}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--line)', margin: '6px 0' }}/>
            <Row k="Entrega" v={mode === 'entrega' ? 'a combinar' : 'Grátis'} muted />
            <Row k={<span style={{ fontWeight: 700 }}>Subtotal</span>}
                 v={<span className="display-tight" style={{ fontSize: 22, color: 'var(--accent)' }}>{formatBRL(total)}</span>}/>
          </div>
        </div>
      </div>

      <div style={{
        position: 'sticky', bottom: 0,
        padding: '14px 16px', background: 'var(--bg)', borderTop: '1px solid var(--line)', zIndex: 25, marginTop: 20,
      }}>
        <button className="btn-primary" disabled={!canSend} style={{
          width: '100%', padding: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: WHATSAPP_COLOR, color: '#fff',
          opacity: canSend ? 1 : 0.5,
        }} onClick={() => send(() => setSent(true))}>
          <Icon.whatsapp size={18}/> Enviar pedido pro WhatsApp
        </button>
        <div style={{ textAlign: 'center', fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 8 }}>
          Confirmação direto com a gente
        </div>
      </div>
    </div>
  );
}
