// hooks/useCheckout.jsx — estado e lógica de checkout compartilhados

import { useState } from 'react';
import { buildWhatsAppLink } from './useCart.js';

export function useCheckout(cart) {
  const [name, setName]       = useState('');
  const [mode, setMode]       = useState('retirada');
  const [address, setAddress] = useState('');
  const [notes, setNotes]     = useState('');
  const [payment, setPayment] = useState('Pix');

  const total   = cart.total;
  const canSend = !!name && (mode !== 'entrega' || !!address);

  const send = (onDone) => {
    const url = buildWhatsAppLink({
      items: cart.items,
      total,
      customer: { name },
      delivery: { mode, address, notes, payment },
    });
    window.open(url, '_blank');
    onDone?.();
  };

  return { name, setName, mode, setMode, address, setAddress, notes, setNotes, payment, setPayment, total, canSend, send };
}

// Componente compartilhado — usado em mobile e desktop
export function ModeCard({ label, sub, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '14px',
      background: active ? 'var(--ink)' : 'var(--bg-elev)',
      color: active ? 'var(--bg)' : 'var(--ink)',
      border: '1.5px solid ' + (active ? 'var(--ink)' : 'var(--line)'),
      borderRadius: 12, cursor: 'pointer', textAlign: 'left',
      transition: 'all .12s',
    }}>
      <div style={{ fontFamily: 'Bebas Neue', fontSize: 17, letterSpacing: '0.06em' }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 10.5, marginTop: 2, opacity: 0.7 }}>{sub}</div>
    </button>
  );
}
