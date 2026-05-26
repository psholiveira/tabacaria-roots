// hooks/useCart.js — Carrinho + helpers de checkout WhatsApp

import { useState, useEffect } from 'react';
import { STORE_INFO, formatBRL } from '../data.js';

const CART_KEY = 'roots_cart';

export function useCart() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, variation) => {
    setItems(prev => {
      const key = product.id + '|' + (variation || '');
      const found = prev.find(i => i.key === key);
      if (found) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { key, product, qty: 1, variation: variation || product.variations?.[0] || '' }];
    });
  };
  const remove = (key) => setItems(prev => prev.filter(i => i.key !== key));
  const inc = (key) => setItems(prev => prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i));
  const dec = (key) => setItems(prev => prev.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);

  return { items, add, remove, inc, dec, clear, count, total };
}

export function buildWhatsAppLink({ items, total, customer, delivery }) {
  const lines = [];
  lines.push('*PEDIDO ROOTS TABACARIA*');
  lines.push('');
  lines.push(`👤 ${customer.name || '—'}`);
  lines.push('');
  lines.push('*Itens:*');
  items.forEach(i => {
    const v = i.variation ? ` (${i.variation})` : '';
    lines.push(`• ${i.qty}x ${i.product.name}${v} — ${formatBRL(i.qty * i.product.price)}`);
  });
  lines.push('');
  lines.push(`*Total:* ${formatBRL(total)}`);
  lines.push('');
  if (delivery.mode === 'retirada') {
    lines.push(`📦 *Retirada na loja* — Av. Conde da Boa Vista, 247`);
  } else {
    lines.push(`🛵 *Entrega via motoboy:* ${delivery.address || '—'}`);
    if (delivery.notes) lines.push(`Obs: ${delivery.notes}`);
    lines.push(`Taxa de entrega: a combinar`);
  }
  lines.push('');
  lines.push(`Pagamento: ${delivery.payment || 'a combinar'}`);
  const msg = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${STORE_INFO.whatsapp}?text=${msg}`;
}
