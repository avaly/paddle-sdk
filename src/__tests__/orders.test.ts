import { PaddleSDK } from '../sdk';
import {
	DEFAULT_ERROR,
	VENDOR_API_KEY,
	VENDOR_ID,
	SERVER,
} from '../../utils/constants';
import fetchMock from '@fetch-mock/jest';
import { expectGetHeaders } from '../../utils/fetchMock';

describe('orders methods', () => {
	let instance: PaddleSDK;

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
			server: SERVER,
		});
	});

	describe('getOrderDetails', () => {
		const checkoutId = '219233-chre53d41f940e0-58aqh94971';
		const PATH = `${SERVER}/order?checkout_id=${checkoutId}`;

		test('resolves on successful request', async () => {
			// https://developer.paddle.com/api-reference/fea392d1e2f4f-get-order-details
			const body = {
				success: true,
				response: {
					checkout: {
						checkout_id: '219233-chre53d41f940e0-58aqh94971',
						image_url:
							'https://paddle.s3.amazonaws.com/user/91/XWsPdfmISG6W5fgX5t5C_icon.png',
						title: 'My Product',
					},
					lockers: [
						{
							download: 'https://mysite.com/download/my-app',
							instructions:
								'Simply enter your license code and click Activate.',
							license_code: 'ABC-123',
							locker_id: 1127139,
							product_id: 514032,
							product_name: 'My Product Name',
						},
					],
					order: {
						access_management: {
							software_key: [],
						},
						completed: {
							date: '2019-08-01 21:24:35.000000',
							timezone: 'UTC',
							timezone_type: 3,
						},
						coupon_code: 'EXAMPLE10',
						currency: 'GBP',
						customer: {
							email: 'example@paddle.com',
							marketing_consent: true,
						},
						customer_success_redirect_url: '',
						formatted_tax: '£1.73',
						formatted_total: '£9.99',
						has_locker: true,
						is_subscription: false,
						order_id: 123456,
						quantity: 1,
						receipt_url:
							'https://my.paddle.com/receipt/826289/3219233-chre53d41f940e0-58aqh94971',
						total: '9.99',
						total_tax: '1.73',
					},
					state: 'processed',
				},
			};

			fetchMock.get(PATH, { status: 200, body });

			const response = await instance.getOrderDetails(checkoutId);

			expect(response).toEqual(body.response);
			expect(fetchMock).toBeDone();
			expect(fetchMock).toHaveGot(PATH);
			expectGetHeaders(PATH);
		});

		test('rejects on error response', async () => {
			fetchMock.get(PATH, {
				status: 400,
				body: DEFAULT_ERROR,
			});

			await expect(instance.getOrderDetails(checkoutId)).rejects.toThrow(
				'Request failed with status code 400'
			);

			expect(fetchMock).toBeDone();
			expect(fetchMock).toHaveGot(PATH);
			expectGetHeaders(PATH);
		});
	});
});
