// desktop/Store.jsx

import { STORE_INFO } from '../data.js';
import { Icon } from '../components/Icons.jsx';

export function DesktopStore() {
  return (
    <div style={{ padding: '60px 36px 100px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center', marginBottom: 60 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--rasta-gold)', fontWeight: 700, letterSpacing: '0.3em', marginBottom: 14 }}>NOSSA LOJA</div>
          <h1 className="display-tight" style={{ fontSize: 72, lineHeight: 0.95, margin: 0 }}>
            UM PEDAÇO<br/>DA JAMAICA<br/><span style={{ color: 'var(--accent)' }}>NO RECIFE.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-dim)', lineHeight: 1.65, marginTop: 22, maxWidth: 460 }}>
            Desde 2017 no centro de Recife, a Roots virou ponto de encontro pra quem curte cultura, música e uma boa sessão.
            Nossa curadoria é honesta: só fica no estoque o que a gente mesmo usa.
          </p>
        </div>
        <div style={{
          height: 420, borderRadius: 16, overflow: 'hidden',
          background: 'var(--rasta-green-deep)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(45deg, transparent 0 16px, rgba(245,181,40,0.04) 16px 17px)',
          }}/>
          <img src="/assets/logo-roots.png" alt="" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, height: 300, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}/>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16 }}>
        <ContactRow icon={<Icon.pin />} title="Unidade 1" value="Av. Conde da Boa Vista, 247" sub="Boa Vista · Recife/PE · CEP 50060-002"/>
        <ContactRow icon={<Icon.pin />} title="Unidade 2" value="Rua do Hospício, 250" sub="Boa Vista · Recife/PE · CEP 50050-035"/>
        <ContactRow icon={<Icon.clock />} title="Horário" value="Seg-Sex 09–18:30h · Sáb 09–16h" sub="Dom - Fechado"/>
        <ContactRow icon={<Icon.whatsapp />} title="WhatsApp" value="(81) 99922-3444" cta="Chamar" onClick={() => window.open(`https://wa.me/${STORE_INFO.whatsapp}`, '_blank')}/>
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
