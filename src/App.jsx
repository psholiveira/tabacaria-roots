// App.jsx — switch responsivo + roteamento por URL + auth admin

import { useEffect, useState, lazy, Suspense } from 'react';
import { MobileApp }    from './mobile/MobileApp.jsx';
import { DesktopApp }   from './desktop/DesktopApp.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { supabase }     from './lib/supabase.js';
import { initProducts } from './store/products.js';
import { useIsMobile }  from './hooks/useIsMobile.js';
import { parsePath, migrateHashRoute } from './lib/routes.js';

const AdminApp   = lazy(() => import('./admin/Admin.jsx').then(m => ({ default: m.AdminApp })));
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx').then(m => ({ default: m.AdminLogin })));

migrateHashRoute();

// só decide loja × admin; as telas da loja escutam o popstate por conta própria
function useIsAdminRoute() {
  const check = () => parsePath(window.location.pathname).screen === 'admin';
  const [isAdmin, setIsAdmin] = useState(check);
  useEffect(() => {
    const onPop = () => setIsAdmin(check());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return isAdmin;
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
  const isAdmin  = useIsAdminRoute();
  const isMobile = useIsMobile();

  // Carrega produtos do Supabase na inicialização
  useEffect(() => { initProducts(); }, []);

  if (isAdmin) {
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
