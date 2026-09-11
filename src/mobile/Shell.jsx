// mobile/Shell.jsx — Status bar, age gate, bottom nav

import { STORE_INFO } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { FadeIn } from '../components/FadeIn.jsx';
import { CartButton } from '../components/CartButton.jsx';
import { MenuButton } from '../components/KineticMenu.jsx';
import { GradientFooter } from '../components/GradientFooter.jsx';

// altura da bottom nav (sem a safe area) — usada pra afastar o footer gradiente
export const BOTTOM_NAV_H = 62;

// ─── Barra superior fixa: logo, sacola animada e menu ────────────────────
export function MobileTopBar({ cart, go, onOpenCart, menuOpen, onToggleMenu, lastAdded }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--bg)', borderBottom: '1px solid var(--line)',
    }}>
      <div className="rasta-stripe" />
      <div style={{ padding: '9px 14px 9px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: 0 }}>
          <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 36, height: 36 }}/>
          <div style={{ textAlign: 'left' }}>
            <div className="display" style={{ fontSize: 13, letterSpacing: '0.06em', lineHeight: 1 }}>ROOTS</div>
            <div style={{ fontSize: 8, color: 'var(--ink-mute)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Tabacaria · Recife</div>
          </div>
        </button>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <CartButton count={cart.count} total={cart.total} onClick={onOpenCart} lastAdded={lastAdded} />
          <MenuButton open={menuOpen} onClick={onToggleMenu} />
        </div>
      </div>
    </header>
  );
}

// ─── Footer gradiente (versão compacta do desktop) ────────────────────────
export function MobileFooter({ go }) {
  const wa = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Fala Roots! Quero fazer um pedido.')}`;
  return (
    <GradientFooter className="gfoot gfoot-mobile" gradientHeight="34vh" bottom={`calc(${BOTTOM_NAV_H}px + env(safe-area-inset-bottom, 8px))`}>
      <div className="rasta-stripe" />
      <div className="gfoot-inner">
        <div className="gfoot-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 40, height: 40 }}/>
            <div>
              <div className="display-tight" style={{ fontSize: 26, letterSpacing: '.12em', lineHeight: 1 }}>ROOTS</div>
              <div className="gfoot-mono" style={{ marginTop: 4 }}>Recife · Brasil · desde 2017</div>
            </div>
          </div>
          <p className="gfoot-lead">
            One love, one heart, one session.<br/>
            Curadoria de tabaco, narguilé, sedas, bongs e acessórios no coração da Boa Vista.
          </p>
          <a className="hero-cta hero-cta-solid gfoot-cta" href={wa} target="_blank" rel="noreferrer">
            <Icon.whatsapp size={14}/> Fazer pedido no Whats
          </a>
        </div>

        <nav className="gfoot-cols" aria-label="Rodapé">
          <div>
            <h3 className="gfoot-title">Loja</h3>
            <ul>
              <li><button onClick={() => go('catalog')}>Catálogo</button></li>
              <li><button onClick={() => go('kit')}>Monte seu kit</button></li>
              <li><button onClick={() => go('store')}>A loja</button></li>
            </ul>
          </div>
          <div>
            <h3 className="gfoot-title">Contato</h3>
            <ul>
              <li><a href={wa} target="_blank" rel="noreferrer">{STORE_INFO.phone}</a></li>
              <li><a href="https://instagram.com/tabacariareciferoots" target="_blank" rel="noreferrer">{STORE_INFO.instagram}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="gfoot-title">Onde</h3>
            <ul>
              <li><a href="https://maps.google.com/?q=Av.+Conde+da+Boa+Vista,+247,+Recife" target="_blank" rel="noreferrer">Av. Conde da Boa Vista, 247</a></li>
              <li><a href="https://maps.google.com/?q=Rua+do+Hospicio,+250,+Recife" target="_blank" rel="noreferrer">Rua do Hospício, 250</a></li>
              <li><span>Boa Vista · Recife/PE</span></li>
            </ul>
          </div>
          <div>
            <h3 className="gfoot-title">Horário</h3>
            <ul>
              {STORE_INFO.hours.map(h => <li key={h.day}><span>{h.day} · {h.time}</span></li>)}
            </ul>
          </div>
        </nav>

        <div className="gfoot-bottom">
          <span>© 2026 Roots Tabacaria</span>
          <span className="gfoot-status">
            <span className="gfoot-18">18</span>
            Venda proibida para menores de 18 anos
          </span>
          <span>Fumar pode causar câncer · Lei nº 9.294/96</span>
        </div>
      </div>
    </GradientFooter>
  );
}

export function AgeGate({ onConfirm }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      display: 'flex', flexDirection: 'column',
      zIndex: 200,
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: 'linear-gradient(180deg, var(--rasta-green) 0 33.33%, var(--rasta-gold) 33.33% 66.66%, var(--rasta-red) 66.66% 100%)',
      }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 28px 40px', maxWidth: 480, margin: '0 auto', width: '100%', overflowY: 'auto' }}>
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
            color: '#76705e', fontSize: 13, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
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
    <FadeIn>
      <div style={{ padding: '24px 0 4px' }}>
        <div style={{ padding: '0 16px 12px' }}>
          <h3 className="display" style={{ fontSize: 18, margin: 0, letterSpacing: '0.02em' }}>{title}</h3>
          {subtitle ? <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>{subtitle}</div> : null}
        </div>
        {children}
      </div>
    </FadeIn>
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
