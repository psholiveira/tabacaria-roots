// node scripts/routes.test.mjs — URL ↔ tela precisa ir e voltar sem perder nada
import assert from 'node:assert';
import { pathFor, parsePath, slugify } from '../src/lib/routes.js';

assert.equal(slugify('Seda Zomo — Edição Açaí!'), 'seda-zomo-edicao-acai');
for (const [s, p] of [['home', {}], ['catalog', {}], ['catalog', { cat: 'sedas' }], ['store', {}], ['kit', {}], ['cart', {}], ['admin', {}]]) {
  const r = parsePath(pathFor(s, p));
  assert.equal(r.screen, s);
  assert.deepEqual(r.params, p);
}
assert.equal(parsePath(pathFor('product', {}, { id: 'p1x', name: 'Bong Vidro' })).productId, 'p1x');
assert.equal(parsePath('/produto/p1x').productId, 'p1x'); // link sem slug continua valendo
assert.equal(parsePath('/qualquer-coisa').screen, 'home');
console.log('routes ok');
