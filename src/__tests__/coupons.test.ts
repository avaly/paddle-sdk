import { PaddleSDK } from '../sdk';
import {
	DEFAULT_ERROR,
	EXPECTED_BODY,
	VENDOR_API_KEY,
	VENDOR_ID,
} from '../../utils/constants';
import nock, { SERVER } from '../../utils/nock';

describe('coupons methods', () => {
	let instance: PaddleSDK;

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
			server: SERVER,
		});
	});

	describe('getProductCoupons', () => {
		const path = '/product/list_coupons';

		const productID = 12345;
		const expectedBody = Object.assign(
			{
				product_id: productID,
			},
			EXPECTED_BODY
		);

		test('resolves on successful request', async () => {
			// https://paddle.com/docs/api-list-coupons
			const body = {
				success: true,
				response: [
					{
						id: 4227,
						coupon: '56604810a6990',
						description: '56604810a6dcd',
						discount_type: 'percentage',
						discount_amount: 0.5,
						discount_currency: 'USD',
						allowed_uses: 3,
						times_used: 2,
						expires: '2020-12-03 00:00:00',
						product_id: '16970',
					},
				],
			};

			const scope = nock().post(path, expectedBody).reply(200, body);

			const response = await instance.getProductCoupons(productID);

			expect(response).toEqual(body.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock().post(path, expectedBody).reply(400, DEFAULT_ERROR);

			await expect(instance.getProductCoupons(productID)).rejects.toThrow(
				'Request failed with status code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});
	});
});
