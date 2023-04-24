import crypto from 'crypto';
import axios, { AxiosRequestConfig } from 'axios';

import serialize from './serialize';
import {
	CreateSubscriptionModifierBody,
	CreateSubscriptionModifierResponse,
	CreateOneOffChargeBody,
	CreateOneOffChargeResponse,
	GeneratePaylinkBody,
	GeneratePaylinkResponse,
	GetProductCouponsBody,
	GetProductCouponsResponse,
	GetProductsResponse,
	GetSubscriptionPaymentsBody,
	GetSubscriptionPaymentsResponse,
	GetSubscriptionPlansBody,
	GetSubscriptionPlansResponse,
	GetSubscriptionUsersBody,
	GetSubscriptionUsersResponse,
	GetTransactionsResponse,
	GetWebhookHistoryResponse,
	PaddleResponseWrap,
	RescheduleSubscriptionPaymentBody,
	UpdateSubscriptionUserBody,
	UpdateSubscriptionUserResponse,
} from './types';
import { VERSION } from './version';

const VENDOR_SANDBOX_URL = 'https://sandbox-vendors.paddle.com/api/2.0';
const VENDOR_SERVER_URL = 'https://vendors.paddle.com/api/2.0';

const CHECKOUT_SANDBOX_URL = 'https://sandbox-checkout.paddle.com/api/1.0';
const CHECKOUT_SERVER_URL = 'https://checkout.paddle.com/api/1.0';

export interface Options {
	/** Whether to use the sandbox server URL */
	sandbox?: boolean;
	/** The server URL prefix for all requests */
	server?: string;
}

export class PaddleSDK {
	/** The API key for a Paddle account */
	apiKey: string;
	/**	The public key for a Paddle account used to verify webhooks, only required for {@link verifyWebhookData} */
	publicKey: string;
	options?: Options;
	/** The vendor ID for a Paddle account */
	vendorID: string;

	/**
	 * @param vendorID The vendor ID for a Paddle account
	 * @param apiKey The API key for a Paddle account
	 * @param publicKey The public key for a Paddle account used to verify webhooks, only required for {@link verifyWebhookData}
	 *
	 * @example
	 * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key');
	 * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key', 'your-public-key');
	 */
	constructor(
		vendorID: string,
		apiKey: string,
		publicKey?: string,
		options?: Options
	) {
		this.vendorID = vendorID || 'MISSING';
		this.apiKey = apiKey || 'MISSING';
		this.publicKey = publicKey || 'MISSING';
		this.options = options;
	}

	/**
	 * Get the current list of products.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/0f31bd7cbce47-list-products
	 *
s	 * @example
	 * const products = await client.getProducts();
	 */
	getProducts() {
		return this._request<GetProductsResponse>('/product/get_products');
	}

	/**
	 * Get the current list of coupons for a product.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/6a59b795bd653-list-coupons
	 *
	 * @example
	 * const coupons = await client.getProductCoupons(123);
	 */
	getProductCoupons(productID: number) {
		return this._request<GetProductCouponsResponse, GetProductCouponsBody>(
			'/product/list_coupons',
			{
				body: { product_id: productID },
			}
		);
	}

	/**
	 * Get a list of all the available subscription plans.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/a835554495295-list-plans
	 *
	 * @example
	 * const plans = await client.getSubscriptionPlans();
	 */
	getSubscriptionPlans() {
		return this._request<GetSubscriptionPlansResponse>('/subscription/plans');
	}

	/**
	 * Get the plan based on its ID.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/a835554495295-list-plans
	 *
	 * @example
	 * const plan = await client.getSubscriptionPlan(123);
	 */
	async getSubscriptionPlan(planID: number) {
		return this._first(
			await this._request<
				GetSubscriptionPlansResponse,
				GetSubscriptionPlansBody
			>('/subscription/plans', {
				body: { plan: planID },
			})
		);
	}

