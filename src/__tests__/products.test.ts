import { PaddleSDK } from '../sdk.js';
import {
	DEFAULT_ERROR,
	EXPECTED_BODY,
	VENDOR_API_KEY,
	VENDOR_ID,
	SERVER,
} from '../../utils/constants.js';
import fetchMock from '@fetch-mock/jest';
import { expectFormPostBody } from '../../utils/fetchMock.js';

const PATH = `${SERVER}/product/get_products`;

describe('products methods', () => {
	let instance: PaddleSDK;

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
			server: SERVER,
		});
	});

	describe('getProducts', () => {
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

			fetchMock.post(PATH, { status: 200, body });

			const response = await instance.getProducts();

			expect(response).toEqual(body.response);
			expect(fetchMock).toBeDone();
			expect(fetchMock).toHavePosted(PATH);
			expectFormPostBody(PATH, EXPECTED_BODY);
		});

		test('rejects on error response', async () => {
			fetchMock.post(PATH, {
				status: 400,
				body: DEFAULT_ERROR,
			});

			await expect(instance.getProducts()).rejects.toThrow(
				'Request failed with status code 400'
			);

			expect(fetchMock).toBeDone();
			expect(fetchMock).toHavePosted(PATH);
			expectFormPostBody(PATH, EXPECTED_BODY);
		});

		test('rejects on 200 response with error', async () => {
			fetchMock.post(PATH, {
				status: 200,
				body: DEFAULT_ERROR,
			});

			await expect(instance.getProducts()).rejects.toThrow(
				'Request https://test.paddle.com/product/get_products returned an error!'
			);

			expect(fetchMock).toBeDone();
			expect(fetchMock).toHavePosted(PATH);
			expectFormPostBody(PATH, EXPECTED_BODY);
		});

		test('200 error response includes error information', async () => {
			fetchMock.post(PATH, {
				status: 200,
				body: DEFAULT_ERROR,
			});

			await expect(instance.getProducts()).rejects.toMatchObject({
				paddleCode: DEFAULT_ERROR.error.code,
				paddleMessage: DEFAULT_ERROR.error.message,
			});

			expect(fetchMock).toBeDone();
			expect(fetchMock).toHavePosted(PATH);
			expectFormPostBody(PATH, EXPECTED_BODY);
		});
	});
});
