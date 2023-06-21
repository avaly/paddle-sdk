import {
	DEFAULT_ERROR,
	VENDOR_API_KEY,
	VENDOR_ID,
} from '../../utils/constants';
import nock, { SERVER } from '../../utils/nock';
import { PaddleSDK } from '../sdk';

describe('prices methods', () => {
	let instance: PaddleSDK;

	beforeEach(() => {
		instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
			server: SERVER,
		});
	});

	describe('getPrices', () => {
		const product1 = 123456,
			product2 = 23456,
			coupon1 = 'EXAMPLE10',
			coupon2 = 'EXAMPLE5',
			customerCountry = 'GB',
			customerIp = '127.0.0.1';
		const path = `/prices?product_ids=${product1}%2C${product2}`;

		test('resolves on successful request', async () => {
			// https://developer.paddle.com/api-reference/e268a91845971-get-prices
			const body = {
				success: true,
				response: {
					customer_country: customerCountry,
					products: [
						{
							product_id: product1,
							product_title: 'My Product 1',
							currency: 'GBP',
							vendor_set_prices_included_tax: true,
							price: {
								gross: 34.95,
								net: 29.13,
								tax: 5.83,
							},
							list_price: {
								gross: 34.95,
								net: 29.13,
								tax: 5.83,
							},
							applied_coupon: [coupon1],
						},
						{
							product_id: product2,
							product_title: 'My Product 2',
							currency: 'GBP',
							vendor_set_prices_included_tax: true,
							price: {
								gross: 17.95,
								net: 14.96,
								tax: 2.99,
							},
							list_price: {
								gross: 17.95,
								net: 14.96,
								tax: 2.99,
							},
							applied_coupon: [coupon2],
						},
					],
				},
			};

			const scope = nock()
				.get(
					`${path}&coupons=${coupon1}%2C${coupon2}&customer_country=${customerCountry}&customer_ip=${customerIp}`
				)
				.reply(200, body);

			const response = await instance.getPrices([product1, product2], {
				coupons: [coupon1, coupon2],
				customerCountry,
				customerIp,
			});

			expect(response).toEqual(body.response);
			expect(scope.isDone()).toBeTruthy();
		});

		test('rejects on error response', async () => {
			const scope = nock().get(path).reply(400, DEFAULT_ERROR);

			await expect(instance.getPrices([product1, product2])).rejects.toThrow(
				'Request failed with status code 400'
			);

			expect(scope.isDone()).toBeTruthy();
		});
	});
});
