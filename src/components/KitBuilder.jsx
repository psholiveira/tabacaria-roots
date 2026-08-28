// components/KitBuilder.jsx — "Monte seu Kit": wizard que passa por todas as
// categorias, uma por vez. O cliente escolhe o que quiser e pula o resto.

import { useMemo, useState } from 'react';
import { CATEGORIES, CAT_COLORS, formatBRL } from '../data.js';
import { Icon } from './Icons.jsx';
import { ProductImage } from './ProductImage.jsx';
import { SkeletonGrid } from './SkeletonCard.jsx';
import { useProductsLoading } from '../store/products.js';

const keyOf = (product, variation) => `${product.id}|${variation || ''}`;

export function KitBuilder({ products, onFinish, onExit, mobile = false }) {
  const loading = useProductsLoading();

  // Só entram no fluxo as categorias que realmente têm produto.
  const steps = useMemo(() => (
    CATEGORIES
      .filter(c => c.id !== 'all')
      .map(c => ({ ...c, items: products.filter(p => p.cat === c.id) }))
      .filter(c => c.items.length > 0)
  ), [products]);

  const [step, setStep]       = useState(0);   // === steps.length → resumo
  const [picked, setPicked]   = useState({});  // key → { product, variation, qty }
  const [skipped, setSkipped] = useState([]);  // ids das categorias puladas

  const list  = Object.values(picked);
  const count = list.reduce((s, i) => s + i.qty, 0);
  const total = list.reduce((s, i) => s + i.qty * i.product.price, 0);

  const addItem = (product, variation) => setPicked(prev => {
    const k = keyOf(product, variation);
    return {
      ...prev,
      [k]: prev[k] ? { ...prev[k], qty: prev[k].qty + 1 } : { product, variation, qty: 1 },
    };
  });

  const setQty = (k, qty) => setPicked(prev => {
    if (qty <= 0) { const rest = { ...prev }; delete rest[k]; return rest; }
    return { ...prev, [k]: { ...prev[k], qty } };
  });

  const goTo = (i) => { setStep(i); window.scrollTo(0, 0); };
  const next = () => goTo(Math.min(step + 1, steps.length));
  const prev = () => goTo(Math.max(step - 1, 0));

  const skip = () => {
    const cur = steps[step];
    if (cur) setSkipped(s => (s.includes(cur.id) ? s : [...s, cur.id]));
    next();
  };

  const restart = () => { setPicked({}); setSkipped([]); goTo(0); };

  const pad  = mobile ? 16 : 36;
  const cols = mobile ? 2 : 4;

  if (loading) {
    return (
      <div style={{ padding: `4px ${pad}px 60px`, maxWidth: 1100, margin: '0 auto' }}>
        <KitHeader mobile={mobile} onExit={onExit} count={0} onSummary={null} />
        <SkeletonGrid count={cols * 2} columns={cols} gap={12} />
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div style={{ padding: `4px ${pad}px 60px`, maxWidth: 1100, margin: '0 auto' }}>
        <KitHeader mobile={mobile} onExit={onExit} count={0} onSummary={null} />
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-mute)', fontSize: 13 }}>
          Nenhum produto disponível no momento.
        </div>
      </div>
    );
  }

  const onSummaryStep = step >= steps.length;
  const cur = steps[step];

  return (
    <div style={{ padding: `4px ${pad}px 24px`, maxWidth: 1100, margin: '0 auto' }}>
      <KitHeader
        mobile={mobile}
        onExit={onExit}
        count={count}
        onSummary={!onSummaryStep && count > 0 ? () => goTo(steps.length) : null}
      />

      {onSummaryStep ? (
        <KitSummary
          list={list} total={total} count={count}
          skipped={skipped} steps={steps} mobile={mobile}
          setQty={setQty}
          onBack={prev}
          onRestart={restart}
          onGoTo={goTo}
          onFinish={() => onFinish(list)}
        />
      ) : (
        <>
          <Progress steps={steps} step={step} picked={picked} skipped={skipped} onGoTo={goTo} />

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, margin: '18px 0 14px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                Etapa {step + 1} de {steps.length}
              </div>
              <h2 className="display" style={{ fontSize: mobile ? 24 : 32, margin: '6px 0 0', letterSpacing: '0.01em' }}>
                {cur.label}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>
                {cur.items.length} {cur.items.length === 1 ? 'opção' : 'opções'} · escolha o que quiser ou pule
              </div>
            </div>
            <div style={{ height: 4, width: 70, borderRadius: 99, background: CAT_COLORS[cur.id] || 'var(--accent)' }}/>
          </div>

          <StepTopNav
            mobile={mobile}
            last={step === steps.length - 1}
            onPrev={step > 0 ? prev : null}
            onSkip={skip}
            onNext={next}
          />

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: '1fr', gap: mobile ? 10 : 16 }}>
            {cur.items.map(p => (
              <KitTile key={p.id} product={p} picked={picked} onAdd={addItem} setQty={setQty} />
            ))}
          </div>

          <StepFooter
            mobile={mobile}
            last={step === steps.length - 1}
            count={count}
            total={total}
            onPrev={step > 0 ? prev : null}
            onSkip={skip}
            onNext={next}
          />
        </>
      )}
    </div>
  );
}

