// scripts/sitemap.mjs — gera dist/sitemap.xml depois do `vite build`.
// Páginas fixas + categorias + todos os produtos visíveis do Supabase.
// Se o Supabase falhar, sai só com as páginas fixas (não quebra o build).

import { writeFileSync } from 'node:fs';
import { loadEnv } from 'vite';
import { CATEGORIES } from '../src/data.js';
import { SITE_URL, pathFor } from '../src/lib/routes.js';

const env = loadEnv('production', process.cwd(), 'VITE_');

async function fetchProducts() {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes');
  const res = await fetch(`${url}/rest/v1/products?select=id,name,cat,hidden&order=created_at`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase respondeu ${res.status}`);
  return (await res.json()).filter(p => !p.hidden);
}

let products = null;
try {
  products = await fetchProducts();
} catch (err) {
  console.warn(`[sitemap] sem produtos: ${err.message}`);
}

// categoria vazia é página rala pro Google — só entra quem tem produto
const usedCats = products && new Set(products.map(p => p.cat));
const paths = [
  '/', '/catalogo', '/loja', '/kit',
  ...CATEGORIES.filter(c => c.id !== 'all' && (!usedCats || usedCats.has(c.id))).map(c => pathFor('catalog', { cat: c.id })),
  ...(products ?? []).map(p => pathFor('product', {}, p)),
];

const xmlEscape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(p => `  <url><loc>${xmlEscape(SITE_URL + p)}</loc></url>`).join('\n')}
</urlset>
`;

writeFileSync('dist/sitemap.xml', xml);
console.log(`[sitemap] ${paths.length} URLs → dist/sitemap.xml`);