	/**
	 * Get the list of all payments or payments for a subscription plan.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/80462f27b2011-list-payments
	 *
	 * @example
	 * const payments = await client.getSubscriptionPayments();
	 * const payments = await client.getSubscriptionPayments({ subscriptionID: 123 });
	 * Legacy usage for backwards compatibility: pass planID as a number instead of options object
	 * const payments = await client.getSubscriptionPayments(123);
	 */
	getSubscriptionPayments(
		options?:
			| number
			| {
					planID?: number;
					subscriptionID?: number;
					isPaid?: boolean;
					from?: Date;
					to?: Date;
					isOneOffCharge?: boolean;
			  }
	) {
		if (typeof options === 'number') {
			console.warn(
				'Passing planID as a number is deprecated, please use an options object instead'
			);
		}
		const opts = typeof options === 'number' ? { planID: options } : options;
		const {
			planID = null,
			subscriptionID = null,
			isPaid = null,
			from = null,
			to = null,
			isOneOffCharge = null,
		} = opts || {};

		return this._request<
			GetSubscriptionPaymentsResponse,
			GetSubscriptionPaymentsBody
		>('/subscription/payments', {
			body: {
				...(planID && { plan: planID }),
				...(subscriptionID && { subscription_id: subscriptionID }),
				...(typeof isPaid === 'boolean' && { is_paid: Number(isPaid) }),
				...(from && { from: from.toISOString().substring(0, 10) }),
				...(to && { to: to.toISOString().substring(0, 10) }),
				...(typeof isOneOffCharge === 'boolean' && {
					is_one_off_charge: Number(isOneOffCharge),
				}),
			},
		});
	}

	/**
	 * Get the list of latest webhooks history.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/7695d655c158b-get-webhook-history
	 *
	 * @example
	 * const webhooksHistory = await client.getWebhooksHistory();
	 */
	getWebhooksHistory() {
		return this._request<GetWebhookHistoryResponse>('/alert/webhooks');
	}

	/**
	 * Get the list of transactions for a user.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
	 *
	 * @example
	 * const userTransactions = await client.getUserTransactions(123);
	 * const userTransactionsNext = await client.getUserTransactions(123, 2);
	 */
	getUserTransactions(userID: number, page?: number) {
		return this._getTransactions('user', userID, page);
	}

	/**
	 * Get the list of transactions for a subscription.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
	 *
=	 * @example
	 * const subscriptionTransactions = await client.getSubscriptionTransactions(123);
	 * const subscriptionTransactionsNext = await client.getSubscriptionTransactions(123, 2);
	 */
	getSubscriptionTransactions(subscriptionID: number, page?: number) {
		return this._getTransactions('subscription', subscriptionID, page);
	}

	/**
	 * Get the list of transactions for an order.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
	 *
	 * @example
	 * const orderTransactions = await client.getOrderTransactions(123);
	 * const orderTransactionsNext = await client.getOrderTransactions(123, 2);
	 */
	getOrderTransactions(orderID: number, page?: number) {
		return this._getTransactions('order', orderID, page);
	}

	/**
	 * Get the list of transactions for a checkout.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
	 *
	 * @example
	 * const checkoutTransactions = await client.getCheckoutTransactions('123');
	 * const checkoutTransactionsNext = await client.getCheckoutTransactions('123', 2);
	 */
	getCheckoutTransactions(checkoutID: string, page?: number) {
		return this._getTransactions('checkout', checkoutID, page);
	}

	/**
	 * Get the list of transactions for a product.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
	 *
	 * @example
	 * const productTransactions = await client.getProductTransactions(123);
	 * const productTransactionsNext = await client.getProductTransactions(123, 2);
	 */
	getProductTransactions(productID: number, page?: number) {
		return this._getTransactions('product', productID, page);
	}

	/**
	 * Verify a webhook alert data using signature and a public key to validate that
	 * it was indeed sent from Paddle.
	 *
	 * For more details: https://paddle.com/docs/reference-verifying-webhooks
	 *
	 * @param postData The object with all the parameters sent to the webhook
	 *
	 * @example
	 * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key', 'your-public-key');
	 *
	 * // inside an Express handler which uses express.bodyParser middleware
	 * const isVerified = client.verifyWebhookData(req.body);
	 */
	verifyWebhookData(
		postData: { p_signature: string } & Record<string, unknown>
	): boolean {
		const signature = postData.p_signature;

		const keys = Object.keys(postData)
			.filter((key) => key !== 'p_signature')
			.sort();

		const sorted: Record<string, unknown> = {};
		keys.forEach((key) => {
			sorted[key] = postData[key];
		});

		// PHP style serialize! :O
		const serialized = serialize(sorted);

		try {
			const verifier = crypto.createVerify('sha1');
			verifier.write(serialized);
			verifier.end();

			return verifier.verify(this.publicKey, signature, 'base64');
		} catch (err) {
			return false;
		}
	}

