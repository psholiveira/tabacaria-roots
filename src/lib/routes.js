// lib/routes.js — URLs reais (History API) pras telas da loja.
// Sem DOM/import.meta no topo: scripts/sitemap.mjs importa daqui também.

import { CATEGORIES } from '../data.js';

export const SITE_URL = 'https://rootstabacaria.com.br';
const SITE_NAME = 'Roots Tabacaria';

export const slugify = (s = '') => s
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const SCREEN_PATHS = { store: '/loja', kit: '/kit', cart: '/sacola', admin: '/admin' };
const PATH_SCREENS = { loja: 'store', kit: 'kit', sacola: 'cart', admin: 'admin' };

// o slug do nome é só pro buscador; a tela lê apenas o id
export function pathFor(screen, params = {}, product = null) {
  if (screen === 'product' && product) return `/produto/${product.id}/${slugify(product.name)}`;
  if (screen === 'catalog') return params.cat ? `/catalogo/${params.cat}` : '/catalogo';
  return SCREEN_PATHS[screen] ?? '/';
}

export function parsePath(pathname) {
  const [s, param] = pathname.split('/').filter(Boolean);
  if (s === 'catalogo') return { screen: 'catalog', params: param ? { cat: param } : {}, productId: null };
  if (s === 'produto' && param) return { screen: 'product', params: {}, productId: param };
  return { screen: PATH_SCREENS[s] ?? 'home', params: {}, productId: null };
}

export function navigate(path) {
  if (window.location.pathname !== path) window.history.pushState(null, '', path);
}

// links antigos (#catalog/sedas, #product/p123…) viram a URL nova sem recarregar
export function migrateHashRoute() {
  const [s, p] = window.location.hash.slice(1).split('/');
  const legacy = {
    home: '/', catalog: p ? `/catalogo/${p}` : '/catalogo', product: p ? `/produto/${p}` : '/',
    store: '/loja', cart: '/sacola', kit: '/kit', admin: '/admin',
  };
  if (s in legacy) window.history.replaceState(null, '', legacy[s]);
}

export function titleFor(screen, params = {}, product = null) {
  if (screen === 'product' && product) return `${product.name} · ${SITE_NAME}`;
  if (screen === 'catalog') {
    const cat = CATEGORIES.find(c => c.id === params.cat && c.id !== 'all');
    return `${cat ? cat.label : 'Catálogo'} · ${SITE_NAME}`;
  }
  const names = { store: 'A loja', kit: 'Monte seu kit', cart: 'Sacola' };
  return names[screen] ? `${names[screen]} · ${SITE_NAME}` : `${SITE_NAME} · Recife`;
}
