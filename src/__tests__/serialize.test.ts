import serialize from '../serialize.js';

describe('serialize', () => {
  test('serializes primitive values', () => {
    expect(serialize(true)).toBe('b:1;');
    expect(serialize(false)).toBe('b:0;');
    expect(serialize(42)).toBe('i:42;');
    expect(serialize(3.14)).toBe('d:3.14;');
    expect(serialize('Paddle')).toBe('s:6:"Paddle";');
    expect(serialize(null)).toBe('N;');
    expect(serialize(undefined)).toBe('N;');
  });

  test('uses utf-8 byte length for strings', () => {
    expect(serialize('€')).toBe('s:3:"€";');
    expect(serialize('你好')).toBe('s:6:"你好";');
  });

  test('serializes arrays with indexed keys', () => {
    expect(serialize(['Kevin', 'van', 'Zonneveld'])).toBe(
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

    expect(serialize(value)).toBe(
      'a:3:{s:8:"customer";s:3:"Ada";s:5:"items";a:2:{i:0;i:1;i:1;i:2;}s:4:"meta";a:1:{s:6:"active";b:1;}}',
    );
  });

  test('skips function values when serializing collections', () => {
    const value = {
      name: 'Checkout',
      handler: () => 'ignored',
      steps: [1, 2],
    };

    expect(serialize(value)).toBe(
      'a:2:{s:4:"name";s:8:"Checkout";s:5:"steps";a:2:{i:0;i:1;i:1;i:2;}}',
    );
    expect(serialize(() => 'ignored')).toBe(';');
  });

  test('serializes numeric object keys as integers', () => {
    expect(
      serialize({
        0: 'zero',
        2: 'two',
      }),
    ).toBe('a:2:{i:0;s:4:"zero";i:2;s:3:"two";}');
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

    expect(serialize(value)).toBe('a:1:{s:3:"own";s:7:"keep me";}');
  });
});
