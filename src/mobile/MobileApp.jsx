// mobile/MobileApp.jsx — orquestra todas as telas mobile

import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart.js';
import { useProducts } from '../store/products.js';
import { AgeGate, BottomNav } from './Shell.jsx';
import { CartToast } from '../components/CartToast.jsx';
import { MobileHome } from './Home.jsx';
import { MobileCatalog } from './Catalog.jsx';
import { MobileProduct } from './Product.jsx';
import { MobileCart } from './Cart.jsx';
import { MobileCheckout } from './Checkout.jsx';
import { MobileStore } from './Store.jsx';

const AGE_KEY = 'roots:age-confirmed';

function parseHash() {
  const [s, param] = window.location.hash.slice(1).split('/');
  if (s === 'catalog') return { screen: 'catalog', params: param ? { cat: param } : {}, productId: null };
  if (s === 'product' && param) return { screen: 'product', params: {}, productId: param };
  if (s === 'store')   return { screen: 'store',   params: {}, productId: null };
  if (s === 'cart')    return { screen: 'cart',    params: {}, productId: null };
  return { screen: 'home', params: {}, productId: null };
}

function setHash(screen, params = {}, productId = null) {
  if (screen === 'product' && productId) { window.location.hash = `product/${productId}`; return; }
  if (screen === 'catalog') { window.location.hash = params.cat ? `catalog/${params.cat}` : 'catalog'; return; }
  if (['home', 'store', 'cart'].includes(screen)) { window.location.hash = screen; return; }
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
  const cart = useCart();
  const allProducts = useProducts();
  const products = allProducts.filter(p => !p.hidden);

  const addToCart = (p, v) => { cart.add(p, v); setToast({ product: p, id: Date.now() }); };

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

  const go = (s, p = {}) => { if (s !== 'checkout') setHash(s, p); setScreen(s); setParams(p); window.scrollTo(0, 0); };
  const openProduct = (p) => { setHash('product', {}, p.id); setProduct(p); setScreen('product'); window.scrollTo(0, 0); };

  const confirmAge = () => {
    try { localStorage.setItem(AGE_KEY, '1'); } catch {}
    setAgeOk(true);
  };

  if (!ageOk) return <AgeGate onConfirm={confirmAge} />;

  const showNav = ['home', 'catalog', 'cart', 'store'].includes(screen);

  return (
    <div className="roots-app" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div key={screen} style={{ flex: 1, maxWidth: 480, width: '100%', margin: '0 auto', animation: 'page-enter 0.24s ease-out' }}>
        {screen === 'home' && (
          <MobileHome products={products} go={go} addToCart={addToCart} openProduct={openProduct} cartCount={cart.count} />
        )}
        {screen === 'catalog' && (
          <MobileCatalog
            products={products}
            initialCat={params.cat}
            addToCart={addToCart}
            openProduct={openProduct}
            onBack={() => go('home')}
            go={go}
            cartCount={cart.count}
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
            cartCount={cart.count}
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
      </div>
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
