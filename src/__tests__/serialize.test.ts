import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import serialize from '../serialize.ts';

describe('serialize', () => {
  test('serializes primitive values', () => {
    assert.strictEqual(serialize(true), 'b:1;');
    assert.strictEqual(serialize(false), 'b:0;');
    assert.strictEqual(serialize(42), 'i:42;');
    assert.strictEqual(serialize(3.14), 'd:3.14;');
    assert.strictEqual(serialize('Paddle'), 's:6:"Paddle";');
    assert.strictEqual(serialize(null), 'N;');
    assert.strictEqual(serialize(undefined), 'N;');
  });

  test('uses utf-8 byte length for strings', () => {
    assert.strictEqual(serialize('€'), 's:3:"€";');
    assert.strictEqual(serialize('你好'), 's:6:"你好";');
  });

  test('serializes arrays with indexed keys', () => {
    assert.strictEqual(
      serialize(['Kevin', 'van', 'Zonneveld']),
      'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}',
    );
  });

  test('serializes nested objects and arrays', () => {
    const value = {
      customer: 'Ada',
      items: [1, 2],
      meta: {
        active: true,
      },
    };

    assert.strictEqual(
      serialize(value),
      'a:3:{s:8:"customer";s:3:"Ada";s:5:"items";a:2:{i:0;i:1;i:1;i:2;}s:4:"meta";a:1:{s:6:"active";b:1;}}',
    );
  });

  test('skips function values when serializing collections', () => {
    const value = {
      name: 'Checkout',
      handler: () => 'ignored',
      steps: [1, 2],
    };

    assert.strictEqual(
      serialize(value),
      'a:2:{s:4:"name";s:8:"Checkout";s:5:"steps";a:2:{i:0;i:1;i:1;i:2;}}',
    );
    assert.strictEqual(
      serialize(() => 'ignored'),
      ';',
    );
  });

  test('serializes numeric object keys as integers', () => {
    assert.strictEqual(
      serialize({
        0: 'zero',
        2: 'two',
      }),
      'a:2:{i:0;s:4:"zero";i:2;s:3:"two";}',
    );
  });

  test('ignores inherited properties', () => {
    const base = {
      inherited: 'skip me',
    };
    const value = Object.create(base) as {
      own: string;
      inherited?: string;
    };
    value.own = 'keep me';

    assert.strictEqual(serialize(value), 'a:1:{s:3:"own";s:7:"keep me";}');
  });
});
