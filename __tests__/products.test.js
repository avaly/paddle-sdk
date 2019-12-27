const PaddleSDK = require('../sdk');
const DEFAULT_ERROR = require('../utils/error');
const nock = require('../utils/nock');

describe('products methods', () => {
	let instance;

	const VENDOR_ID = 'foo';
	const VENDOR_API_KEY = 'bar';

	const EXPECTED_BODY = {
		vendor_id: VENDOR_ID,
		vendor_auth_code: VENDOR_API_KEY,
	};

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, null, {
			server: nock.SERVER,
		});
	});

	describe('getProducts', () => {
		const path = '/product/get_products';

		it('resolves on successfull request', () => {
			// https://paddle.com/docs/api-list-products
			const body = {
				success: true,
				response: {
					total: 2,
					count: 2,
					products: [
						{
							id: 489171,
							name: 'A Product',
							description: 'A description of the product.',
							base_price: 58,
							sale_price: null,
							screenshots: [],
							icon:
								'https://paddle-static.s3.amazonaws.com/email/2013-04-10/og.png',
						},
						{
							id: 489278,
							name: 'Another Product',
							description: null,
							base_price: 39.99,
							sale_price: null,
							screenshots: [],
							icon:
								'https://paddle.s3.amazonaws.com/user/91/489278geekbench.png',
						},
					],
				},
			};

			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(200, body);

			return instance.getProducts().then(response => {
				expect(response).toEqual(body.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error response', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(400, DEFAULT_ERROR);

			return instance.getProducts().then(
				() => {
					expect('This promise should fail').toBeFalsy();
				},
				err => {
					expect(err.response.statusCode).toBe(400);
					expect(scope.isDone()).toBeTruthy();
				}
			);
		});

		it('rejects on 200 response with error', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(200, DEFAULT_ERROR);

			return instance.getProducts().then(
				() => {
					expect('This promise should fail').toBeFalsy();
				},
				err => {
					expect(err).toBeTruthy();
					expect(err.message).toContain(
						'Request http://test.paddle.com/product/get_products returned an error!'
					);
					expect(scope.isDone()).toBeTruthy();
				}
			);
		});
	});
});
