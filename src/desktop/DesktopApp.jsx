// desktop/DesktopApp.jsx — orquestra desktop

import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart.js';
import { useProducts } from '../store/products.js';
import { DesktopHeader, DesktopFooter } from './Chrome.jsx';
import { DesktopHome } from './Home.jsx';
import { DesktopCatalog } from './Catalog.jsx';
import { DesktopProduct } from './Product.jsx';
import { DesktopStore } from './Store.jsx';
import { DesktopCartDrawer } from './CartDrawer.jsx';

function parseHash() {
  const [s, param] = window.location.hash.slice(1).split('/');
  if (s === 'catalog') return { screen: 'catalog', params: param ? { cat: param } : {}, productId: null };
  if (s === 'product' && param) return { screen: 'product', params: {}, productId: param };
  if (s === 'store')  return { screen: 'store',  params: {}, productId: null };
  return { screen: 'home', params: {}, productId: null };
}

function setHash(screen, params = {}, productId = null) {
  if (screen === 'product' && productId) { window.location.hash = `product/${productId}`; return; }
  if (screen === 'catalog') { window.location.hash = params.cat ? `catalog/${params.cat}` : 'catalog'; return; }
  if (['home', 'store'].includes(screen)) { window.location.hash = screen; return; }
  window.location.hash = 'home';
}

export function DesktopApp() {
  const initial = parseHash();
  const [screen, setScreen] = useState(initial.screen);
  const [params, setParams] = useState(initial.params);
  const [product, setProduct] = useState(null);
  const [pendingId, setPendingId] = useState(initial.productId);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();
  const products = useProducts();

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

  const go = (s, p = {}) => { setHash(s, p); setScreen(s); setParams(p); window.scrollTo(0, 0); };
  const openProduct = (p) => { setHash('product', {}, p.id); setProduct(p); setScreen('product'); window.scrollTo(0, 0); };
  const addToCart = (p, v) => { cart.add(p, v); setCartOpen(true); };

  return (
    <div className="roots-app" style={{ minHeight: '100dvh' }}>
      <DesktopHeader cart={cart} go={go} screen={screen} onOpenCart={() => setCartOpen(true)} />
      <div>
        {screen === 'home' && <DesktopHome products={products} go={go} openProduct={openProduct} addToCart={addToCart} />}
        {screen === 'catalog' && <DesktopCatalog products={products} initialCat={params.cat} openProduct={openProduct} addToCart={addToCart} />}
        {screen === 'product' && product && <DesktopProduct products={products} product={product} go={go} openProduct={openProduct} addToCart={addToCart} />}
        {screen === 'store' && <DesktopStore />}
      </div>
      <DesktopFooter go={go} />
      {cartOpen && <DesktopCartDrawer cart={cart} onClose={() => setCartOpen(false)} />}
    </div>
  );
}
