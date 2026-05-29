// data.js — dados estáticos (catálogo seed, categorias, filtros, info da loja)

export const STORE_INFO = {
  name: 'Tabacaria Roots',
  tagline: 'One Love, One Heart',
  address: 'Av. Conde da Boa Vista, 247 — Boa Vista, Recife/PE',
  cep: '50060-002',
  address2: 'Rua do Hospício, 250 — Boa Vista, Recife/PE',
  cep2: '50050-035',
  phone: '81 99922-3444',
  whatsapp: '5581999223444',
  instagram: '@tabacariareciferoots',
  hours: [
    { day: 'Seg–Sex', time: '09:00 – 18:30' },
    { day: 'Sáb', time: '09:00 – 16:00' },
    { day: 'Domingo', time: 'Fechado' },
  ],
};

export const CATEGORIES = [
  { id: 'all',       label: 'Tudo' },
  { id: 'narguile',      label: 'Narguilé' },
  { id: 'sedas',         label: 'Sedas' },
  { id: 'dichavadores',  label: 'Dichavadores' },
  { id: 'tabacos',   label: 'Tabacos' },
  { id: 'palhas',    label: 'Cigarros de Palha' },
  { id: 'charutos',  label: 'Charutos' },
  { id: 'piteiras',  label: 'Piteiras' },
  { id: 'isqueiros',    label: 'Isqueiros' },
  { id: 'bongs',        label: 'Bongs' },
  { id: 'acessorios',   label: 'Acessórios' },
  { id: 'cachimbos',    label: 'Cachimbos' },
  { id: 'pipe-metal',   label: 'Pipe de Metal' },
];

export const CAT_COLORS = {
  narguile:  '#1f6b35',
  sedas:        '#3a5a28',
  dichavadores: '#4a6a38',
  tabacos:   '#7a4a1a',
  palhas:    '#a87632',
  charutos:  '#5a2818',
  piteiras:  '#3a3a35',
  isqueiros:  '#c8232c',
  bongs:      '#1f4a55',
  acessorios: '#5a4a7a',
  cachimbos:  '#6b3a1f',
  'pipe-metal': '#4a4a5a',
  outros:     '#4a4a4a',
};

export const ADMIN_CATEGORIES = [
  ...CATEGORIES,
  { id: 'outros', label: 'Outros' },
];


export const FILTERS = {
  preco: [
    { id: 'p-all', label: 'Qualquer preço', min: 0, max: 99999 },
    { id: 'p-1', label: 'Até R$25', min: 0, max: 25 },
    { id: 'p-2', label: 'R$25 – R$80', min: 25, max: 80 },
    { id: 'p-3', label: 'R$80 – R$200', min: 80, max: 200 },
    { id: 'p-4', label: 'R$200+', min: 200, max: 99999 },
  ],
  ordenar: [
    { id: 'relevance', label: 'Relevância' },
    { id: 'top', label: 'Mais vendidos' },
    { id: 'novo', label: 'Novidades' },
    { id: 'promo', label: 'Em promoção' },
    { id: 'price-asc', label: 'Menor preço' },
    { id: 'price-desc', label: 'Maior preço' },
  ],
};

export function filterProducts(products, { cat, q, priceRange, sort }) {
  let out = products.slice();
  if (cat && cat !== 'all') out = out.filter(p => p.cat === cat);
  if (q) {
    const ql = q.toLowerCase();
    out = out.filter(p =>
      p.name.toLowerCase().includes(ql) ||
      (p.brand || '').toLowerCase().includes(ql) ||
      (p.desc || '').toLowerCase().includes(ql)
    );
  }
  if (priceRange) {
    out = out.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
  }
  if (sort === 'top') out = out.filter(p => p.bestseller || (p.tags || []).includes('top'));
  if (sort === 'novo') out = out.filter(p => (p.tags || []).includes('novo'));
  if (sort === 'promo') out = out.filter(p => p.oldPrice);
  if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
  return out;
}

export const formatBRL = (n) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
