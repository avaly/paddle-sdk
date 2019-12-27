const PaddleSDK = require('../sdk');
const DEFAULT_ERROR = require('../utils/error');
const nock = require('../utils/nock');

describe('coupons methods', () => {
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

	describe('getProductCoupons', () => {
		const path = '/product/list_coupons';

		const productID = '12345';
		const expectedBody = Object.assign(
			{
				product_id: productID,
			},
			EXPECTED_BODY
		);

		it('resolves on successfull request', () => {
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

			const scope = nock()
				.post(path, expectedBody)
				.reply(200, body);

			return instance.getProductCoupons(productID).then(response => {
				expect(response).toEqual(body.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance.getProductCoupons(productID).catch(err => {
				expect(err.response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});
});
