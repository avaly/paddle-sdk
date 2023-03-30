import assert from 'assert';
import nock from 'nock';
import { PaddleSDK } from 'paddle-sdk';

const SERVER = 'http://test.paddle.com';

async function run() {
	// https://paddle.com/docs/api-list-products
	nock(SERVER, {
		reqheaders: {
			'user-agent': /paddle-sdk\/\d+/,
		},
	}).post('/product/get_products', {
		vendor_id: 'test-id',
		vendor_auth_code: 'test-key',
	}).reply(200, {
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
	});;

	const paddle = new PaddleSDK('test-id', 'test-key', '', {
		server: SERVER,
	});

	const products = await paddle.getProducts();

	assert.strictEqual(typeof products, 'object');
	assert.strictEqual(products.count, 2);
	assert.strictEqual(products.products.length, 2);
	assert.strictEqual(products.products[0].id, 10000);
	assert.strictEqual(products.products[1].id, 20000);

	nock.cleanAll();
}

await run();

console.log('OK');