	/**
	 * Update subscription details, quantity, price and or currency.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/e3872343dfbba-update-user
	 *
	 * @example
	 * const result = await client.updateSubscriptionPlan(123, { quantity: 2 });
	 */
	updateSubscription(
		subscriptionID: number,
		postData: {
			billImmediately?: boolean;
			currency?: string;
			keepModifiers?: boolean;
			pause?: boolean;
			planID?: number;
			prorate?: boolean;
			price?: number;
			quantity?: number;
		}
	) {
		const {
			quantity,
			price,
			planID,
			currency,
			prorate,
			keepModifiers,
			billImmediately,
			pause,
		} = postData;

		const body = {
			subscription_id: subscriptionID,
			...(currency && { currency }),
			...(typeof keepModifiers === 'boolean' && {
				keep_modifiers: keepModifiers,
			}),
			...(typeof billImmediately === 'boolean' && {
				bill_immediately: billImmediately,
			}),
			...(quantity && { quantity }),
			...(typeof pause === 'boolean' && { pause }),
			...(planID && { plan_id: planID }),
			...(price && { recurring_price: price }),
			...(typeof prorate === 'boolean' && { prorate }),
		};

		return this._request<
			UpdateSubscriptionUserResponse,
			UpdateSubscriptionUserBody
		>('/subscription/users/update', {
			body,
		});
	}

	/**
	 * Cancels an active subscription.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/9b808453c3216-cancel-user
	 *
	 * @example
	 * const result = await client.cancelSubscription(123);
	 */
	cancelSubscription(subscriptionID: number) {
		return this._request<boolean>('/subscription/users_cancel', {
			body: { subscription_id: subscriptionID },
		});
	}

	/**
	 * Get the current list of all users or users for a subscription plan.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/e33e0a714a05d-list-users
	 *
	 * @example
	 * const users = await client.getUsers();
	 * const users = await client.getUsers({ planID: 123 });
	 * const users = await client.getUsers({ state: 'active' });
	 * const users = await client.getUsers({ subscriptionID: 456 });
	 *
	 * @note
	 * If you have a large amount of active users, you will need to create paginated calls to this function.
	 */
	getUsers(options?: {
		page?: number;
		resultsPerPage?: number;
		planID?: string | number;
		state?: GetSubscriptionUsersBody['state'];
		subscriptionID?: number;
	}) {
		const {
			page = 1,
			resultsPerPage = 200,
			state = null,
			planID = null,
			subscriptionID = null,
		} = options || {};

		const body = {
			page,
			...(planID && { plan_id: String(planID) }),
			results_per_page: resultsPerPage,
			...(state && { state }),
			...(subscriptionID && { subscription_id: subscriptionID }),
		};

		return this._request<
			GetSubscriptionUsersResponse,
			GetSubscriptionUsersBody
		>('/subscription/users', { body });
	}

	/**
	 * Change the due date of an upcoming subscription payment.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/fe93f28aa7f7e-reschedule-payment
	 *
	 * @example
	 * const result = await client.reschedulePayment(123, new Date('2022-12-04'));
	 */
	reschedulePayment(paymentID: number, date: Date) {
		return this._request<boolean, RescheduleSubscriptionPaymentBody>(
			'/subscription/payments_reschedule',
			{
				body: {
					payment_id: paymentID,
					date: date.toISOString().substring(0, 10),
				},
			}
		);
	}

	/**
	 * Generate a custom pay link.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/3f031a63f6bae-generate-pay-link
	 *
	 * @example
	 * const custom = await client.generatePayLink({
	 *   title: 'my custom checkout',
	 *   custom_message: 'some custom message',
	 *   prices: [
	 *      'USD:19.99',
	 *      'EUR:15.99'
	 *    ]
	 * });
	 */
	generatePayLink(body: GeneratePaylinkBody) {
		return this._request<GeneratePaylinkResponse, GeneratePaylinkBody>(
			'/product/generate_pay_link',
			{
				body,
				form: false,
				json: true,
			}
		);
	}

	/**
	 * Get information about an order after a transaction completes.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/fea392d1e2f4f-get-order-details
	 *
	 * @example
	 * const result = await client.getOrderDetails('219233-chre53d41f940e0-58aqh94971');
	 */
	getOrderDetails(checkoutID: string) {
		return this._request(`/order?checkout_id=${checkoutID}`, {
			checkoutAPI: true,
		});
	}

