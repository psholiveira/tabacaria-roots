// App.jsx — switch responsivo + roteamento por hash + auth admin

import { useEffect, useState, lazy, Suspense } from 'react';
import { BREAKPOINT_MOBILE } from './config.js';
import { MobileApp }    from './mobile/MobileApp.jsx';
import { DesktopApp }   from './desktop/DesktopApp.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { supabase }     from './lib/supabase.js';
import { initProducts } from './store/products.js';

const AdminApp   = lazy(() => import('./admin/Admin.jsx').then(m => ({ default: m.AdminApp })));
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx').then(m => ({ default: m.AdminLogin })));

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1));
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.slice(1));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

function useIsMobile(breakpoint = BREAKPOINT_MOBILE) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// ─── Spinner compartilhado ────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="roots-app" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: 99, animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Rota protegida do admin ───────────────────────────────────────────────
function AdminRoute() {
  // undefined = checando | null = sem sessão | objeto = autenticado
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Spinner />;
  if (!session) return <AdminLogin />;
  return <AdminApp />;
}

// ─── App raiz ─────────────────────────────────────────────────────────────
export default function App() {
  const route    = useHashRoute();
  const isMobile = useIsMobile();

  // Carrega produtos do Supabase na inicialização
  useEffect(() => { initProducts(); }, []);

  if (route === 'admin') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <AdminRoute />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      {isMobile ? <MobileApp /> : <DesktopApp />}
    </ErrorBoundary>
  );
}
