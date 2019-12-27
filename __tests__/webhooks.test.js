const PaddleSDK = require('../sdk');
const DEFAULT_ERROR = require('../utils/error');
const nock = require('../utils/nock');

describe('webhooks methods', () => {
	let instance;

	const VENDOR_ID = 'foo';
	const VENDOR_API_KEY = 'bar';
	const VENDOR_PUBLIC_KEY = Buffer.from(
		'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUF5Q05KajlQSk95NWhVMW1zS21DawovS2lNN09Ua0hQUVYyNTkwS2FUYzVGTW8waG9CeHAyWGlBRC91dktMOHpYejBlRFhjRjBDU2tLQUVVdWpQRjVwCmlBSndLdUtNYU12Vyt6VFd6SWRiS1J0Tjl0d3JZYlFGK3MzcUtGNTFHNk56NnlBeE91dTRwclVEMDhUZ1VFQlUKSENuSlN1anJZSXMyeHJCNkF5MXk2VTR5LyticFpnNXpkVkpUaGNCakxEVVJPU25NVVFGb1YzUU5nUE5Fck45VwpybnVoNktFQS93SDM1ZHNBVzNrcmswU1Q0ekIrWlRqK2duTHVwNWtzYzBGak9rQllDSEFmUmpCeklkV09LZHkvCjBmZzJpVGZLaHBteXZ6TUoyS2gzcnkwcW1wVTlJNXAwUVpjMVFHWFRmV2gvaXJPV2ZXaXhQZlhvbi9ESHRnRTQKbmhHNVlXVlY4d3lrZ0tjUHd4UDFENGZnQzF2S2RoVnJ3VWd6Z09oY2V3VlFucDhkSDNnRDlvNmQwZGpPQk45Zwoxak1ZZzd6alRGcVMwbVgvd3dQSUdzM2lKcXdvSlZ3ZExaWWh2Wm13a21XQU1YREs0L2k3N1dQVWpxV0prWnRnCk8rY1puWW9FNjJDRENZN1RWS2xsRWRJRUtZUFgrdCtFenBZT3hjZSt3cjcwNUo4NkVKY1NsOTQyb1RTL08vTjgKQzdIOERLSGQwT2xBRjEwOCtjUlo1Tjc2cGxNcmxrNlFxMUdZWVdwbkxzMVlJcXpBTnIrckRNK1BBUzRxVlJEbApHWmE4RU5WYkJjSUhtUUVJZW5TbUZrSDJZc3F4Q2dZYXIyZlh5Zzh3M0NEcFNqaEJ5OVJwT0tMU1BUVWVBUk1vCkdwMWZlc1RXSytLdXBIM3FoOVZxRVJNQ0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=',
		'base64'
	).toString();

	const EXPECTED_BODY = {
		vendor_id: VENDOR_ID,
		vendor_auth_code: VENDOR_API_KEY,
	};

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, VENDOR_PUBLIC_KEY, {
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

			return instance.getWebhooksHistory().catch(err => {
				expect(err.response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('verifyWebhookData', () => {
		let data;

		beforeEach(() => {
			data = {
				created_at: '2017-11-20 19:08:13',
				email: 'foo@bar.com',
				event_time: '2017-11-20 19:08:13',
				products: '520640',
				source: 'Checkout',
				subscribed: '',
				user_id: '116112',
				p_signature:
					'W8MWdcuftB8t18g4QGfLSE/6gqjpkYJqkl69Z21AdlLyt3odYY9pDVLAz1jrWfRcIIxNWBa2Cc6/QZal8pEjFUmS7ljFA30BxUBkjeNSI5L5KmYYu3GhJ3xoA1of69D20Hvdo1DKRI74c6RMKnJALmpfjQICI2tC4FbBsCOXA5uz98gGbaPeWCOVuwhBGFsGGlhfelKOvbcbFomYDcsyHIQPCFdNi48qWKl0/brGEtD40rWsFM/GIMf4aOwIVVuunRA+SJD+CeCrBmnx5JkI4+IDN6z64dUjgXbRYDKuIe95wEIJsLlbyDjI3tJf56igknXnsdISugtLil8rhtRFRYTD/jkjCDUhgDicREQoSs2JgHgAm6f7xg/UCJpZYGCvKggnFtcBubShLx2C6OmY7jx/7WOkXhMIa6BjFZSvcikW0SQ/pf8UB+bura8+IpVt8vksyeoMnwooWnmXaTVjP2kCa3bKUzXCbj9qMvsaVo6znyhhmPytU5/HDGl2FI20JA/V173pKzMK8HJkQygxCTKJKvG6eKCEoHbjp4YNu+cvaBMjlm2Bd2Sv9NOnTCjoToq2/TdUdCt1kFbPjSFhmnZsZIpMrFTHU0Td0boOguKdqrJsKBMQBq/1BomWSWtBdbVKyfi8BRzGxPiJoprfs3OJlhzsaE/dCGWdZ3SrBWs=',
				alert_id: '2954270',
				alert_name: 'new_audience_member',
			};
		});

		it('validates a valid data set', () => {
			expect(instance.verifyWebhookData(data)).toBe(true);
		});

		it('does not validate an invalid data set', () => {
			data.source = 'tampered field';

			expect(instance.verifyWebhookData(data)).toBe(false);
		});

		it('does not validate a valid data set with an invalid public key', () => {
			const invalidKeyClient = new PaddleSDK(
				VENDOR_ID,
				VENDOR_API_KEY,
				'invalid key',
				{
					server: nock.SERVER,
				}
			);

			expect(invalidKeyClient.verifyWebhookData(data)).toBe(false);
		});
	});
});
