// data.js — dados estáticos (catálogo seed, categorias, filtros, info da loja)

export const STORE_INFO = {
  name: 'Tabacaria Roots',
  tagline: 'One Love, One Heart',
  address: 'Av. Conde da Boa Vista, 247 — Boa Vista, Recife/PE',
  cep: '50060-002',
  phone: '81 99922-3444',
  whatsapp: '5581999223444',
  instagram: '@tabacariareciferoots',
  hours: [
    { day: 'Seg–Qui', time: '10:00 – 22:00' },
    { day: 'Sex–Sáb', time: '10:00 – 00:00' },
    { day: 'Domingo', time: '14:00 – 22:00' },
  ],
};

export const CATEGORIES = [
  { id: 'all',       label: 'Tudo' },
  { id: 'narguile',  label: 'Narguilé' },
  { id: 'sedas',     label: 'Sedas & Dichas' },
  { id: 'tabacos',   label: 'Tabacos' },
  { id: 'palhas',    label: 'Cigarros Palha' },
  { id: 'charutos',  label: 'Charutos' },
  { id: 'piteiras',  label: 'Piteiras' },
  { id: 'isqueiros', label: 'Isqueiros' },
  { id: 'bongs',     label: 'Bongs' },
];

export const CAT_COLORS = {
  narguile:  '#1f6b35',
  sedas:     '#3a5a28',
  tabacos:   '#7a4a1a',
  palhas:    '#a87632',
  charutos:  '#5a2818',
  piteiras:  '#3a3a35',
  isqueiros: '#c8232c',
  bongs:     '#1f4a55',
  outros:    '#4a4a4a',
};

export const ADMIN_CATEGORIES = [
  ...CATEGORIES,
  { id: 'outros', label: 'Outros' },
];

