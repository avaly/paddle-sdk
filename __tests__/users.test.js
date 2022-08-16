const PaddleSDK = require('../sdk');
const DEFAULT_ERROR = require('../utils/error');
const nock = require('../utils/nock');

describe('users methods', () => {
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

	describe('getUsers', () => {
		const path = '/subscription/users';
		const expectedBody = Object.assign(
			{
				page: 1,
				results_per_page: 200,
			},
			EXPECTED_BODY
		);

		it('resolves on successful request', () => {
			// https://developer.paddle.com/api-reference/e33e0a714a05d-list-users
			const body = {
				success: true,
				response: [
					{
						subscription_id: 502198,
						plan_id: 496199,
						user_id: 285846,
						user_email: 'name@example.com',
						marketing_consent: true,
						update_url:
							'https://subscription-management.paddle.com/subscription/87654321/hash/eyJpdiI6IlU0Nk5cL1JZeHQyTXd.../update',
						cancel_url:
							'https://subscription-management.paddle.com/subscription/87654321/hash/eyJpdiI6IlU0Nk5cL1JZeHQyTXd.../cancel',
						state: 'active',
						signup_date: '2015-10-06 09:44:23',
						last_payment: {
							amount: 5,
							currency: 'USD',
							date: '2015-10-06',
						},
						payment_information: {
							payment_method: 'card',
							card_type: 'visa',
							last_four_digits: '1111',
							expiry_date: '02/2020',
						},
						quantity: 3,
						next_payment: {
							amount: 10,
							currency: 'USD',
							date: '2015-11-06',
						},
					},
				],
			};

			const scope = nock()
				.post(path, expectedBody)
				.reply(200, body);

			return instance.getUsers().then(response => {
				expect(response).toEqual(body.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error response', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance.getUsers().then(
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
				.post(path, expectedBody)
				.reply(200, DEFAULT_ERROR);

			return instance.getUsers().then(
				() => {
					expect('This promise should fail').toBeFalsy();
				},
				err => {
					expect(err).toBeTruthy();
					expect(err.message).toContain(
						'Request http://test.paddle.com/subscription/users returned an error! response={"success":false,"error":{"code":123,"message":"Error message."}}'
					);
					expect(scope.isDone()).toBeTruthy();
				}
			);
		});
	});
});
