// desktop/Chrome.jsx — header + footer

import { STORE_INFO, formatBRL } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { MenuButton } from '../components/KineticMenu.jsx';
import { GradientFooter } from '../components/GradientFooter.jsx';
import { CartButton } from '../components/CartButton.jsx';

export function DesktopHeader({ cart, go, screen, onOpenCart, searchQ = '', onSearchQ, menuOpen = false, onToggleMenu, lastAdded = null }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div className="rasta-stripe" />
      <div style={{ padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 28, maxWidth: 1440, margin: '0 auto' }}>
        <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}>
          <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 40, height: 40 }}/>
          <div style={{ textAlign: 'left' }}>
            <div className="display" style={{ fontSize: 13, letterSpacing: '0.06em', lineHeight: 1 }}>ROOTS</div>
            <div style={{ fontSize: 8, color: 'var(--ink-mute)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Tabacaria · Recife</div>
          </div>
        </button>

        <nav className="topnav" aria-label="Principal">
          {[
            { id: 'home',    label: 'Início' },
            { id: 'catalog', label: 'Catálogo' },
            { id: 'kit',     label: 'Monte seu kit' },
            { id: 'store',   label: 'A loja' },
          ].map(t => (
            <button key={t.id} onClick={() => go(t.id)} className={`topnav-link${screen === t.id ? ' is-active' : ''}`}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* busca com "border beam": feixe rasta correndo pela borda */}
        <div className="beam-search" style={{ flex: 1, maxWidth: 380, marginLeft: 'auto' }}>
          <div className="beam-search-inner">
            <Icon.search size={15} className="beam-search-icon" />
            <input className="beam-search-input" placeholder="Tabaco, piteira, seda..."
              value={screen === 'catalog' ? searchQ : ''}
              onChange={screen === 'catalog' ? (e) => onSearchQ(e.target.value) : undefined}
              onFocus={screen !== 'catalog' ? () => go('catalog') : undefined}
              readOnly={screen !== 'catalog'}/>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <CartButton count={cart.count} total={cart.total} onClick={onOpenCart} lastAdded={lastAdded} />
          <MenuButton open={menuOpen} onClick={onToggleMenu} />
        </div>
      </div>
    </header>
  );
}

export function DesktopFooter({ go }) {
  const wa = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Fala Roots! Quero fazer um pedido.')}`;
  const cols = [
    { title: 'Loja', links: [
      { l: 'Catálogo',      f: () => go('catalog') },
      { l: 'Mais vendidos', f: () => go('catalog') },
      { l: 'Novidades',     f: () => go('catalog') },
      { l: 'Monte seu kit', f: () => go('kit') },
      { l: 'A loja',        f: () => go('store') },
    ]},
    { title: 'Contato', links: [
      { l: '(81) 99922-3444', href: wa },
      { l: STORE_INFO.instagram, href: 'https://instagram.com/tabacariareciferoots' },
    ]},
    { title: 'Onde', links: [
      { l: 'Av. Conde da Boa Vista, 247', href: 'https://maps.google.com/?q=Av.+Conde+da+Boa+Vista,+247,+Recife' },
      { l: 'Rua do Hospício, 250',        href: 'https://maps.google.com/?q=Rua+do+Hospicio,+250,+Recife' },
      { l: 'Boa Vista · Recife/PE' },
    ]},
    { title: 'Horário', links: STORE_INFO.hours.map(h => ({ l: `${h.day} · ${h.time}` })) },
  ];

  return (
    <GradientFooter className="gfoot" gradientHeight="40vh">
      <div className="rasta-stripe" />
      <div className="gfoot-inner">
        <div className="gfoot-grid">
          <div className="gfoot-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 44, height: 44 }}/>
              <div>
                <div className="display-tight" style={{ fontSize: 28, letterSpacing: '.12em', lineHeight: 1 }}>ROOTS</div>
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
            {cols.map(col => (
              <div key={col.title}>
                <h3 className="gfoot-title">{col.title}</h3>
                <ul>
                  {col.links.map((it, i) => (
                    <li key={i}>
                      {it.f ? <button onClick={it.f}>{it.l}</button>
                        : it.href ? <a href={it.href} target="_blank" rel="noreferrer">{it.l}</a>
                        : <span>{it.l}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

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

export function SectionHeader({ title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
      <div>
        <h2 className="display" style={{ fontSize: 24, margin: 0, letterSpacing: '0.01em' }}>{title}</h2>
        {sub && <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ height: 2, flex: 1, marginLeft: 24, marginBottom: 8, background: 'var(--line)' }}/>
    </div>
  );
}