	/**
	 * Create a subscription modifier to dynamically change the subscription payment amount.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/dc2b0c06f0481-create-modifier
	 *
	 * @example
	 * const result = await client.createSubscriptionModifier(123, 10);
	 * const result = await client.createSubscriptionModifier(123, 10, { recurring: false, description: 'description' });
	 */
	createSubscriptionModifier(
		subscriptionID: number,
		amount: number,
		options?: {
			description?: string;
			recurring?: boolean;
		}
	) {
		const { description, recurring } = options || {};

		const body = {
			subscription_id: subscriptionID,
			modifier_amount: amount,
			...(description && { modifier_description: description }),
			...(typeof recurring === 'boolean' && {
				modifier_recurring: recurring,
			}),
		};

		return this._request<
			CreateSubscriptionModifierResponse,
			CreateSubscriptionModifierBody
		>('/subscription/modifiers/create', {
			body,
		});
	}

	/**
	 * Make an immediate one-off charge on top of an existing user subscription
	 *
	 * API documentation: https://developer.paddle.com/api-reference/23cf86225523f-create-one-off-charge
	 *
	 * @example
	 * const result = await client.createOneOffCharge(123, 10, 'description');
	 */
	createOneOffCharge(
		subscriptionID: number,
		amount: number,
		chargeName: string
	) {
		const body = {
			amount,
			charge_name: chargeName.substring(0, 50),
		};
		return this._request<CreateOneOffChargeResponse, CreateOneOffChargeBody>(
			`/subscription/${subscriptionID}/charge`,
			{
				body,
			}
		);
	}

	/**
	 * Get the used server URL. Some of the requests go to Checkout server, while most will go to Vendor server.
	 */
	serverURL(checkoutAPI = false): string {
		return (
			(this.options && this.options.server) ||
			(checkoutAPI &&
				(this.options && this.options.sandbox
					? CHECKOUT_SANDBOX_URL
					: CHECKOUT_SERVER_URL)) ||
			(this.options && this.options.sandbox
				? VENDOR_SANDBOX_URL
				: VENDOR_SERVER_URL)
		);
	}

	/**
	 * Execute a HTTP request
	 *
	 * @private
	 * @param {string} url - url for the request
	 * @param {object} options
	 * @param {object} [options.body] - body parameters / object
	 * @param {object} [options.headers] - header parameters
	 * @param {boolean} [options.form] - serialize the data object to urlencoded format
	 */
	private async _request<TResponse, TBody extends object = object>(
		path: string,
		{
			body: requestBody,
			headers,
			form = true,
			checkoutAPI = false,
		}: {
			body?: TBody;
			headers?: object;
			form?: boolean;
			json?: boolean;
			checkoutAPI?: boolean;
		} = {}
	): Promise<TResponse> {
		const url = this.serverURL(checkoutAPI) + path;
		// Requests to Checkout API are using only GET,
		const method = checkoutAPI ? 'GET' : 'POST';

		const fullRequestBody = {
			vendor_id: this.vendorID,
			vendor_auth_code: this.apiKey,
			...requestBody,
		};

		const options: AxiosRequestConfig = {
			headers: {
				'User-Agent': `paddle-sdk/${VERSION} (https://github.com/avaly/paddle-sdk)`,
				...(form && { 'Content-Type': 'application/x-www-form-urlencoded' }),
				...(headers || {}),
			},
			method,
		};
		if (method !== 'GET') {
			options.data = fullRequestBody;
		}

		const { data } = await axios<PaddleResponseWrap<TResponse>>(url, options);

		if ('success' in data && typeof data.success === 'boolean') {
			if (data.success) {
				const { response } = data;
				// @ts-expect-error Ignore type error on fallback
				return response || data.success;
			}

			throw new Error(
				`Request ${url} returned an error! response=${JSON.stringify(data)}`
			);
		}

		return data as TResponse;
	}

	/**
	 * @private
	 */
	private _first<TResponse>(response: TResponse[]): TResponse {
		if (Array.isArray(response)) {
			return response[0];
		}
		return response;
	}

	/**
	 * Get the list of transactions for a resource.
	 *
	 * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
	 *
	 * @private
	 */
	private _getTransactions(
		type: 'user' | 'subscription' | 'order' | 'checkout' | 'product',
		id: number | string,
		page?: number
	) {
		return this._request<GetTransactionsResponse>(
			`/${type}/${id}/transactions`,
			page ? { body: { page } } : undefined
		);
	}
}
