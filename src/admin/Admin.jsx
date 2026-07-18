// admin/Admin.jsx — painel admin (Supabase Auth + Storage)

import { useState, useEffect, useCallback } from 'react';
import { CATEGORIES, ADMIN_CATEGORIES, formatBRL } from '../data.js';
import { Icon } from '../components/Icons.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { supabase } from '../lib/supabase.js';
import { useIsMobile } from '../hooks/useIsMobile.js';
import {
  useProducts, useProductsLoading, upsertProduct, deleteProduct, newProductId,
} from '../store/products.js';

// ─── Painel principal ─────────────────────────────────────────────────────
export function AdminApp() {
  const products = useProducts();
  const loading  = useProductsLoading();
  const isMobile = useIsMobile();
  const [editing, setEditing]     = useState(null);
  const [filter, setFilter]       = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [opError, setOpError]     = useState(null);
  const [toast, setToast]         = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const items = products.filter(p => {
    if (catFilter !== 'all' && p.cat !== catFilter) return false;
    if (filter && !p.name.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:       products.length,
    promo:       products.filter(p => p.oldPrice).length,
    novos:       products.filter(p => (p.tags || []).includes('novo')).length,
    bestsellers: products.filter(p => p.bestseller).length,
  };

  const handleDelete = async (p) => {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    try {
      setOpError(null);
      await deleteProduct(p.id);
      showToast(`"${p.name}" excluído.`);
    } catch (err) {
      setOpError(`Erro ao excluir: ${err.message}`);
      showToast(`Erro ao excluir: ${err.message}`, 'error');
    }
  };

const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (editing) {
    return (
      <>
        <AdminForm
          product={editing === 'new' ? null : editing}
          isMobile={isMobile}
          onSave={(isNew) => { setEditing(null); showToast(isNew ? 'Produto cadastrado com sucesso!' : 'Produto atualizado com sucesso!'); }}
          onCancel={() => setEditing(null)}
          onError={(msg) => showToast(msg, 'error')}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className="roots-app" style={{ minHeight: '100dvh' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'var(--bg)', borderBottom: '1px solid var(--line)',
      }}>
        <div className="rasta-stripe"/>
        <div style={{
          padding: isMobile ? '14px 16px' : '16px 28px', display: 'flex', alignItems: 'center',
          gap: isMobile ? 10 : 18, justifyContent: 'space-between', maxWidth: 1440, margin: '0 auto',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-roots-mark.png" alt="" style={{ width: 38, height: 38 }}/>
            <div>
              <div className="display" style={{ fontSize: 14, letterSpacing: '0.06em' }}>ROOTS · ADMIN</div>
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>
                Catálogo · {stats.total} produtos
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#" style={{ fontSize: 11.5, color: 'var(--ink-dim)', textDecoration: 'none', padding: '8px 12px' }}>
              ← Voltar à loja
            </a>
            <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 11 }}>
              Sair
            </button>
            <button
              onClick={() => setEditing('new')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', fontSize: 12 }}
            >
              <Icon.plus size={14}/> Novo produto
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding: isMobile ? '18px 14px' : '24px 28px', maxWidth: 1440, margin: '0 auto' }}>
        {opError && (
          <div style={{
            background: 'rgba(180,40,40,0.1)', border: '1px solid var(--rasta-red)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            fontSize: 13, color: 'var(--rasta-red)', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            {opError}
            <button onClick={() => setOpError(null)} style={{
              background: 'transparent', border: 'none', color: 'inherit',
              cursor: 'pointer', fontSize: 16, lineHeight: 1,
            }}>×</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
          <Stat label="Total"        value={stats.total}       color="var(--accent)"/>
          <Stat label="Em promoção"  value={stats.promo}       color="var(--rasta-red)"/>
          <Stat label="Novidades"    value={stats.novos}       color="var(--rasta-gold)"/>
          <Stat label="Best sellers" value={stats.bestsellers} color="var(--rasta-green)"/>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, marginBottom: 18, alignItems: isMobile ? 'stretch' : 'center' }}>
          <input
            className="r-input" placeholder="Buscar produto..."
            value={filter} onChange={e => setFilter(e.target.value)}
            style={{ flex: 1, fontSize: isMobile ? 16 : 13 }}
          />
          <select
            className="r-input" value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            style={{ width: isMobile ? '100%' : 'auto', fontSize: isMobile ? 16 : 13 }}
          >
            <option value="all">Todas categorias</option>
            {ADMIN_CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="r-card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-mute)', fontSize: 13 }}>
            Carregando produtos...
          </div>
        ) : isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(p => (
              <div key={p.id} className="r-card" style={{ padding: 12, display: 'flex', gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <ProductImage product={p} size="sm"/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>
                        {p.brand} · {CATEGORIES.find(c => c.id === p.cat)?.label || p.cat}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700 }}>{formatBRL(p.price)}</div>
                      {p.oldPrice && (
                        <div style={{ fontSize: 10, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                          {formatBRL(p.oldPrice)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 8 }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(p.tags || []).map(t => (
                        <span key={t} className={`tag tag-${t === 'top' ? 'top' : t === 'novo' ? 'novo' : t === 'import' ? 'import' : 'promo'}`}>
                          {t}
                        </span>
                      ))}
                      {p.bestseller && <span className="tag tag-top">TOP</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => setEditing(p)}
                        style={{
                          background: 'transparent', border: '1px solid var(--line)',
                          color: 'var(--ink)', padding: '6px 12px', borderRadius: 6,
                          fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        style={{
                          background: 'transparent', border: '1px solid var(--line)',
                          color: 'var(--rasta-red)', padding: '6px 8px',
                          borderRadius: 6, cursor: 'pointer',
                        }}
                      >
                        <Icon.trash size={12}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="r-card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-mute)' }}>
                Nenhum produto.{' '}
                <button
                  onClick={() => setEditing('new')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cadastrar o primeiro
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="r-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{
                    background: 'var(--bg-elev-2)', textAlign: 'left',
                    fontSize: 10.5, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--ink-mute)',
                  }}>
                    <th style={{ padding: '12px 14px', width: 70 }}>Foto</th>
                    <th style={{ padding: '12px 14px' }}>Produto</th>
                    <th style={{ padding: '12px 14px' }}>Categoria</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Preço</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Tags</th>
                    <th style={{ padding: '12px 14px', width: 110, textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--line)' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ width: 46, height: 46, borderRadius: 6, overflow: 'hidden' }}>
                          <ProductImage product={p} size="sm"/>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{p.brand}</div>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--ink-dim)' }}>
                        {CATEGORIES.find(c => c.id === p.cat)?.label || p.cat}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>{formatBRL(p.price)}</div>
                        {p.oldPrice && (
                          <div style={{ fontSize: 10, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                            {formatBRL(p.oldPrice)}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                          {(p.tags || []).map(t => (
                            <span key={t} className={`tag tag-${t === 'top' ? 'top' : t === 'novo' ? 'novo' : t === 'import' ? 'import' : 'promo'}`}>
                              {t}
                            </span>
                          ))}
                          {p.bestseller && <span className="tag tag-top">TOP</span>}
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setEditing(p)}
                          style={{
                            background: 'transparent', border: '1px solid var(--line)',
                            color: 'var(--ink)', padding: '5px 10px', borderRadius: 6,
                            fontSize: 11, fontWeight: 600, cursor: 'pointer', marginRight: 6,
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          style={{
                            background: 'transparent', border: '1px solid var(--line)',
                            color: 'var(--rasta-red)', padding: '5px 8px',
                            borderRadius: 6, cursor: 'pointer',
                          }}
                        >
                          <Icon.trash size={12}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-mute)' }}>
                        Nenhum produto.{' '}
                        <button
                          onClick={() => setEditing('new')}
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}
                        >
                          Cadastrar o primeiro
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{
          marginTop: 18, padding: 14, borderRadius: 10,
          background: 'var(--bg-elev-2)', fontSize: 11.5, color: 'var(--ink-dim)',
          display: 'flex', gap: 10,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 99, background: 'var(--rasta-green)',
            color: '#0a2010', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 11, flexShrink: 0,
          }}>✓</div>
           </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}


// ─── Stat card ────────────────────────────────────────────────────────────
function Stat({ label, value, color }) {
  return (
    <div className="r-card" style={{ padding: 16 }}>
      <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div className="display-tight" style={{ fontSize: 34, color, marginTop: 6, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

// ─── Validação do formulário ──────────────────────────────────────────────
function validateForm(form) {
  const errors = {};

  const name = (form.name || '').trim();
  if (!name)             errors.name = 'Obrigatório.';
  else if (name.length < 3)   errors.name = 'Mínimo 3 caracteres.';
  else if (name.length > 100) errors.name = 'Máximo 100 caracteres.';

  const price = Number(form.price);
  if (!form.price && form.price !== 0) errors.price = 'Obrigatório.';
  else if (isNaN(price) || price <= 0) errors.price = 'Deve ser maior que zero.';
  else if (price > 99999)              errors.price = 'Valor máximo: R$ 99.999.';

  if (form.oldPrice !== null && form.oldPrice !== '') {
    const old = Number(form.oldPrice);
    if (isNaN(old) || old <= 0) errors.oldPrice = 'Valor inválido.';
    else if (old <= price)      errors.oldPrice = 'Deve ser maior que o preço atual.';
  }

  if (form.brand && form.brand.length > 60)  errors.brand = 'Máximo 60 caracteres.';
  if (form.desc  && form.desc.length  > 500) errors.desc  = 'Máximo 500 caracteres.';

  return errors;
}

// ─── Formulário de produto ────────────────────────────────────────────────
function AdminForm({ product, isMobile, onSave, onCancel, onError }) {
  const isNew = !product;
  const [form, setForm] = useState(product || {
    id: newProductId(),
    name: '', cat: 'narguile', brand: '', price: 0, oldPrice: null,
    desc: '', variations: [], tags: [], photo: null, photos: [],
    rating: 5.0, ratings: 0, bestseller: false,
  });
  const [newVar, setNewVar]         = useState('');
  const [uploading, setUploading]   = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [saveError, setSaveError]   = useState(null);
  const [saving, setSaving]         = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const upd = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (fieldErrors[k]) setFieldErrors(fe => ({ ...fe, [k]: null }));
  };

  // Upload de fotos para Supabase Storage (suporta múltiplos arquivos)
  const onPhoto = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPhotoError(null);

    const MAX = 6;
    const currentCount = form.photos?.length || 0;
    const toUpload = files.slice(0, MAX - currentCount);
    if (!toUpload.length) return;

    setUploading(true);
    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('Imagem muito grande. Máximo 5MB por foto.');
        continue;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setPhotoError('Formato inválido. Use JPG, PNG ou WEBP.');
        continue;
      }

      const ext  = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setPhotoError(`Erro no upload: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path);
      setForm(f => {
        const updated = [...(f.photos || []), publicUrl];
        return { ...f, photos: updated, photo: updated[0] };
      });
    }

    e.target.value = '';
    setUploading(false);
  };

  const addVar = () => {
    if (!newVar.trim()) return;
    upd('variations', [...form.variations, newVar.trim()]);
    setNewVar('');
  };
  const removeVar = (v) => upd('variations', form.variations.filter(x => x !== v));

  const toggleTag = (t) => {
    if (form.tags.includes(t)) upd('tags', form.tags.filter(x => x !== t));
    else upd('tags', [...form.tags, t]);
  };

  const save = async () => {
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSaveError('Corrija os campos em vermelho antes de salvar.');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setFieldErrors({});
    try {
      await upsertProduct({
        ...form,
        name:     form.name.trim(),
        brand:    form.brand.trim(),
        price:    Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      });
      onSave(isNew);
    } catch (err) {
      const msg = `Erro ao salvar: ${err.message}`;
      setSaveError(msg);
      onError?.(msg);
      setSaving(false);
    }
  };

  return (
    <div className="roots-app" style={{ minHeight: '100dvh' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'var(--bg)', borderBottom: '1px solid var(--line)',
        padding: isMobile ? '14px 16px' : '16px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onCancel}
            style={{
              width: 38, height: 38, borderRadius: 999, border: '1px solid var(--line)',
              background: 'var(--bg-elev)', color: 'var(--ink)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon.back size={16}/>
          </button>
          <div>
            <div className="display" style={{ fontSize: 14, letterSpacing: '0.06em' }}>
              {isNew ? 'NOVO PRODUTO' : 'EDITAR PRODUTO'}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>
              {isNew ? 'Cadastro' : form.name}
            </div>
          </div>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {saving && <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>Salvando...</span>}
            <button onClick={onCancel} className="btn-ghost" style={{ fontSize: 12 }}>Cancelar</button>
            <button onClick={save} className="btn-primary" disabled={saving} style={{ padding: '10px 18px', fontSize: 12 }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        )}
      </header>

      <div style={{
        padding: isMobile ? '18px 16px' : '28px',
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
        gap: isMobile ? 22 : 28, maxWidth: 1100, margin: '0 auto',
        paddingBottom: isMobile ? 88 : undefined,
      }}>
        <div>
          <FieldLabel>Fotos do produto</FieldLabel>
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>
            {(form.photos || []).length === 0
              ? 'Nenhuma foto. A primeira adicionada será a capa.'
              : `${(form.photos || []).length}/6 foto(s) · A primeira é a capa`}
          </div>

          {photoError && (
            <div style={{
              marginTop: 8, padding: '8px 12px', borderRadius: 6,
              background: 'rgba(180,40,40,0.1)', border: '1px solid var(--rasta-red)',
              fontSize: 12, color: 'var(--rasta-red)',
            }}>
              {photoError}
            </div>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8, marginTop: 10,
          }}>
            {(form.photos || []).map((url, i) => (
              <div key={`${url}-${i}`} style={{
                position: 'relative', aspectRatio: '1', borderRadius: 8,
                overflow: 'hidden', border: '2px solid var(--line)',
              }}>
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: 4, left: 4,
                    background: 'var(--rasta-green)', borderRadius: 4,
                    padding: '2px 6px', fontSize: 9, fontWeight: 700,
                    color: '#fff', letterSpacing: '0.1em',
                  }}>CAPA</div>
                )}
                <button
                  onClick={() => {
                    const updated = (form.photos || []).filter((_, j) => j !== i);
                    setForm(f => ({ ...f, photos: updated, photo: updated[0] || null }));
                  }}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                    width: 24, height: 24, borderRadius: 99, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon.close size={12}/>
                </button>
              </div>
            ))}

            {(form.photos || []).length < 6 && (
              <>
                <label style={{
                  aspectRatio: '1', borderRadius: 8, border: '2px dashed var(--line-strong)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: uploading ? 'wait' : 'pointer',
                  background: 'var(--bg-elev)', color: 'var(--ink-mute)', gap: 6,
                  position: 'relative',
                }}>
                  {uploading ? (
                    <div style={{
                      width: 24, height: 24, border: '2px solid var(--accent)',
                      borderTopColor: 'transparent', borderRadius: 99,
                      animation: 'spin 0.8s linear infinite',
                    }}/>
                  ) : (
                    <>
                      <Icon.plus size={22}/>
                      <div style={{ fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
                        {(form.photos || []).length === 0 ? 'Adicionar foto' : 'Mais fotos'}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>JPG, PNG, WEBP · 5MB</div>
                    </>
                  )}
                  <input
                    type="file" accept="image/jpeg,image/png,image/webp"
                    multiple onChange={onPhoto} disabled={uploading}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploading ? 'wait' : 'pointer' }}
                  />
                </label>

                <label style={{
                  aspectRatio: '1', borderRadius: 8, border: '2px dashed var(--line-strong)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: uploading ? 'wait' : 'pointer',
                  background: 'var(--bg-elev)', color: 'var(--ink-mute)', gap: 6,
                  position: 'relative',
                }}>
                  {uploading ? (
                    <div style={{
                      width: 24, height: 24, border: '2px solid var(--accent)',
                      borderTopColor: 'transparent', borderRadius: 99,
                      animation: 'spin 0.8s linear infinite',
                    }}/>
                  ) : (
                    <>
                      <Icon.camera size={22}/>
                      <div style={{ fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
                        Tirar foto
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>Usar câmera</div>
                    </>
                  )}
                  <input
                    type="file" accept="image/*" capture="environment"
                    onChange={onPhoto} disabled={uploading}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploading ? 'wait' : 'pointer' }}
                  />
                </label>
              </>
            )}
          </div>

          <div style={{ marginTop: 18 }}>
            <FieldLabel>Preview do card</FieldLabel>
            <div style={{ marginTop: 8 }}>
              <ProductCard product={form} onTap={() => {}}/>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {saveError && (
            <div style={{
              padding: '10px 14px', borderRadius: 8,
              background: 'rgba(180,40,40,0.1)', border: '1px solid var(--rasta-red)',
              fontSize: 13, color: 'var(--rasta-red)',
            }}>
              {saveError}
            </div>
          )}

          <Field label="Nome do produto" required error={fieldErrors.name}>
            <input className="r-input" value={form.name}
              onChange={e => upd('name', e.target.value)}
              placeholder="Ex: Essência Zomo Mint Storm"
              maxLength={100}/>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            <Field label="Marca / Fabricante" error={fieldErrors.brand}>
              <input className="r-input" value={form.brand}
                onChange={e => upd('brand', e.target.value)}
                placeholder="Ex: Zomo"
                maxLength={60}/>
            </Field>
            <Field label="Categoria" required>
              <select className="r-input" value={form.cat}
                onChange={e => upd('cat', e.target.value)} style={{ cursor: 'pointer' }}>
                {ADMIN_CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            <Field label="Preço (R$)" required error={fieldErrors.price}>
              <input className="r-input" type="number" step="0.01" min="0.01" max="99999"
                value={form.price} onChange={e => upd('price', e.target.value)} placeholder="0,00"/>
            </Field>
            <Field label="Preço de antes (promoção)" error={fieldErrors.oldPrice}>
              <input className="r-input" type="number" step="0.01" min="0.01" max="99999"
                value={form.oldPrice || ''} onChange={e => upd('oldPrice', e.target.value)} placeholder="opcional"/>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            <Field label="Avaliação (0 – 5)">
              <input className="r-input" type="number" step="0.1" min="0" max="5"
                value={form.rating ?? ''} onChange={e => upd('rating', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="Ex: 4.8"/>
            </Field>
            <Field label="Nº de avaliações">
              <input className="r-input" type="number" step="1" min="0"
                value={form.ratings ?? ''} onChange={e => upd('ratings', e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="Ex: 142"/>
            </Field>
          </div>

          <Field label="Descrição" error={fieldErrors.desc}>
            <textarea className="r-input" rows="3" value={form.desc}
              onChange={e => upd('desc', e.target.value)}
              placeholder="Fale sobre o produto, sabor, características..."
              maxLength={500}
              style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}/>
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 4, textAlign: 'right' }}>
              {(form.desc || '').length}/500
            </div>
          </Field>

          <Field label="Variações (tamanho, sabor, cor)">
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="r-input" value={newVar} onChange={e => setNewVar(e.target.value)}
                placeholder="Ex: 50g, Mentol, Preto..."
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVar(); }}}/>
              <button onClick={addVar} className="btn-ghost" style={{ flexShrink: 0, fontSize: 12 }}>
                Adicionar
              </button>
            </div>
            {form.variations.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {form.variations.map(v => (
                  <span key={v} className="chip active"
                    style={{ paddingRight: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {v}
                    <button onClick={() => removeVar(v)}
                      style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <Icon.close size={12}/>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Tags / destaques">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {[
                { id: 'novo',   label: 'Novidade'   },
                { id: 'top',    label: 'Top vendido' },
                { id: 'import', label: 'Importado'   },
              ].map(t => (
                <button key={t.id} className={`chip ${form.tags.includes(t.id) ? 'active' : ''}`}
                  onClick={() => toggleTag(t.id)}>
                  {t.label}
                </button>
              ))}
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-dim)', marginLeft: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!form.bestseller}
                  onChange={e => upd('bestseller', e.target.checked)}
                  style={{ accentColor: 'var(--accent)' }}/>
                Marcar como best-seller
              </label>
            </div>
          </Field>
        </div>
      </div>

      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
          display: 'flex', gap: 10, alignItems: 'center',
          padding: '12px 16px', background: 'var(--bg)', borderTop: '1px solid var(--line)',
        }}>
          {saving && <span style={{ fontSize: 11, color: 'var(--ink-mute)', flexShrink: 0 }}>Salvando...</span>}
          <button onClick={onCancel} className="btn-ghost" style={{ fontSize: 13, flex: 1 }}>Cancelar</button>
          <button onClick={save} className="btn-primary" disabled={saving} style={{ padding: '12px 18px', fontSize: 13, flex: 2 }}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <FieldLabel>
        {label}
        {required && <span style={{ color: 'var(--rasta-red)', marginLeft: 4 }}>*</span>}
      </FieldLabel>
      <div style={{ marginTop: 8 }}>{children}</div>
      {error && (
        <div style={{ fontSize: 11, color: 'var(--rasta-red)', marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize: 10.5, color: 'var(--ink-mute)',
      letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
    }}>
      {children}
    </div>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div onClick={onClose} style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '13px 18px', borderRadius: 10, cursor: 'pointer',
      background: isError ? '#3d1010' : '#0d3d1d',
      border: `1px solid ${isError ? 'var(--rasta-red)' : 'var(--rasta-green)'}`,
      color: '#fff', fontSize: 13, fontWeight: 500,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'toast-in 0.25s ease',
      maxWidth: 360,
    }}>
      <span style={{ fontSize: 16 }}>{isError ? '✕' : '✓'}</span>
      {toast.msg}
    </div>
  );
}

