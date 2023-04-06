import { PaddleSDK } from '../sdk';
import {
	DEFAULT_ERROR,
	EXPECTED_BODY,
	VENDOR_API_KEY,
	VENDOR_ID,
} from '../../utils/constants';
import nock, { SERVER } from '../../utils/nock';

describe('products methods', () => {
	let instance: PaddleSDK;

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
			server: SERVER,
		});
	});

	describe('getProducts', () => {
		const path = '/product/get_products';

		test('resolves on successful request', async () => {
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
							icon: 'https://paddle-static.s3.amazonaws.com/email/2013-04-10/og.png',
						},
						{
							id: 489278,
							name: 'Another Product',
							description: null,
							base_price: 39.99,
							sale_price: null,
							screenshots: [],
							icon: 'https://paddle.s3.amazonaws.com/user/91/489278geekbench.png',
						},
					],
				},
			};

			const scope = nock().post(path, EXPECTED_BODY).reply(200, body);

			const response = await instance.getProducts();

			expect(response).toEqual(body.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error response', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(400, DEFAULT_ERROR);

			await expect(instance.getProducts()).rejects.toThrow(
				'Request failed with status code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on 200 response with error', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(200, DEFAULT_ERROR);

			await expect(instance.getProducts()).rejects.toThrow(
				'Request https://test.paddle.com/product/get_products returned an error!'
			);

			expect(scope.isDone()).toBeTruthy();
		});
	});
});
