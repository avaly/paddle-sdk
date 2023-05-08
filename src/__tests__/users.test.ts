import { PaddleSDK } from '../sdk';
import {
	DEFAULT_ERROR,
	EXPECTED_BODY,
	VENDOR_API_KEY,
	VENDOR_ID,
} from '../../utils/constants';
import nock, { SERVER } from '../../utils/nock';

describe('users methods', () => {
	let instance: PaddleSDK;

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
			server: SERVER,
		});
	});

	describe('getUsers', () => {
		const path = '/subscription/users';
		const expectedBody = {
			...EXPECTED_BODY,
			page: 1,
			results_per_page: 200,
		};

		test('resolves on successful request', async () => {
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

			const scope = nock().post(path, expectedBody).reply(200, body);

			const response = await instance.getUsers();

			expect(response).toEqual(body.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error response', async () => {
			const scope = nock().post(path, expectedBody).reply(400, DEFAULT_ERROR);

			await expect(instance.getUsers()).rejects.toThrow(
				'Request failed with status code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on 200 response with error', async () => {
			const scope = nock().post(path, expectedBody).reply(200, DEFAULT_ERROR);

			await expect(instance.getUsers()).rejects.toThrow(
				'Request https://test.paddle.com/subscription/users returned an error!'
			);

			expect(scope.isDone()).toBeTruthy();
		});

		test('200 error response includes error information', async () => {
			const scope = nock().post(path, expectedBody).reply(200, DEFAULT_ERROR);

			await expect(instance.getUsers()).rejects.toMatchObject({
				paddleCode: DEFAULT_ERROR.error.code,
				paddleMessage: DEFAULT_ERROR.error.message,
			});

			expect(scope.isDone()).toBeTruthy();
		});
	});
});
