// node scripts/cart.test.mjs — carrinho do localStorage nunca dita preço nem traz produto oculto
import assert from 'node:assert';
import { resolveCartItems } from '../src/hooks/useCart.js';

const catalog = [{ id: 'a', name: 'Seda', price: 10 }, { id: 'b', name: 'Bong', price: 200 }];
const stored = [
  { key: 'a|', product: { id: 'a', name: 'Seda', price: 0.01 }, qty: 2 }, // preço adulterado
  { key: 'x|', product: { id: 'x', price: 1 }, qty: 1 },                  // sumiu / oculto
  { key: 'b|', product: { id: 'b' }, qty: -3 },                            // qtd inválida
  { key: 'b|g', product: { id: 'b' }, qty: 1e9 },                          // qtd absurda
  null,
];
const items = resolveCartItems(stored, catalog);
assert.deepEqual(items.map(i => [i.key, i.product.price, i.qty]), [['a|', 10, 2], ['b|g', 200, 99]]);
assert.deepEqual(resolveCartItems(stored, []), []);
console.log('cart ok');
