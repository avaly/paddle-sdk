import { PaddleSDK } from '../sdk';
import {
	DEFAULT_ERROR,
	EXPECTED_BODY,
	VENDOR_API_KEY,
	VENDOR_ID,
} from '../../utils/constants';
import nock, { SERVER } from '../../utils/nock';

describe('subscription methods', () => {
	let instance: PaddleSDK;

	const PLAN_ID = 23456;
	const SUBSCRIPTION_ID = 34567;
	const PAYMENT_ID = 512345;
	const NEW_PAYMENT_DATE = new Date('2023-01-01');

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
			server: SERVER,
		});
	});

	describe('getSubscriptionPlans', () => {
		const path = '/subscription/plans';
		// https://paddle.com/docs/api-list-plans
		const responseBody = {
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

		test('resolves on successful request', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(200, responseBody);

			const response = await instance.getSubscriptionPlans();

			expect(response).toEqual(responseBody.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock().post(path, EXPECTED_BODY).reply(400, DEFAULT_ERROR);

			await expect(instance.getSubscriptionPlans()).rejects.toThrow(
				'Response code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('getSubscriptionPlan', () => {
		const path = '/subscription/plans';
		const expectedBody = {
			...EXPECTED_BODY,
			plan: PLAN_ID,
		};
		// https://paddle.com/docs/api-list-plans
		const responseBody = {
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
			],
		};

		test('resolves on successful request', async () => {
			const scope = nock().post(path, expectedBody).reply(200, responseBody);

			const response = await instance.getSubscriptionPlan(PLAN_ID);

			expect(response).toEqual(responseBody.response[0]);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock().post(path, expectedBody).reply(400, DEFAULT_ERROR);

			await expect(instance.getSubscriptionPlan(PLAN_ID)).rejects.toThrow(
				'Response code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('getUsers', () => {
		const path = '/subscription/users';
		const expectedBody = {
			...EXPECTED_BODY,
			page: 1,
			plan_id: PLAN_ID,
			results_per_page: 200,
		};

		test('resolves on successful request', async () => {
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

			const scope = nock().post(path, expectedBody).reply(200, body);

			const response = await instance.getUsers({ planID: PLAN_ID });

			expect(response).toEqual(body.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock().post(path, expectedBody).reply(400, DEFAULT_ERROR);

			await expect(instance.getUsers({ planID: PLAN_ID })).rejects.toThrow(
				'Response code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('getSubscriptionPayments', () => {
		const path = '/subscription/payments';
		const expectedBody = {
			...EXPECTED_BODY,
			plan: PLAN_ID,
		};

		test('resolves on successful request', async () => {
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

			const scope = nock().post(path, expectedBody).reply(200, body);

			const response = await instance.getSubscriptionPayments(PLAN_ID);

			expect(response).toEqual(body.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock().post(path, expectedBody).reply(400, DEFAULT_ERROR);

			await expect(instance.getSubscriptionPayments(PLAN_ID)).rejects.toThrow(
				'Response code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('reschedulePayment', () => {
		const path = '/subscription/payments_reschedule';
		const expectedBody = {
			...EXPECTED_BODY,
			payment_id: PAYMENT_ID,
			date: NEW_PAYMENT_DATE.toISOString().substring(0, 10),
		};

		test('resolves on successful request', async () => {
			// https://developer.paddle.com/api-reference/fe93f28aa7f7e-reschedule-payment
			const body = {
				success: true,
				response: [
					{
						success: true,
					},
				],
			};

			const scope = nock().post(path, expectedBody).reply(200, body);

			const response = await instance.reschedulePayment(
				PAYMENT_ID,
				NEW_PAYMENT_DATE
			);

			expect(response).toEqual(body.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock().post(path, expectedBody).reply(400, DEFAULT_ERROR);

			await expect(
				instance.reschedulePayment(PAYMENT_ID, NEW_PAYMENT_DATE)
			).rejects.toThrow('Response code 400');

			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('updateSubscription', () => {
		const path = '/subscription/users/update';
		const expectedBody = {
			...EXPECTED_BODY,
			subscription_id: SUBSCRIPTION_ID,
			plan_id: PLAN_ID,
			quantity: 2,
			recurring_price: 25.5,
			currency: 'GBP',
		};
		// https://developer.paddle.com/api-reference/subscription-api/subscription-users/updateuser
		const responseBody = {
			success: true,
			response: {
				plan_id: PLAN_ID,
				subscription_id: SUBSCRIPTION_ID,
				user_id: 0,
			},
		};

		test('resolves on successful request all params', async () => {
			const scope = nock().post(path, expectedBody).reply(200, responseBody);

			const response = await instance.updateSubscription(SUBSCRIPTION_ID, {
				planID: PLAN_ID,
				quantity: 2,
				price: 25.5,
				currency: 'GBP',
			});

			expect(response).toEqual(responseBody.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('resolves on successful request quantity', async () => {
			const expectedBodyQuantity = {
				...EXPECTED_BODY,
				subscription_id: SUBSCRIPTION_ID,
				quantity: 2,
			};

			const scope = nock()
				.post(path, expectedBodyQuantity)
				.reply(200, responseBody);

			const response = await instance.updateSubscription(SUBSCRIPTION_ID, {
				quantity: 2,
			});

			expect(response).toEqual(responseBody.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('resolves on successful pause subscription', async () => {
			const expectedBody = Object.assign(
				{
					subscription_id: SUBSCRIPTION_ID,
					pause: true,
				},
				EXPECTED_BODY
			);

			const scope = nock().post(path, expectedBody).reply(200, responseBody);

			const response = await instance.updateSubscription(SUBSCRIPTION_ID, {
				pause: true,
			});

			expect(response).toEqual(responseBody.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('resolves on successful renew subscription', async () => {
			const expectedBody = {
				...EXPECTED_BODY,
				subscription_id: SUBSCRIPTION_ID,
				pause: false,
			};

			const scope = nock().post(path, expectedBody).reply(200, responseBody);

			const response = await instance.updateSubscription(SUBSCRIPTION_ID, {
				pause: false,
			});

			expect(response).toEqual(responseBody.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock()
				.post(path, {
					...EXPECTED_BODY,
					subscription_id: SUBSCRIPTION_ID,
					plan_id: PLAN_ID,
				})
				.reply(400, DEFAULT_ERROR);

			await expect(
				instance.updateSubscription(SUBSCRIPTION_ID, { planID: PLAN_ID })
			).rejects.toThrow('Response code 400');

			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('cancelSubscription', () => {
		const path = '/subscription/users_cancel';
		const expectedBody = {
			...EXPECTED_BODY,
			subscription_id: SUBSCRIPTION_ID,
		};

		test('resolves on successful request', async () => {
			// https://paddle.com/docs/api-cancelling-subscriptions
			const body = {
				success: true,
			};

			const scope = nock().post(path, expectedBody).reply(200, body);

			const response = await instance.cancelSubscription(SUBSCRIPTION_ID);

			expect(response).toEqual(true);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock().post(path, expectedBody).reply(400, DEFAULT_ERROR);

			await expect(
				instance.cancelSubscription(SUBSCRIPTION_ID)
			).rejects.toThrow('Response code 400');

			expect(scope.isDone()).toBeTruthy();
		});
	});

	describe('createSubscriptionModifier', () => {
		const path = '/subscription/modifiers/create';
		const expectedBody = {
			...EXPECTED_BODY,
			subscription_id: SUBSCRIPTION_ID,
			modifier_amount: 10,
		};
		// https://developer.paddle.com/api-reference/dc2b0c06f0481-create-modifier
		const responseBody = {
			success: true,
			response: {
				subscription_id: SUBSCRIPTION_ID,
				modifier_id: 1,
			},
		};

		test('resolves on successful request', async () => {
			const scope = nock().post(path, expectedBody).reply(200, responseBody);

			const response = await instance.createSubscriptionModifier(
				SUBSCRIPTION_ID,
				10
			);

			expect(response).toEqual(responseBody.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('resolves on successful request all params', async () => {
			const expectedBody = Object.assign(
				{
					subscription_id: SUBSCRIPTION_ID,
					modifier_amount: 10,
					modifier_recurring: false,
					modifier_description: 'description',
				},
				EXPECTED_BODY
			);

			const scope = nock().post(path, expectedBody).reply(200, responseBody);

			const response = await instance.createSubscriptionModifier(
				SUBSCRIPTION_ID,
				10,
				{
					description: 'description',
					recurring: false,
				}
			);

			expect(response).toEqual(responseBody.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error request', async () => {
			const scope = nock().post(path, expectedBody).reply(400, DEFAULT_ERROR);

			await expect(
				instance.createSubscriptionModifier(SUBSCRIPTION_ID, 10)
			).rejects.toThrow('Response code 400');

			expect(scope.isDone()).toBeTruthy();
		});
	});
});
