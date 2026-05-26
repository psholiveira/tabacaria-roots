// mobile/Store.jsx — info da loja

import { STORE_INFO } from '../data.js';
import { isStoreOpen } from '../config.js';
import { Icon } from '../components/Icons.jsx';
import { MobileHeader, Label } from './Shell.jsx';

export function MobileStore({ onBack }) {
  const isOpen = isStoreOpen();
  return (
    <div style={{ paddingBottom: 24 }}>
      <MobileHeader title="A Loja" onBack={onBack} />
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: 'var(--rasta-green-deep)',
          borderRadius: 16, padding: '22px 20px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(45deg, transparent 0 14px, rgba(245,181,40,0.05) 14px 15px)',
          }}/>
          <div style={{ position: 'relative' }}>
            <img src="/assets/logo-roots.png" alt="Roots" style={{ width: 110, height: 110, marginBottom: 14 }} />
            <div className="display-tight" style={{ fontSize: 36, color: '#fff', lineHeight: 0.95 }}>
              ROOTS<br/><span style={{ color: '#f5b528' }}>TABACARIA</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 8, fontStyle: 'italic' }}>"One Love, One Heart"</div>
          </div>
        </div>

        <div className="r-card" style={{ padding: 16, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isOpen ? 'var(--positive)' : 'var(--rasta-red)' }}/>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: isOpen ? 'var(--positive)' : 'var(--rasta-red)' }}>
              {isOpen ? 'Aberto agora · até 22:00' : 'Fechado · abre 10:00'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STORE_INFO.hours.map(h => (
              <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: 'var(--ink-dim)' }}>{h.day}</span>
                <span style={{ color: 'var(--ink)' }}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ContactRow icon={<Icon.pin />} title="Endereço" value={STORE_INFO.address.split(' — ')[0]} sub={STORE_INFO.address.split(' — ')[1] + ' · CEP ' + STORE_INFO.cep}/>
          <ContactRow icon={<Icon.whatsapp />} title="WhatsApp" value="(81) 99922-3444" cta="Chamar" onClick={() => window.open(`https://wa.me/${STORE_INFO.whatsapp}`, '_blank')}/>
          <ContactRow icon={<Icon.insta />} title="Instagram" value={STORE_INFO.instagram} cta="Abrir" onClick={() => window.open('https://www.instagram.com/tabacariareciferoots/', '_blank')}/>
        </div>

        <div style={{
          marginTop: 16,
          height: 160,
          borderRadius: 14, overflow: 'hidden',
          background: '#1a261d',
          position: 'relative',
        }}>
          <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <rect width="400" height="200" fill="#0d1a12"/>
            <path d="M0 80 L400 60" stroke="#1f6b35" strokeWidth="20" opacity="0.4"/>
            <path d="M0 120 L400 140" stroke="#1f6b35" strokeWidth="14" opacity="0.4"/>
            <path d="M80 0 L120 200" stroke="#2a3a2a" strokeWidth="2"/>
            <path d="M200 0 L240 200" stroke="#2a3a2a" strokeWidth="2"/>
            <path d="M320 0 L340 200" stroke="#2a3a2a" strokeWidth="2"/>
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 99, background: '#f5b528', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1408', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
              <Icon.pin size={20}/>
            </div>
          </div>
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(STORE_INFO.address)}`} target="_blank" rel="noreferrer" style={{
            position: 'absolute', bottom: 12, right: 12,
            background: '#fff', color: '#000', textDecoration: 'none',
            padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
          }}>Como chegar</a>
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Sobre</Label>
          <p style={{ fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.6, marginTop: 10 }}>
            A Roots nasceu no coração do Recife como ponto de encontro pra quem curte cultura, música e uma boa fumaça.
            Curadoria honesta, atendimento direto pelo WhatsApp e os melhores produtos do mercado.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon, title, value, sub, cta, onClick }) {
  return (
    <div className="r-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 99, background: 'var(--bg-elev-2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1 }}>{sub}</div>}
      </div>
      {cta && (
        <button onClick={onClick} style={{
          background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '7px 12px',
          borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>{cta}</button>
      )}
    </div>
  );
}
