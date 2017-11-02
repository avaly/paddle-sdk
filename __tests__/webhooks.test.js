const PaddleSDK = require('../sdk');
const DEFAULT_ERROR = require('../utils/error');
const nock = require('../utils/nock');

describe('webhooks methods', () => {
	let instance;

	const VENDOR_ID = 'foo';
	const VENDOR_API_KEY = 'bar';

	const EXPECTED_BODY = {
		vendor_id: VENDOR_ID,
		vendor_auth_code: VENDOR_API_KEY,
	};

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, {
			server: nock.SERVER,
		});
	});

	describe('getWebhooksHistory', () => {
		const path = '/alert/webhooks';

		it('resolves on successfull request', () => {
			// https://paddle.com/docs/api-webhook-history
			const body = {
				success: true,
				response: {
					current_page: 1,
					total_pages: 46,
					alerts_per_page: 10,
					total_alerts: 460,
					query_head: {
						date: '2015-07-17 14:04:05.000000',
						timezone_type: 3,
						timezone: 'UTC',
					},
					data: [
						{
							id: 22257,
							alert_name: 'payment_refunded',
							status: 'success',
							created_at: '2015-07-17 14:04:05',
							updated_at: '2015-08-14 13:28:19',
							attempts: 1,
							fields: {
								order_id: 384920,
								amount: '100',
								currency: 'USD',
								email: 'xxxxx@xxxxx.com',
							},
						},
						{
							id: 22256,
							alert_name: 'payment_refunded',
							status: 'success',
							created_at: '2015-07-17 14:02:57',
							updated_at: '2015-07-17 14:02:57',
							attempts: 0,
							fields: {
								order_id: 384798,
								amount: '10',
								currency: 'USD',
								email: 'xxxxx@xxxxx.com',
							},
						},
						{
							id: 22254,
							alert_name: 'payment_refunded',
							status: 'success',
							created_at: '2015-07-17 13:46:39',
							updated_at: '2015-07-17 13:46:39',
							attempts: 0,
							fields: {
								order_id: 384803,
								amount: '20',
								currency: 'USD',
								email: 'xxxxx@xxxxx.com',
							},
						},
					],
				},
			};

			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(200, body);

			return instance.getWebhooksHistory().then(response => {
				expect(response).toEqual(body.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, EXPECTED_BODY)
				.reply(400, DEFAULT_ERROR);

			return instance.getWebhooksHistory().catch(response => {
				expect(response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});
});
