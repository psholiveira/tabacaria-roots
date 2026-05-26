// desktop/Chrome.jsx — header + footer

import { STORE_INFO, formatBRL } from '../data.js';
import { Icon } from '../components/Icons.jsx';

export function DesktopHeader({ cart, go, screen, onOpenCart }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div className="rasta-stripe" />
      <div style={{ padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 32, maxWidth: 1440, margin: '0 auto' }}>
        <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}>
          <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 40, height: 40 }}/>
          <div style={{ textAlign: 'left' }}>
            <div className="display" style={{ fontSize: 15, letterSpacing: '0.06em', lineHeight: 1 }}>ROOTS</div>
            <div style={{ fontSize: 8.5, color: 'var(--ink-mute)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Tabacaria · Recife</div>
          </div>
        </button>

        <nav style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
          {[
            { id: 'home', label: 'Início' },
            { id: 'catalog', label: 'Catálogo' },
            { id: 'store', label: 'A Loja' },
          ].map(t => (
            <button key={t.id} onClick={() => go(t.id)} style={{
              background: 'transparent', border: 'none',
              color: screen === t.id ? 'var(--ink)' : 'var(--ink-dim)',
              padding: '8px 14px', borderRadius: 8,
              fontSize: 13, fontWeight: screen === t.id ? 700 : 500, cursor: 'pointer',
              fontFamily: 'Space Grotesk',
            }}>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
          <Icon.search size={14} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--ink-mute)' }}/>
          <input className="r-input" placeholder="O que vai fumar hoje?" style={{ paddingLeft: 38, padding: '10px 14px 10px 38px', fontSize: 13 }}
            onFocus={() => go('catalog')} readOnly/>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href={`https://wa.me/${STORE_INFO.whatsapp}`} target="_blank" rel="noreferrer" style={{
            background: 'transparent', border: '1.5px solid var(--line)', color: 'var(--ink)',
            padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon.whatsapp size={14}/> Atendimento
          </a>
          <button onClick={onOpenCart} style={{
            background: 'var(--ink)', color: 'var(--bg)',
            border: 'none', padding: '9px 14px', borderRadius: 999,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon.cart size={15}/>
            <span>{cart.count > 0 ? `${cart.count} item${cart.count > 1 ? 's' : ''} · ${formatBRL(cart.total)}` : 'Sacola vazia'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function DesktopFooter({ go }) {
  return (
    <footer style={{
      background: 'var(--bg-elev)',
      borderTop: '1px solid var(--line)',
      padding: '40px 36px 30px',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 30, borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 36, height: 36 }}/>
              <div className="display" style={{ fontSize: 15, letterSpacing: '0.05em' }}>ROOTS TABACARIA</div>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-dim)', lineHeight: 1.6, maxWidth: 320 }}>
              One Love, One Heart, One Session.<br/>
              Desde 2017 no coração do Recife.
            </p>
          </div>
          <FooterCol title="Loja" items={[
            { l: 'Catálogo', f: () => go('catalog') },
            { l: 'Mais vendidos', f: () => go('catalog') },
            { l: 'Novidades', f: () => go('catalog') },
            { l: 'Promoções', f: () => go('catalog') },
          ]}/>
          <FooterCol title="Contato" items={[
            { l: '(81) 99922-3444' },
            { l: '@tabacariareciferoots' },
            { l: 'Av. Conde da Boa Vista, 247' },
          ]}/>
          <FooterCol title="Horário" items={STORE_INFO.hours.map(h => ({ l: `${h.day} · ${h.time}` }))}/>
        </div>
        <div style={{ paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.06em', textTransform: 'uppercase', flexWrap: 'wrap', gap: 10 }}>
          <span>© 2026 Roots Tabacaria · Venda proibida para menores de 18 anos</span>
          <span>Fumar pode causar câncer · Lei nº 9.294/96</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <button key={i} onClick={it.f} disabled={!it.f} style={{
            background: 'transparent', border: 'none', color: 'var(--ink-dim)', fontSize: 12.5,
            cursor: it.f ? 'pointer' : 'default', padding: 0, textAlign: 'left', fontFamily: 'inherit',
          }}>{it.l}</button>
        ))}
      </div>
    </div>
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