export const SEED_PRODUCTS = [
  { id: 'p1', cat: 'narguile', name: 'Essência Zomo Mint Storm', brand: 'Zomo', price: 32.90, rating: 4.8, ratings: 142,
    tags: ['novo'], variations: ['50g', '250g'],
    desc: 'Essência refrescante de menta intensa com toque cítrico. Pega cremosa, fumaça densa e gosto duradouro.',
    bestseller: false },
  { id: 'p2', cat: 'narguile', name: 'Carvão Pratik 1kg', brand: 'Pratik', price: 39.00, rating: 4.9, ratings: 318,
    tags: ['top'], variations: ['1kg', '500g'], oldPrice: 49.00,
    desc: 'Carvão de coco prensado, queima limpa por até 90 minutos. Acende rápido na fornalha elétrica.',
    bestseller: true },
  { id: 'p3', cat: 'narguile', name: 'Rosh Phunnel Cerâmica', brand: 'Vasco', price: 89.00, rating: 4.7, ratings: 56,
    tags: [], variations: ['Preto', 'Areia'],
    desc: 'Rosh phunnel artesanal em cerâmica esmaltada. Distribui melhor o calor — sessão sem queimar.',
    bestseller: false },
  { id: 'p4', cat: 'narguile', name: 'Mangueira Silicone Premium', brand: 'AMY', price: 65.00, rating: 4.6, ratings: 91,
    tags: ['import'], variations: ['Preto', 'Dourado', 'Vermelho'],
    desc: 'Mangueira em silicone atóxico, lavável, com piteira de alumínio. 1.8m de puro flow.',
    bestseller: false },
  { id: 'p5', cat: 'sedas', name: 'Seda OCB Slim Premium', brand: 'OCB', price: 7.50, rating: 4.9, ratings: 612,
    tags: ['top'], variations: ['Slim', 'King Size'],
    desc: 'Papel ultrafino francês, queima uniforme, sabor neutro. A clássica que nunca falha.',
    bestseller: true },
  { id: 'p6', cat: 'sedas', name: 'Dichavador Metal Lion 4 Partes', brand: 'Roots', price: 89.00, rating: 4.8, ratings: 124,
    tags: ['top'], variations: ['Dourado', 'Preto'],
    desc: 'Dichavador 4 partes em alumínio aeronáutico, dentes em formato de diamante. Coletor de pólen incluído.',
    bestseller: true },
  { id: 'p7', cat: 'sedas', name: 'Piteira Bem Bolado Long', brand: 'Bem Bolado', price: 6.00, rating: 4.7, ratings: 280,
    tags: [], variations: ['25 un', '50 un'],
    desc: 'Piteira de papelão reciclado, perfurada, pronta pra enrolar. Pacotinho de bolso.',
    bestseller: false },
  { id: 'p8', cat: 'tabacos', name: 'Tabaco Mac Baren Vanilla', brand: 'Mac Baren', price: 89.90, rating: 4.8, ratings: 88,
    tags: ['import'], variations: ['50g', '100g'],
    desc: 'Tabaco dinamarquês de corte fino aromatizado com baunilha caribenha. Aroma envolvente.',
    bestseller: false },
  { id: 'p9', cat: 'tabacos', name: 'Fumo de Corda Arapiraca', brand: 'Arapiraca', price: 24.00, rating: 4.6, ratings: 156,
    tags: [], variations: ['100g', '250g'], oldPrice: 28.00,
    desc: 'Fumo de corda nordestino, curado no sol. Sabor encorpado e tradição alagoana.',
    bestseller: false },
  { id: 'p10', cat: 'palhas', name: 'Palheiros Colomy Maçã', brand: 'Colomy', price: 8.50, rating: 4.5, ratings: 203,
    tags: [], variations: ['Maçã', 'Mentol', 'Tradicional'],
    desc: 'Cigarro de palha com toque de maçã. Maço com 20 unidades, palha de milho 100% natural.',
    bestseller: false },
  { id: 'p11', cat: 'palhas', name: 'Palha de Milho Bem Bolado', brand: 'Bem Bolado', price: 12.00, rating: 4.7, ratings: 89,
    tags: ['novo'], variations: ['25 un'],
    desc: 'Folhas de palha de milho selecionadas, secas naturalmente. Pra montar do seu jeito.',
    bestseller: false },
  { id: 'p12', cat: 'charutos', name: 'Charuto Le Cigar Brasil', brand: 'Le Cigar', price: 28.00, rating: 4.6, ratings: 41,
    tags: [], variations: ['Robusto', 'Corona'],
    desc: 'Charuto nacional de capa brasileira, encorpado e levemente adocicado. Tabaco bahiano envelhecido 18 meses.',
    bestseller: false },
  { id: 'p13', cat: 'charutos', name: 'Cohiba Mini 10un', brand: 'Cohiba', price: 195.00, rating: 4.9, ratings: 22,
    tags: ['import'], variations: ['Original'],
    desc: 'Cigarrilhas premium cubanas, blend Habanos. Caixa com 10 unidades.',
    bestseller: false },
  { id: 'p14', cat: 'piteiras', name: 'Cachimbo Briar Ash', brand: 'Briar Ash', price: 320.00, rating: 4.8, ratings: 12,
    tags: ['top'], variations: ['Reto', 'Curvo'],
    desc: 'Cachimbo entalhado em raiz de Briar mediterrâneo. Peça única, acabamento envernizado.',
    bestseller: false },
  { id: 'p15', cat: 'piteiras', name: 'Piteira Vidro RAW', brand: 'RAW', price: 22.00, rating: 4.7, ratings: 134,
    tags: [], variations: ['8mm', '10mm'],
    desc: 'Piteira de vidro borossilicato. Reutilizável, lavável, não esquenta. Filtragem limpa.',
    bestseller: false },
  { id: 'p16', cat: 'isqueiros', name: 'Zippo Black Matte Lion', brand: 'Zippo', price: 189.00, rating: 4.9, ratings: 67,
    tags: ['import', 'top'], variations: ['Preto Matte'],
    desc: 'Zippo edição limitada Roots, gravação a laser do leão de Judah. Garantia vitalícia.',
    bestseller: true },
  { id: 'p17', cat: 'isqueiros', name: 'Maçarico Tocha Recarregável', brand: 'Honest', price: 45.00, rating: 4.4, ratings: 95,
    tags: [], variations: ['Preto', 'Camuflado'],
    desc: 'Isqueiro maçarico com chama dupla, recarregável a butano. Trava de segurança.',
    bestseller: false },
  { id: 'p18', cat: 'bongs', name: 'Bong Vidro Beaker 30cm', brand: 'Glass Lab', price: 280.00, rating: 4.8, ratings: 38,
    tags: ['top'], variations: ['Transparente', 'Verde Escuro'],
    desc: 'Bong em vidro borossilicato grosso (5mm), base beaker, percolador difusor. Estável e fácil de limpar.',
    bestseller: true },
  { id: 'p19', cat: 'bongs', name: 'Bong Acrílico 25cm', brand: 'Roots', price: 79.00, rating: 4.3, ratings: 71,
    tags: ['novo'], variations: ['Verde', 'Vermelho', 'Preto'],
    desc: 'Bong em acrílico colorido, ideal pra começar. Resistente a quedas, fácil de viajar.',
    bestseller: false },
  { id: 'p20', cat: 'bongs', name: 'Cuia de Cerâmica Esmaltada', brand: 'Glass Lab', price: 35.00, rating: 4.6, ratings: 52,
    tags: [], variations: ['14mm', '18mm'],
    desc: 'Cuia substituta pra bong, esmaltada, queima parelha. Compatível com encaixes padrão.',
    bestseller: false },
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
