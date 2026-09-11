// mobile/MobileApp.jsx — orquestra todas as telas mobile

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useCart } from '../hooks/useCart.js';
import { useProducts } from '../store/products.js';
import { AgeGate, BottomNav, MobileTopBar, MobileFooter } from './Shell.jsx';
import { CartToast } from '../components/CartToast.jsx';
import { KineticMenu } from '../components/KineticMenu.jsx';
import { ScreenTransition } from '../components/ScreenTransition.jsx';
import { MobileHome } from './Home.jsx';
import { MobileCatalog } from './Catalog.jsx';
import { MobileProduct } from './Product.jsx';
import { MobileCart } from './Cart.jsx';
import { MobileCheckout } from './Checkout.jsx';
import { MobileStore } from './Store.jsx';
import { KitBuilder } from '../components/KitBuilder.jsx';

const AGE_KEY = 'roots:age-confirmed';

function parseHash() {
  const [s, param] = window.location.hash.slice(1).split('/');
  if (s === 'catalog') return { screen: 'catalog', params: param ? { cat: param } : {}, productId: null };
  if (s === 'product' && param) return { screen: 'product', params: {}, productId: param };
  if (s === 'store')   return { screen: 'store',   params: {}, productId: null };
  if (s === 'cart')    return { screen: 'cart',    params: {}, productId: null };
  if (s === 'kit')     return { screen: 'kit',     params: {}, productId: null };
  return { screen: 'home', params: {}, productId: null };
}

function setHash(screen, params = {}, productId = null) {
  if (screen === 'product' && productId) { window.location.hash = `product/${productId}`; return; }
  if (screen === 'catalog') { window.location.hash = params.cat ? `catalog/${params.cat}` : 'catalog'; return; }
  if (['home', 'store', 'cart', 'kit'].includes(screen)) { window.location.hash = screen; return; }
  window.location.hash = 'home';
}

export function MobileApp() {
  const initial = parseHash();
  const [screen, setScreen] = useState(initial.screen);
  const [params, setParams] = useState(initial.params);
  const [product, setProduct] = useState(null);
  const [pendingId, setPendingId] = useState(initial.productId);
  const [ageOk, setAgeOk] = useState(() => {
    try { return localStorage.getItem(AGE_KEY) === '1'; } catch { return false; }
  });
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCart();
  // direção da animação de troca de tela (ordem das abas)
  const SCREEN_ORDER = ['home', 'catalog', 'kit', 'product', 'cart', 'checkout', 'store'];
  const prevScreen = useRef(screen);
  const dir = SCREEN_ORDER.indexOf(screen) >= SCREEN_ORDER.indexOf(prevScreen.current) ? 1 : -1;
  useEffect(() => { prevScreen.current = screen; }, [screen]);
  const allProducts = useProducts();
  // memoizado: a identidade estável evita resetar a lista progressiva do catálogo a cada render
  const products = useMemo(() => allProducts.filter(p => !p.hidden), [allProducts]);

  const addToCart = (p, v) => { cart.add(p, v); setToast({ product: p, id: Date.now() }); };

  // Monte seu kit → joga tudo na sacola de uma vez
  const addKitToCart = (kitItems) => {
    kitItems.forEach(({ product, variation, qty }) => {
      for (let n = 0; n < qty; n++) cart.add(product, variation);
    });
    go('cart');
  };

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
  const go = (s, p = {}) => { if (s !== 'checkout') setHash(s, p); setScreen(s); setParams(p); window.scrollTo(0, 0); };
  const openProduct = (p) => { setHash('product', {}, p.id); setProduct(p); setScreen('product'); window.scrollTo(0, 0); };

  const confirmAge = () => {
    try { localStorage.setItem(AGE_KEY, '1'); } catch {}
    setAgeOk(true);
  };

  if (!ageOk) return <AgeGate onConfirm={confirmAge} />;

  const showNav    = ['home', 'catalog', 'cart', 'store'].includes(screen);
  const showFooter = ['home', 'catalog', 'store', 'kit'].includes(screen);

  return (
    <div className="roots-app" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'clip' }}>
      <MobileTopBar cart={cart} go={go} onOpenCart={() => go('cart')} lastAdded={toast}
        menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(o => !o)} />
      <KineticMenu open={menuOpen} onClose={closeMenu} go={go} screen={screen} />
      <ScreenTransition key={screen} dir={dir} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, width: '100%' }}>
        {screen === 'home' && (
          <MobileHome products={products} go={go} addToCart={addToCart} openProduct={openProduct} />
        )}
        {screen === 'catalog' && (
          <MobileCatalog
            products={products}
            initialCat={params.cat}
            addToCart={addToCart}
            openProduct={openProduct}
            onBack={() => go('home')}
            go={go}
          />
        )}
        {screen === 'product' && product && (
          <MobileProduct
            products={products}
            product={product}
            addToCart={addToCart}
            openProduct={openProduct}
            onBack={() => go('catalog')}
            go={go}
          />
        )}
        {screen === 'cart' && (
          <MobileCart cart={cart} onBack={() => go('home')} go={go} />
        )}
        {screen === 'checkout' && (
          <MobileCheckout cart={cart} onBack={() => go('cart')} />
        )}
        {screen === 'store' && (
          <MobileStore onBack={() => go('home')} />
        )}
        {screen === 'kit' && (
          <KitBuilder
            products={products}
            mobile={true}
            onFinish={addKitToCart}
            onExit={() => go('catalog')}
          />
        )}
      </div>
      </ScreenTransition>
      {showFooter && <MobileFooter go={go} />}
      {showNav && <BottomNav active={screen} onNav={go} cartCount={cart.count} />}
      {toast && (
        <CartToast
          key={toast.id}
          product={toast.product}
          onClose={() => setToast(null)}
          onViewCart={() => { setToast(null); go('cart'); }}
          mobile={true}
        />
      )}
    </div>
  );
}
