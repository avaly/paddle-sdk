const PaddleSDK = require('../sdk');
const DEFAULT_ERROR = require('../utils/error');
const nock = require('../utils/nock');

describe('transactions methods', () => {
	let instance;

	const VENDOR_ID = 'foo';
	const VENDOR_API_KEY = 'bar';

	// https://developer.paddle.com/api-reference/b3A6MzA3NDQ3MjQ-list-transactions#request-parameters
	const RESPONSE = {
		success: true,
		response: [
			{
				order_id: '1042907-384786',
				checkout_id: '4795118-chre895f5cfaf61-4d7dafa9df',
				amount: '5.00',
				currency: 'USD',
				status: 'completed',
				created_at: '2017-01-22 00:38:43',
				passthrough: null,
				product_id: 12345,
				is_subscription: true,
				is_one_off: false,
				subscription: {
					subscription_id: 123456,
					status: 'active',
				},
				user: {
					user_id: 29777,
					email: 'example@paddle.com',
					marketing_consent: true,
				},
				receipt_url:
					'https://my.paddle.com/receipt/1042907-384786/4795118-chre895f5cfaf61-4d7dafa9df',
			},
			{
				order_id: '1042907-384785',
				checkout_id: '4795118-chre895f5cfaf61-4d7dafa9df',
				amount: '5.00',
				currency: 'USD',
				status: 'refunded',
				created_at: '2016-12-07 12:25:09',
				passthrough: null,
				product_id: 12345,
				is_subscription: true,
				is_one_off: true,
				subscription: {
					subscription_id: 123456,
					status: 'active',
				},
				user: {
					user_id: 29777,
					email: 'example@paddle.com',
					marketing_consent: true,
				},
				receipt_url:
					'https://my.paddle.com/receipt/1042907-384785/4795118-chre895f5cfaf61-4d7dafa9df',
			},
		],
	};
	const EXPECTED_BODY = {
		vendor_id: VENDOR_ID,
		vendor_auth_code: VENDOR_API_KEY,
	};

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, null, {
			server: nock.SERVER,
		});
	});

	describe('getUserTransactions', () => {
		const path = '/user/123/transactions';

		test('resolves on successfull request', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(200, RESPONSE);

			return instance.getUserTransactions(123).then(response => {
				expect(response).toEqual(RESPONSE.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('resolves on paged request', () => {
			const scope = nock()
				.post(path, Object.assign({ page: 2 }, EXPECTED_BODY))
				.reply(200, RESPONSE);

			return instance.getUserTransactions(123, 2).then(response => {
				expect(response).toEqual(RESPONSE.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('rejects on error response', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(400, DEFAULT_ERROR);

			return instance.getUserTransactions(123).then(
				() => {
					expect('This promise should fail').toBeFalsy();
				},
				err => {
					expect(err.response.statusCode).toBe(400);
					expect(scope.isDone()).toBeTruthy();
				}
			);
		});

		test('rejects on 200 response with error', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(200, DEFAULT_ERROR);

			return instance.getUserTransactions(123).then(
				() => {
					expect('This promise should fail').toBeFalsy();
				},
				err => {
					expect(err).toBeTruthy();
					expect(err.message).toContain(
						'Request http://test.paddle.com/user/123/transactions returned an error!'
					);
					expect(scope.isDone()).toBeTruthy();
				}
			);
		});
	});

	describe('getSubscriptionTransactions', () => {
		const path = '/subscription/123/transactions';

		test('resolves on successfull request', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(200, RESPONSE);

			return instance.getSubscriptionTransactions(123).then(response => {
				expect(response).toEqual(RESPONSE.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('getOrderTransactions', () => {
		const path = '/order/123/transactions';

		test('resolves on successfull request', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(200, RESPONSE);

			return instance.getOrderTransactions(123).then(response => {
				expect(response).toEqual(RESPONSE.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('getCheckoutTransactions', () => {
		const path = '/checkout/123/transactions';

		test('resolves on successfull request', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(200, RESPONSE);

			return instance.getCheckoutTransactions(123).then(response => {
				expect(response).toEqual(RESPONSE.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});
});
