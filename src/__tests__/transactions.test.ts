import { PaddleSDK } from '../sdk';
import {
	DEFAULT_ERROR,
	EXPECTED_BODY,
	VENDOR_API_KEY,
	VENDOR_ID,
} from '../../utils/constants';
import nock, { SERVER } from '../../utils/nock';

describe('transactions methods', () => {
	let instance: PaddleSDK;

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

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
			server: SERVER,
		});
	});

	describe('getUserTransactions', () => {
		const path = '/user/123/transactions';

		test('resolves on successful request', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(200, RESPONSE);

			const response = await instance.getUserTransactions(123);

			expect(response).toEqual(RESPONSE.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('resolves on paged request', async () => {
			const scope = nock()
				.post(path, Object.assign({ page: 2 }, EXPECTED_BODY))
				.reply(200, RESPONSE);

			const response = await instance.getUserTransactions(123, 2);

			expect(response).toEqual(RESPONSE.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error response', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(400, DEFAULT_ERROR);

			await expect(instance.getUserTransactions(123)).rejects.toThrow(
				'Request failed with status code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on 200 response with error', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(200, DEFAULT_ERROR);

			await expect(instance.getUserTransactions(123)).rejects.toThrow(
				'Request https://test.paddle.com/user/123/transactions returned an error!'
			);

			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('getSubscriptionTransactions', () => {
		const path = '/subscription/123/transactions';

		test('resolves on successful request', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(200, RESPONSE);

			const response = await instance.getSubscriptionTransactions(123);

			expect(response).toEqual(RESPONSE.response);
			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('getOrderTransactions', () => {
		const path = '/order/123/transactions';

		test('resolves on successful request', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(200, RESPONSE);

			const response = await instance.getOrderTransactions(123);

			expect(response).toEqual(RESPONSE.response);
			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('getCheckoutTransactions', () => {
		const path = '/checkout/123/transactions';

		test('resolves on successful request', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(200, RESPONSE);

			const response = await instance.getCheckoutTransactions('123');

			expect(response).toEqual(RESPONSE.response);
			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('getProductTransactions', () => {
		const path = '/product/123/transactions';

		test('resolves on successful request', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(200, RESPONSE);

			const response = await instance.getProductTransactions(123);

			expect(response).toEqual(RESPONSE.response);
			expect(scope.isDone()).toBeTruthy();
		});
	});
});
