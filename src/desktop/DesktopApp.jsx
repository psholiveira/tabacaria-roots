// desktop/DesktopApp.jsx — orquestra desktop

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useCart } from '../hooks/useCart.js';
import { useProducts } from '../store/products.js';
import { DesktopHeader, DesktopFooter } from './Chrome.jsx';
import { DesktopHome } from './Home.jsx';
import { DesktopCatalog } from './Catalog.jsx';
import { DesktopProduct } from './Product.jsx';
import { DesktopStore } from './Store.jsx';
import { DesktopCartDrawer } from './CartDrawer.jsx';
import { CartToast } from '../components/CartToast.jsx';
import { AgeGate } from '../mobile/Shell.jsx';
import { KitBuilder } from '../components/KitBuilder.jsx';
import { KineticMenu } from '../components/KineticMenu.jsx';
import { ScreenTransition } from '../components/ScreenTransition.jsx';

const AGE_KEY = 'roots:age-confirmed';

function parseHash() {
  const [s, param] = window.location.hash.slice(1).split('/');
  if (s === 'catalog') return { screen: 'catalog', params: param ? { cat: param } : {}, productId: null };
  if (s === 'product' && param) return { screen: 'product', params: {}, productId: param };
  if (s === 'store')  return { screen: 'store',  params: {}, productId: null };
  if (s === 'kit')    return { screen: 'kit',    params: {}, productId: null };
  return { screen: 'home', params: {}, productId: null };
}

function setHash(screen, params = {}, productId = null) {
  if (screen === 'product' && productId) { window.location.hash = `product/${productId}`; return; }
  if (screen === 'catalog') { window.location.hash = params.cat ? `catalog/${params.cat}` : 'catalog'; return; }
  if (['home', 'store', 'kit'].includes(screen)) { window.location.hash = screen; return; }
  window.location.hash = 'home';
}

export function DesktopApp() {
  const initial = parseHash();
  const [screen, setScreen] = useState(initial.screen);
  const [params, setParams] = useState(initial.params);
  const [product, setProduct] = useState(null);
  const [pendingId, setPendingId] = useState(initial.productId);
  const [ageOk, setAgeOk] = useState(() => {
    try { return localStorage.getItem(AGE_KEY) === '1'; } catch { return false; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [catalogQ, setCatalogQ] = useState('');
  const cart = useCart();
  // direção da animação de troca de tela (ordem das abas do menu)
  const SCREEN_ORDER = ['home', 'catalog', 'kit', 'store', 'product'];
  const prevScreen = useRef(screen);
  const dir = SCREEN_ORDER.indexOf(screen) >= SCREEN_ORDER.indexOf(prevScreen.current) ? 1 : -1;
  useEffect(() => { prevScreen.current = screen; }, [screen]);
  const allProducts = useProducts();
  // memoizado: a identidade estável evita resetar a lista progressiva do catálogo a cada render
  const products = useMemo(() => allProducts.filter(p => !p.hidden), [allProducts]);

  // Restaura produto pelo ID quando os produtos carregam
  useEffect(() => {
    if (!pendingId || !products.length) return;
    const found = products.find(p => p.id === pendingId);
    if (found) { setProduct(found); setPendingId(null); }
  }, [pendingId, products]);

  // Sincroniza navegação pelo botão voltar do browser
  useEffect(() => {
    const onHash = () => {
      const { screen: s, params: p, productId } = parseHash();
      setScreen(s);
      setParams(p);
      if (productId) setPendingId(productId);
      else if (s !== 'product') setProduct(null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const go = (s, p = {}) => { setHash(s, p); setScreen(s); setParams(p); if (s !== 'catalog') setCatalogQ(''); window.scrollTo(0, 0); };
  const openProduct = (p) => { setHash('product', {}, p.id); setProduct(p); setScreen('product'); window.scrollTo(0, 0); };
  const addToCart = (p, v) => { cart.add(p, v); setToast({ product: p, id: Date.now() }); };

  // Monte seu kit → joga tudo na sacola de uma vez
  const addKitToCart = (kitItems) => {
    kitItems.forEach(({ product, variation, qty }) => {
      for (let n = 0; n < qty; n++) cart.add(product, variation);
    });
    go('catalog');
    setCartOpen(true);
  };

  const confirmAge = () => {
    try { localStorage.setItem(AGE_KEY, '1'); } catch {}
    setAgeOk(true);
  };

  if (!ageOk) return <AgeGate onConfirm={confirmAge} />;

  return (
    <div className="roots-app" style={{ minHeight: '100dvh' }}>
      <DesktopHeader cart={cart} go={go} screen={screen} onOpenCart={() => setCartOpen(true)} searchQ={catalogQ} onSearchQ={setCatalogQ}
        menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(o => !o)} lastAdded={toast} />
      <KineticMenu open={menuOpen} onClose={closeMenu} go={go} screen={screen} />
      <ScreenTransition key={screen} dir={dir}>
        {screen === 'home' && <DesktopHome products={products} go={go} openProduct={openProduct} addToCart={addToCart} />}
        {screen === 'catalog' && <DesktopCatalog products={products} initialCat={params.cat} openProduct={openProduct} addToCart={addToCart} q={catalogQ} setQ={setCatalogQ} go={go} />}
        {screen === 'kit' && <KitBuilder products={products} onFinish={addKitToCart} onExit={() => go('catalog')} />}
        {screen === 'product' && product && <DesktopProduct products={products} product={product} go={go} openProduct={openProduct} addToCart={addToCart} />}
        {screen === 'store' && <DesktopStore />}
      </ScreenTransition>
      <DesktopFooter go={go} />
      {cartOpen && <DesktopCartDrawer cart={cart} onClose={() => setCartOpen(false)} />}
      {toast && (
        <CartToast
          key={toast.id}
          product={toast.product}
          onClose={() => setToast(null)}
          onViewCart={() => { setToast(null); setCartOpen(true); }}
          mobile={false}
        />
      )}
    </div>
  );
}
