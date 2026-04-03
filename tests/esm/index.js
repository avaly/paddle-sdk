import assert from 'assert';
import fetchMock from 'fetch-mock';
import { PaddleSDK } from 'paddle-sdk';

const SERVER = 'https://test.paddle.com';
const PATH = `${SERVER}/product/get_products`;

async function run() {
  fetchMock.mockGlobal().post(PATH, {
    status: 200,
    body: {
      success: true,
      response: {
        total: 2,
        count: 2,
        products: [
          {
            id: 10000,
            name: 'A Product',
            description: 'A description of the product.',
            base_price: 58,
            sale_price: null,
            screenshots: [],
            icon: 'https://paddle-static.s3.amazonaws.com/email/2013-04-10/og.png',
          },
          {
            id: 20000,
            name: 'Another Product',
            description: null,
            base_price: 39.99,
            sale_price: null,
            screenshots: [],
            icon: 'https://paddle.s3.amazonaws.com/user/91/489278geekbench.png',
          },
        ],
      },
    },
  });

  const paddle = new PaddleSDK('test-id', 'test-key', '', {
    server: SERVER,
  });

  const products = await paddle.getProducts();

  assert.strictEqual(typeof products, 'object');
  assert.strictEqual(products.count, 2);
  assert.strictEqual(products.products.length, 2);
  assert.strictEqual(products.products[0].id, 10000);
  assert.strictEqual(products.products[1].id, 20000);

  const call = fetchMock.callHistory.lastCall(PATH, {
    method: 'POST',
  });
  const headers = new Headers(call.options.headers);

  assert.match(headers.get('user-agent'), /paddle-sdk\/\d+/);
  assert.strictEqual(headers.get('content-type'), 'application/x-www-form-urlencoded');
  assert.deepStrictEqual(Object.fromEntries(new URLSearchParams(call.options.body).entries()), {
    vendor_id: 'test-id',
    vendor_auth_code: 'test-key',
  });

  fetchMock.hardReset();
}

await run();

console.log('OK');
