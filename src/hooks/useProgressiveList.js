// hooks/useProgressiveList.js — renderização progressiva de listas grandes
//
// O catálogo tem ~200 cards. Montar tudo de uma vez trava a animação de troca
// de tela (React comita milhares de nós e o browser rasteriza um container
// enorme no mesmo frame). Aqui só os primeiros `initial` itens entram junto
// com a tela; o resto vai chegando em lotes, depois que a transição terminou
// e sempre em momentos ociosos do browser.

import { useEffect, useState, startTransition } from 'react';

const idle = (cb, timeout) =>
  'requestIdleCallback' in window
    ? { cancel: (id => () => cancelIdleCallback(id))(requestIdleCallback(cb, { timeout })) }
    : { cancel: (id => () => clearTimeout(id))(setTimeout(cb, 40)) };

export function useProgressiveList(items, { initial = 24, step = 30, startAfter = 500 } = {}) {
  const [count, setCount] = useState(initial);

  // lista mudou (filtro/busca/ordenação): recomeça do lote inicial
  useEffect(() => { setCount(initial); }, [items, initial]);

  useEffect(() => {
    if (count >= items.length) return;
    let handle;
    // startTransition: o React renderiza o lote em fatias de ~5ms e cede o thread
    // pra animação/scroll em vez de bloquear até terminar.
    const grow = () => { handle = idle(() => startTransition(() => setCount(c => Math.min(c + step, items.length))), 300); };
    // primeiro lote extra só depois da animação de entrada; os demais em cadeia
    const timer = setTimeout(grow, count === initial ? startAfter : 0);
    return () => { clearTimeout(timer); handle?.cancel(); };
  }, [count, items, initial, step, startAfter]);

  return count >= items.length ? items : items.slice(0, count);
}
