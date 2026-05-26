// mobile/Shell.jsx — Status bar, age gate, bottom nav

import { Icon } from '../components/Icons.jsx';

export function StatusBar({ light }) {
  const c = light ? '#fff' : 'var(--ink)';
  return (
    <div style={{
      height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px 0', color: c, fontFamily: '-apple-system, system-ui',
      fontWeight: 600, fontSize: 15, position: 'relative', zIndex: 50,
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="6" width="3" height="5" rx=".7"/><rect x="5" y="4" width="3" height="7" rx=".7"/><rect x="10" y="2" width="3" height="9" rx=".7"/><rect x="15" y="0" width="3" height="11" rx=".7"/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill="currentColor"/></svg>
      </span>
    </div>
  );
}

export function AgeGate({ onConfirm }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      display: 'flex', flexDirection: 'column',
      zIndex: 200,
    }}>
      <StatusBar light />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: 'linear-gradient(180deg, var(--rasta-green) 0 33.33%, var(--rasta-gold) 33.33% 66.66%, var(--rasta-red) 66.66% 100%)',
      }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 28px 40px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 60, height: 60 }} />
            <div>
              <div className="display-tight" style={{ fontSize: 28, color: '#f5b528', lineHeight: 1 }}>ROOTS</div>
              <div style={{ fontSize: 10, color: '#76705e', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Tabacaria · Recife</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 68, lineHeight: 0.88,
            color: '#fff', letterSpacing: '0.01em',
          }}>
            VOCÊ TEM<br/>
            <span style={{ color: '#f5b528' }}>+ DE 18</span><br/>
            ANOS?
          </div>
          <p style={{
            color: '#a8a290', fontSize: 13.5, lineHeight: 1.5,
            marginTop: 22, maxWidth: 320,
          }}>
            Este conteúdo é destinado exclusivamente a maiores de 18 anos.
            A venda de produtos de tabaco é proibida para menores.
          </p>
        </div>
        <div>
          <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: 15 }} onClick={onConfirm}>
            Sou maior de 18
          </button>
          <button onClick={() => { window.location.href = 'https://google.com'; }} style={{
            width: '100%', padding: '14px', marginTop: 10, background: 'transparent', border: 'none',
            color: '#76705e', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
          }}>
            Não tenho 18 anos
          </button>
          <div style={{
            marginTop: 22, paddingTop: 18, borderTop: '1px solid #2a2823',
            color: '#5a5648', fontSize: 10.5, letterSpacing: '0.05em',
            textTransform: 'uppercase', textAlign: 'center',
          }}>
            Fumar pode causar câncer · Lei nº 9.294/96
          </div>
        </div>
      </div>
    </div>
  );
}

export function BottomNav({ active, onNav, cartCount }) {
  const tabs = [
    { id: 'home', label: 'Início', svg: <path d="M3 11 12 3l9 8M5 10v10h14V10"/> },
    { id: 'catalog', label: 'Catálogo', svg: <><path d="M3 6h18M3 12h18M3 18h12"/></> },
    { id: 'cart', label: 'Sacola', svg: <><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h7a2 2 0 0 0 2-1.5L20.5 8H6"/></> },
    { id: 'store', label: 'Loja', svg: <><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></> },
  ];
  return (
    <div style={{
      position: 'sticky', bottom: 0, left: 0, right: 0,
      background: 'var(--bg)',
      borderTop: '1px solid var(--line)',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      display: 'flex',
      zIndex: 30,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onNav(t.id)} style={{
            flex: 1, background: 'transparent', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '11px 0 9px', cursor: 'pointer',
            color: isActive ? 'var(--ink)' : 'var(--ink-mute)',
            position: 'relative',
          }}>
            {isActive && <div style={{ position:'absolute', top: 0, width: 26, height: 2.5, background: 'var(--accent)', borderRadius: 99 }}/>}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {t.svg}
            </svg>
            {t.id === 'cart' && cartCount > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 'calc(50% - 22px)',
                background: 'var(--rasta-red)', color: '#fff',
                fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 99,
                minWidth: 16, textAlign: 'center',
              }}>{cartCount}</span>
            )}
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.2 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function MobileHeader({ title, onBack, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 16px 12px', gap: 10,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 999, border: '1px solid var(--line)',
          background: 'var(--bg-elev)', color: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}><Icon.back size={16}/></button>
      ) : <div style={{ width: 36 }}/>}
      <div className="display" style={{ fontSize: 16, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ width: 36 }}>{right}</div>
    </div>
  );
}

export function Section({ title, subtitle, children }) {
  return (
    <div style={{ padding: '24px 0 4px' }}>
      <div style={{ padding: '0 16px 12px' }}>
        <h3 className="display" style={{ fontSize: 18, margin: 0, letterSpacing: '0.02em' }}>{title}</h3>
        {subtitle ? <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function Row({ k, v, muted }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 13, color: muted ? 'var(--ink-mute)' : 'var(--ink-dim)' }}>{k}</div>
      <div style={{ fontSize: 13, color: muted ? 'var(--ink-mute)' : 'var(--ink)' }}>{v}</div>
    </div>
  );
}

export function Label({ children }) {
  return <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{children}</div>;
}
