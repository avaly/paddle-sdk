const PaddleSDK = require('../sdk');
const DEFAULT_ERROR = require('../utils/error');
const nock = require('../utils/nock');

describe('subscription methods', () => {
	let instance;

	const VENDOR_ID = 'foo';
	const VENDOR_API_KEY = 'bar';

	const EXPECTED_BODY = {
		vendor_id: VENDOR_ID,
		vendor_auth_code: VENDOR_API_KEY,
	};

	const PRODUCT_ID = '12345';
	const PLAN_ID = '23456';
	const SUBSCRIPTION_ID = '34567';
	const PAYMENT_ID = '512345';
	const NEW_PAYMENT_DATE = '2023-01-01';
	const NEW_PAYMENT_DATE_INVALID = '22/10/2022';

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, null, {
			server: nock.SERVER,
		});
	});

	describe('getProductPlans', () => {
		const path = '/subscription/plans';
		const expectedBody = Object.assign(
			{
				product_id: PRODUCT_ID,
			},
			EXPECTED_BODY
		);

		it('resolves on successful request', () => {
			// https://paddle.com/docs/api-list-plans
			const body = {
				success: true,
				response: [
					{
						id: 496197,
						name: 'My App: Basic',
						billing_type: 'month',
						billing_period: 1,
						initial_price: {
							USD: '0.00',
						},
						recurring_price: {
							USD: '5.000',
						},
					},
					{
						id: 496198,
						name: 'My App: Pro',
						billing_type: 'day',
						billing_period: 1,
						initial_price: {
							USD: '0.00',
						},
						recurring_price: {
							USD: '10.000',
						},
					},
					{
						id: 496199,
						name: 'My App: Pro',
						billing_type: 'month',
						billing_period: 1,
						initial_price: {
							USD: '0.00',
						},
						recurring_price: {
							USD: '10.000',
						},
					},
				],
			};

			const scope = nock()
				.post(path, expectedBody)
				.reply(200, body);

			return instance.getProductPlans(PRODUCT_ID).then(response => {
				expect(response).toEqual(body.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance.getProductPlans(PRODUCT_ID).catch(err => {
				expect(err.response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('getPlanUsers', () => {
		const path = '/subscription/users';
		const expectedBody = Object.assign(
			{
				plan: PLAN_ID,
			},
			EXPECTED_BODY
		);

		it('resolves on successful request', () => {
			// https://paddle.com/docs/api-list-users
			const body = {
				success: true,
				response: [
					{
						subscription_id: 502198,
						plan_id: 496199,
						user_id: 285846,
						user_email: 'christian@paddle.com',
						state: 'active',
						signup_date: '2015-10-06 09:44:23',
						last_payment: {
							amount: 5,
							currency: 'USD',
							date: '2015-10-06',
						},
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

			return instance.getPlanUsers(PLAN_ID).then(response => {
				expect(response).toEqual(body.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance.getPlanUsers(PLAN_ID).catch(err => {
				expect(err.response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('getPlanPayments', () => {
		const path = '/subscription/payments';
		const expectedBody = Object.assign(
			{
				plan: PLAN_ID,
			},
			EXPECTED_BODY
		);

		it('resolves on successful request', () => {
			// https://paddle.com/docs/api-list-payments
			const body = {
				success: true,
				response: [
					{
						id: 8936,
						subscription_id: 2746,
						amount: 1,
						currency: 'USD',
						payout_date: '2015-10-15',
						is_paid: 0,
						receipt_url:
							'https://www.paddle.com/receipt/469214-8936/1940881-chrea0eb34164b5-f0d6553bdf',
					},
				],
			};

			const scope = nock()
				.post(path, expectedBody)
				.reply(200, body);

			return instance.getPlanPayments(PLAN_ID).then(response => {
				expect(response).toEqual(body.response);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance.getPlanPayments(PLAN_ID).catch(err => {
				expect(err.response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('reschedulePayment', () => {
		const path = '/subscription/payments_reschedule';
		const expectedBody = Object.assign(
			{
				payment_id: PAYMENT_ID,
				date: NEW_PAYMENT_DATE,
			},
			EXPECTED_BODY
		);

		it('resolves on successful request', () => {
			// https://developer.paddle.com/api-reference/fe93f28aa7f7e-reschedule-payment
			const body = {
				success: true,
				response: [
					{
						success: true,
					},
				],
			};

			const scope = nock()
				.post(path, expectedBody)
				.reply(200, body);

			return instance
				.reschedulePayment(PAYMENT_ID, NEW_PAYMENT_DATE)
				.then(response => {
					expect(response).toEqual(body.response);
					expect(scope.isDone()).toBeTruthy();
				});
		});

		it('rejects on invalid date format', () => {
			expect(() =>
				instance.reschedulePayment(PAYMENT_ID, NEW_PAYMENT_DATE_INVALID)
			).toThrow('Invalid date format, must match \\d{4}-\\d{2}-\\d{2}');
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance
				.reschedulePayment(PAYMENT_ID, NEW_PAYMENT_DATE)
				.catch(err => {
					expect(err.response.statusCode).toBe(400);
					expect(scope.isDone()).toBeTruthy();
				});
		});
	});

	describe('updateSubscriptionPlan', () => {
		const path = '/subscription/users/update';
		const expectedBody = Object.assign(
			{
				subscription_id: SUBSCRIPTION_ID,
				plan_id: PLAN_ID,
				prorate: false,
			},
			EXPECTED_BODY
		);

		it('resolves on successful request', () => {
			// https://developer.paddle.com/api-reference/subscription-api/subscription-users/updateuser
			const body = {
				success: true,
			};

			const scope = nock()
				.post(path, expectedBody)
				.reply(200, body);

			return instance
				.updateSubscriptionPlan(SUBSCRIPTION_ID, PLAN_ID)
				.then(response => {
					expect(response).toEqual(body);
					expect(scope.isDone()).toBeTruthy();
				});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance
				.updateSubscriptionPlan(SUBSCRIPTION_ID, PLAN_ID)
				.catch(err => {
					expect(err.response.statusCode).toBe(400);
					expect(scope.isDone()).toBeTruthy();
				});
		});
	});

	describe('updateSubscription', () => {
		const path = '/subscription/users/update';
		const expectedBody = Object.assign(
			{
				subscription_id: SUBSCRIPTION_ID,
				plan_id: PLAN_ID,
				quantity: 2,
				recurring_price: 25.5,
				currency: 'GBP',
			},
			EXPECTED_BODY
		);

		it('resolves on successful request all params', () => {
			// https://developer.paddle.com/api-reference/subscription-api/subscription-users/updateuser
			const body = {
				success: true,
			};

			const scope = nock()
				.post(path, expectedBody)
				.reply(200, body);

			return instance
				.updateSubscription(SUBSCRIPTION_ID, {
					planID: PLAN_ID,
					quantity: 2,
					price: 25.5,
					currency: 'GBP',
				})
				.then(response => {
					expect(response).toEqual(body);
					expect(scope.isDone()).toBeTruthy();
				});
		});

		it('resolves on successful request quantity', () => {
			const expectedBodyQuantity = Object.assign(
				{
					subscription_id: SUBSCRIPTION_ID,
					quantity: 2,
				},
				EXPECTED_BODY
			);
			// https://developer.paddle.com/api-reference/subscription-api/subscription-users/updateuser
			const body = {
				success: true,
			};

			const scope = nock()
				.post(path, expectedBodyQuantity)
				.reply(200, body);

			return instance
				.updateSubscription(SUBSCRIPTION_ID, {
					quantity: 2,
				})
				.then(response => {
					expect(response).toEqual(body);
					expect(scope.isDone()).toBeTruthy();
				});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance
				.updateSubscription(SUBSCRIPTION_ID, {
					planID: PLAN_ID,
					quantity: 2,
					price: 25.5,
					currency: 'GBP',
				})
				.catch(err => {
					expect(err.response.statusCode).toBe(400);
					expect(scope.isDone()).toBeTruthy();
				});
		});
	});

	describe('cancelSubscription', () => {
		const path = '/subscription/users_cancel';
		const expectedBody = Object.assign(
			{
				subscription_id: SUBSCRIPTION_ID,
			},
			EXPECTED_BODY
		);

		it('resolves on successful request', () => {
			// https://paddle.com/docs/api-cancelling-subscriptions
			const body = {
				success: true,
			};

			const scope = nock()
				.post(path, expectedBody)
				.reply(200, body);

			return instance.cancelSubscription(SUBSCRIPTION_ID).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(path, expectedBody)
				.reply(400, DEFAULT_ERROR);

			return instance.cancelSubscription(SUBSCRIPTION_ID).catch(err => {
				expect(err.response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});
});
