// lib/images.js — URLs otimizadas pro Supabase Storage (resize/compress on-the-fly)
//
// As fotos são enviadas no tamanho original (até 5MB) e o catálogo mostra ~190
// cards de uma vez. Em vez de baixar o original, pedimos ao endpoint de
// transformação do Storage uma versão na largura que o card realmente usa.
// URLs que não são do Storage (ou já são transformadas) passam direto.

const OBJECT_PREFIX = '/storage/v1/object/public/';
const RENDER_PREFIX = '/storage/v1/render/image/public/';

// Largura base (1x) por tamanho de ProductImage. O srcSet dobra pra telas retina.
export const IMG_WIDTHS = { sm: 320, md: 520, lg: 900 };

export function isStorageUrl(url) {
  return typeof url === 'string' && url.includes(OBJECT_PREFIX);
}

export function imgUrl(url, { width, quality = 75 } = {}) {
  if (!isStorageUrl(url) || !width) return url;
  const base = url.replace(OBJECT_PREFIX, RENDER_PREFIX);
  const sep  = base.includes('?') ? '&' : '?';
  return `${base}${sep}width=${width}&quality=${quality}&resize=contain`;
}

// { src, srcSet } prontos pra um <img>, com variante 2x pra retina.
export function imgSrcSet(url, size = 'sm') {
  const w = IMG_WIDTHS[size] || IMG_WIDTHS.sm;
  if (!isStorageUrl(url)) return { src: url, srcSet: undefined };
  return {
    src:    imgUrl(url, { width: w }),
    srcSet: `${imgUrl(url, { width: w })} 1x, ${imgUrl(url, { width: w * 2 })} 2x`,
  };
}

// Miniatura pequena pra efeitos (ex: foto voando até a sacola).
export function thumbUrl(url) {
  return imgUrl(url, { width: 160 });
}

// ─── Compressão no upload (admin) ─────────────────────────────────────────
// Reduz a foto no navegador antes de subir: máx. 1600px no maior lado, WebP.
// Foto de celular de 3–5MB vira ~150–300KB sem perda visível no catálogo.
// Se algo falhar (formato exótico, canvas sem suporte) devolve o arquivo original.
export async function compressImage(file, { maxSide = 1600, quality = 0.85 } = {}) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale  = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise(res => canvas.toBlob(res, 'image/webp', quality));
    if (!blob || blob.size >= file.size) return { blob: file, ext: file.name.split('.').pop() };
    return { blob, ext: 'webp' };
  } catch {
    return { blob: file, ext: file.name.split('.').pop() };
  }
}