// ─── Cabeçalho ────────────────────────────────────────────────────────────
function KitHeader({ mobile, onExit, count, onSummary }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0 14px' }}>
      <button onClick={onExit} aria-label="Sair do Monte seu Kit" style={{
        width: 36, height: 36, borderRadius: 999, border: '1px solid var(--line)',
        background: 'var(--bg-elev)', color: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
      }}><Icon.close size={16}/></button>

      <div className="display" style={{ flex: 1, textAlign: 'center', fontSize: mobile ? 15 : 17, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Monte seu kit
      </div>

      <div style={{ minWidth: 36, display: 'flex', justifyContent: 'flex-end' }}>
        {onSummary ? (
          <button onClick={onSummary} className="chip active" style={{ fontWeight: 700 }}>
            {count} {count === 1 ? 'item' : 'itens'}
          </button>
        ) : <div style={{ width: 36 }}/>}
      </div>
    </div>
  );
}

// ─── Barra de progresso (segmentos clicáveis) ─────────────────────────────
function Progress({ steps, step, picked, skipped, onGoTo }) {
  const chosenIn = (catId) => Object.values(picked).some(i => i.product.cat === catId);

  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {steps.map((s, i) => {
        const bg = i === step ? 'var(--accent)'
          : chosenIn(s.id) ? 'var(--rasta-green)'
          : skipped.includes(s.id) ? 'var(--line-strong)'
          : 'var(--line)';
        return (
          <button
            key={s.id}
            onClick={() => onGoTo(i)}
            title={s.label}
            aria-label={s.label}
            style={{
              flex: 1, height: 5, borderRadius: 99, border: 'none', padding: 0,
              background: bg, cursor: 'pointer', transition: 'background .18s ease',
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Card de produto do wizard ────────────────────────────────────────────
function KitTile({ product, picked, onAdd, setQty }) {
  const variations = product.variations || [];
  const [variation, setVariation] = useState(variations[0] ?? '');
  const k = keyOf(product, variation);
  const qty = picked[k]?.qty || 0;

  return (
    <div className="r-card" style={{
      overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
      outline: qty > 0 ? '2px solid var(--accent)' : 'none', outlineOffset: -1,
    }}>
      <div className="r-img-wrap" style={{ position: 'relative', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}>
        <ProductImage product={product} size="sm" />
        {qty > 0 && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: 'var(--accent)', color: 'var(--accent-ink)',
            width: 24, height: 24, borderRadius: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800,
          }}>{qty}</span>
        )}
      </div>

      <div style={{ padding: '10px 11px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {product.brand && (
          <div style={{ fontSize: 9.5, color: 'var(--ink-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {product.brand}
          </div>
        )}
        <div style={{
          fontSize: 13, fontWeight: 600, lineHeight: 1.25, color: 'var(--ink)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32,
        }}>{product.name}</div>

        {variations.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
            {variations.map(v => (
              <button key={v} onClick={() => setVariation(v)} style={{
                padding: '2px 7px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                border: `1.5px solid ${variation === v ? 'var(--accent)' : 'var(--line-strong)'}`,
                background: variation === v ? 'var(--accent)' : 'transparent',
                color: variation === v ? 'var(--accent-ink)' : 'var(--ink-dim)',
                cursor: 'pointer', lineHeight: 1.6, flexShrink: 0,
              }}>{v}</button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 }}>
          <div>
            {product.oldPrice ? (
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                {formatBRL(product.oldPrice)}
              </div>
            ) : null}
            <div className="display" style={{ fontSize: 15, lineHeight: 1 }}>{formatBRL(product.price || 0)}</div>
          </div>

          {qty > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <StepBtn onClick={() => setQty(k, qty - 1)} label="Diminuir"><Icon.minus size={12}/></StepBtn>
              <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 12, textAlign: 'center' }}>{qty}</span>
              <StepBtn onClick={() => setQty(k, qty + 1)} label="Aumentar" filled><Icon.plus size={12}/></StepBtn>
            </div>
          ) : (
            <button onClick={() => onAdd(product, variation)} style={{
              height: 32, padding: '0 12px', borderRadius: 8, border: 'none',
              background: 'var(--accent)', color: 'var(--accent-ink)',
              fontSize: 11.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Icon.plus size={12}/> Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepBtn({ onClick, children, filled, label }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      width: 26, height: 26, borderRadius: 7,
      border: filled ? 'none' : '1px solid var(--line-strong)',
      background: filled ? 'var(--accent)' : 'transparent',
      color: filled ? 'var(--accent-ink)' : 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
    }}>{children}</button>
  );
}

// ─── Atalhos no topo do passo (mesmas ações do rodapé) ────────────────────
function StepTopNav({ mobile, last, onPrev, onSkip, onNext }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 14px' }}>
      {onPrev && (
        <button onClick={onPrev} className="btn-ghost" aria-label="Categoria anterior" style={{
          padding: '9px 12px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5,
        }}><Icon.back size={13}/>{mobile ? null : 'Voltar'}</button>
      )}
      <button onClick={onSkip} className="btn-ghost" style={{ flex: 1, padding: '9px 12px', fontSize: 12.5 }}>
        Pular
      </button>
      <button onClick={onNext} className="btn-primary" style={{
        flex: 1.4, padding: '9px 12px', fontSize: 12.5,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      }}>
        {last ? 'Ver meu kit' : 'Continuar'} <Icon.arrow size={14}/>
      </button>
    </div>
  );
}

// ─── Rodapé fixo do passo ─────────────────────────────────────────────────
function StepFooter({ mobile, last, count, total, onPrev, onSkip, onNext }) {
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 20, marginTop: 20,
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      background: 'linear-gradient(180deg, transparent, var(--bg) 26%)',
    }}>
      <div style={{ paddingTop: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        {onPrev && (
          <button onClick={onPrev} className="btn-ghost" aria-label="Categoria anterior" style={{
            padding: '12px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
          }}><Icon.back size={14}/>{mobile ? null : 'Voltar'}</button>
        )}
        <button onClick={onSkip} className="btn-ghost" style={{ flex: 1, padding: '12px 14px' }}>
          Pular
        </button>
        <button onClick={onNext} className="btn-primary" style={{
          flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {last ? 'Ver meu kit' : 'Continuar'} <Icon.arrow size={15}/>
        </button>
      </div>
      {count > 0 && (
        <div style={{ padding: '8px 2px 10px', fontSize: 11.5, color: 'var(--ink-mute)', textAlign: 'center' }}>
          {count} {count === 1 ? 'item no kit' : 'itens no kit'} · <span style={{ color: 'var(--ink-dim)', fontWeight: 600 }}>{formatBRL(total)}</span>
        </div>
      )}
    </div>
  );
}

// ─── Resumo final ─────────────────────────────────────────────────────────
function KitSummary({ list, total, count, skipped, steps, mobile, setQty, onBack, onRestart, onGoTo, onFinish }) {
  const skippedSteps = steps.filter(s => skipped.includes(s.id));

  return (
    <div>
      <div style={{ margin: '10px 0 18px' }}>
        <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          Último passo
        </div>
        <h2 className="display" style={{ fontSize: mobile ? 26 : 34, margin: '6px 0 0' }}>Seu kit</h2>
        <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 5 }}>
          {count === 0
            ? 'Você ainda não escolheu nenhum item.'
            : `${count} ${count === 1 ? 'item selecionado' : 'itens selecionados'}`}
        </div>
      </div>

      {list.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.map(({ product, variation, qty }) => {
            const k = keyOf(product, variation);
            return (
              <div key={k} className="r-card" style={{ display: 'flex', gap: 12, padding: 10, alignItems: 'center' }}>
                <div style={{ width: 62, height: 62, flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
                  <ProductImage product={product} size="sm" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{product.name}</div>
                  {variation && <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{variation}</div>}
                  <div className="display" style={{ fontSize: 14, marginTop: 4 }}>{formatBRL(qty * product.price)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <StepBtn onClick={() => setQty(k, qty - 1)} label="Diminuir"><Icon.minus size={12}/></StepBtn>
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 14, textAlign: 'center' }}>{qty}</span>
                  <StepBtn onClick={() => setQty(k, qty + 1)} label="Aumentar" filled><Icon.plus size={12}/></StepBtn>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="r-card" style={{ padding: 28, textAlign: 'center', color: 'var(--ink-mute)', fontSize: 13 }}>
          Nenhum item no kit ainda.<br/>
          <button onClick={onRestart} style={{
            marginTop: 12, background: 'transparent', border: 'none',
            color: 'var(--accent)', fontWeight: 600, cursor: 'pointer',
          }}>Recomeçar o kit</button>
        </div>
      )}

      {skippedSteps.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>
            Categorias que você pulou
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skippedSteps.map(s => (
              <button key={s.id} className="chip" onClick={() => onGoTo(steps.findIndex(x => x.id === s.id))}>
                {s.label} <Icon.arrow size={12}/>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{
        position: 'sticky', bottom: 0, marginTop: 24,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        background: 'linear-gradient(180deg, transparent, var(--bg) 26%)',
      }}>
        <div style={{ paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Total do kit</div>
          <div className="display" style={{ fontSize: 22 }}>{formatBRL(total)}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 10 }}>
          <button onClick={onBack} className="btn-ghost" aria-label="Voltar" style={{
            flexShrink: 0, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6,
          }}><Icon.back size={14}/>{mobile ? null : 'Voltar'}</button>
          <button
            onClick={onFinish}
            disabled={list.length === 0}
            className="btn-primary"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: list.length === 0 ? 0.45 : 1,
              cursor: list.length === 0 ? 'not-allowed' : 'pointer',
            }}>
            <Icon.cart size={16}/> Adicionar kit à sacola
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CTA de entrada (usado no catálogo) ───────────────────────────────────
export function KitBuilderCTA({ onStart, mobile = false, products = [] }) {
  // Prévia real do que vem pela frente — só categorias com produto em estoque.
  const cats    = CATEGORIES.filter(c => c.id !== 'all' && products.some(p => p.cat === c.id));
  const preview = cats.slice(0, 3).map(c => c.label);
  const rest    = cats.length - preview.length;

  return (
    <button onClick={onStart} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      border: '1px solid var(--line)', borderRadius: 14,
      background: 'linear-gradient(120deg, #083015 0%, #123c1f 52%, #1f6b35 100%)',
      padding: mobile ? '15px 16px 15px 20px' : '20px 22px 20px 26px',
      display: 'flex', flexDirection: mobile ? 'column' : 'row',
      alignItems: mobile ? 'stretch' : 'center', gap: mobile ? 13 : 18,
      position: 'relative', overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* brilho dourado */}
      <div style={{
        position: 'absolute', top: -40, right: -30, width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, #f5b528 0%, transparent 68%)', opacity: 0.3,
      }}/>
      {/* faixa rasta na lateral */}
      <div className="rasta-stripe-vert" style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}/>

      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div className="display-tight" style={{ fontSize: mobile ? 30 : 36, color: '#fff', lineHeight: 0.94 }}>
          MONTE SEU <span style={{ color: '#f5b528' }}>KIT</span>
        </div>

        <div style={{ fontSize: mobile ? 12.5 : 13.5, color: 'rgba(255,255,255,0.78)', marginTop: 7, lineHeight: 1.4, maxWidth: 400 }}>
          Escolha seus produtos, para dar aquela relaxada...
          <Icon.leaf size={mobile ? 15 : 16} style={{ color: '#f5b528', marginLeft: 6, verticalAlign: '-3px' }}/>
        </div>

        {cats.length > 0 && (
          <div style={{
            fontSize: 10.5, color: 'rgba(245,181,40,0.85)', marginTop: 9,
            letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {preview.join(' · ')}{rest > 0 ? ` · +${rest} ${rest === 1 ? 'categoria' : 'categorias'}` : ''}
          </div>
        )}
      </div>

      <span style={{
        position: 'relative', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: '#f5b528', color: '#1a1408',
        padding: mobile ? '11px 16px' : '13px 20px', borderRadius: 999,
        fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase',
      }}>
        Começar <Icon.arrow size={16}/>
      </span>
    </button>
  );
}
