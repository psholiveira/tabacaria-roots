// store/products.js — Supabase backend + pub/sub + React hook

import { useSyncExternalStore } from 'react';
import { supabase } from '../lib/supabase.js';

// ─── Estado local (espelho síncrono do Supabase) ───────────────────────────
let _products = [];
let _loading  = true;
let _error    = null;
const _listeners = new Set();

function notify() { _listeners.forEach(cb => cb()); }

// ─── Pub/sub ──────────────────────────────────────────────────────────────
export function subscribeProducts(cb) {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

export function getProducts() { return _products; }
export function getLoading()  { return _loading; }

// ─── Mappers DB ↔ JS ──────────────────────────────────────────────────────
function fromDb(row) {
  return {
    id:         row.id,
    name:       row.name,
    cat:        row.cat,
    brand:      row.brand      ?? '',
    price:      Number(row.price),
    oldPrice:   row.old_price  ? Number(row.old_price) : null,
    desc:       row.description ?? '',
    variations: row.variations ?? [],
    tags:       row.tags       ?? [],
    photo:      row.photo      ?? null,
    rating:     Number(row.rating)  || 5.0,
    ratings:    Number(row.ratings) || 0,
    bestseller: Boolean(row.bestseller),
  };
}

function toDb(p) {
  return {
    id:         p.id,
    name:       p.name,
    cat:        p.cat,
    brand:      p.brand      || '',
    price:      Number(p.price),
    old_price:  p.oldPrice   ? Number(p.oldPrice) : null,
    description: p.desc      || '',
    variations: p.variations || [],
    tags:       p.tags       || [],
    photo:      p.photo      || null,
    rating:     p.rating     || 5.0,
    ratings:    p.ratings    || 0,
    bestseller: Boolean(p.bestseller),
  };
}

// ─── Init ─────────────────────────────────────────────────────────────────
export async function initProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    _products = data.map(fromDb);
    _loading = false;
    _error   = null;
  } catch (err) {
    console.error('[products] Falha ao carregar do Supabase:', err.message);
    _products = [];
    _loading = false;
    _error   = err.message;
  }

  notify();
}

// ─── CRUD (todos assíncronos — lançam erro se falharem) ───────────────────
export async function upsertProduct(p) {
  const { data, error } = await supabase
    .from('products')
    .upsert(toDb(p))
    .select()
    .single();
  if (error) throw error;

  const updated = fromDb(data);
  const idx = _products.findIndex(x => x.id === updated.id);
  _products = idx >= 0
    ? _products.map((x, i) => (i === idx ? updated : x))
    : [..._products, updated];
  notify();
  return updated;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  _products = _products.filter(x => x.id !== id);
  notify();
}


export function newProductId() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

// ─── React hooks ──────────────────────────────────────────────────────────
export function useProducts() {
  return useSyncExternalStore(subscribeProducts, getProducts, getProducts);
}

export function useProductsLoading() {
  return useSyncExternalStore(subscribeProducts, getLoading, () => true);
}
