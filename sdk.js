const crypto = require('crypto');
const got = require('got');

const pkg = require('./package.json');
const serialize = require('./lib/serialize');

const VENDOR_SANDBOX_URL = 'https://sandbox-vendors.paddle.com/api/2.0';
const VENDOR_SERVER_URL = 'https://vendors.paddle.com/api/2.0';

const CHECKOUT_SANDBOX_URL = 'https://sandbox-checkout.paddle.com/api/1.0';
const CHECKOUT_SERVER_URL = 'https://checkout.paddle.com/api/1.0';

class PaddleSDK {
	/**
	 * @class PaddleSDK
	 * @typicalname client
	 * @param {string} vendorID - The vendor ID for a Paddle account
	 * @param {string} apiKey - The API key for a Paddle account
	 * @param {string} [publicKey] - The public key for a Paddle account used to verify webhooks, only required for `verifyWebhookData`
	 * @param {object} [options]
	 * @param {boolean} [options.sandbox=false] - Whether to use the sandbox server URL
	 * @param {string} [options.server=vendors.paddle.com/api/2.0] - The server URL prefix for all requests
	 *
	 * @example
	 * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key');
	 * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key', 'your-public-key');
	 */
	constructor(vendorID, apiKey, publicKey, options) {
		this.vendorID = vendorID || 'MISSING';
		this.apiKey = apiKey || 'MISSING';
		this.publicKey = publicKey || 'MISSING';
		this.options = options;
	}

	/**
	 * Execute a HTTP request
	 *
	 * @private
	 * @param {string} url - url to do request
	 * @param {object} options
	 * @param {object} [options.body] - body parameters / object
	 * @param {object} [options.headers] - header parameters
	 * @param {boolean} [options.form] - form parameter (ref: got package)
	 * @param {boolean} [options.json] - json parameter (ref: got package)
	 */
	_request(
		path,
		{
			body = {},
			headers = {},
			form = true,
			json = false,
			returnFirstItem = false,
			checkoutAPI = false,
		} = {}
	) {
		const url = this._serverURL(checkoutAPI) + path;
		// Requests to Checkout API are using only GET,
		const method = checkoutAPI ? 'GET' : 'POST';
		const fullBody = Object.assign(body, this._getDefaultBody());

		const options = {
			headers: this._getDefaultHeaders(headers),
			method,
		};
		if (method !== 'GET') {
			if (form) {
				options.form = fullBody;
			}
			if (json) {
				options.json = fullBody;
			}
		}
		// console.log('options', options);

		return got(url, options)
			.json()
			.then(body => {
				if (typeof body.success === 'boolean') {
					if (body.success) {
						const response = body.response || body;
						if (returnFirstItem && Array.isArray(response)) {
							return response[0];
						}
						return response;
					}

					throw new Error(
						`Request ${url} returned an error! response=${JSON.stringify(body)}`
					);
				}

				return body;
			});
	}

	_getDefaultBody() {
		return {
			vendor_id: this.vendorID,
			vendor_auth_code: this.apiKey,
		};
	}

	/**
	 * Get the used server URL. Some of the requests go to Checkout server, while most will go to Vendor server.
	 */
	_serverURL(checkoutAPI = false) {
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
	 * Get the list of required headers for an API request
	 *
	 * @private
	 * @param {object} [additionalHeaders={}] - headers object
	 */
	_getDefaultHeaders(additionalHeaders) {
		return Object.assign(
			{
				'User-Agent': `paddle-sdk/${pkg.version} (${pkg.repository.url})`,
			},
			additionalHeaders || {}
		);
	}

	/**
	 * Get the current list of products
	 *
	 * @method
	 * @returns {Promise}
	 * @fulfil {object} - The products list
	 *
	 * @example
	 * const products = await client.getProducts();
	 */
	getProducts() {
		return this._request('/product/get_products');
	}

	/**
	 * Get the current list of coupons for a product
	 *
	 * @method
	 * @param {number} productID
	 * @returns {Promise}
	 * @fulfil {object} - The coupons list
	 *
	 * @example
	 * const coupons = await client.getProductCoupons(123);
	 */
	getProductCoupons(productID) {
		return this._request('/product/list_coupons', {
			body: { product_id: productID },
		});
	}

	/**
	 * Get the current list of all plans or plans for a subscription
	 *
	 * @method
	 * @param {number} [productID]
	 * @returns {Promise}
	 * @fulfil {object} - The plans list
	 *
	 * @example
	 * const plans = await client.getProductPlans();
	 * const plans = await client.getProductPlans(123);
	 */
	getProductPlans(productID) {
		return this._request('/subscription/plans', {
			body: { product_id: productID },
		});
	}

	/**
	 * Get the plan based on its ID
	 *
	 * @method
	 * @param {number} [planId]
	 * @returns {Promise}
	 * @fulfil {object} - The requested plan
	 *
	 * @example
	 * const plan = await client.getProductPlan(123);
	 */
	getProductPlan(planId) {
		return this._request('/subscription/plans', {
			body: { plan: planId },
			returnFirstItem: true,
		});
	}

	/**
	 * Get the current list of all users or users for a subscription plan
	 *
	 * @method
	 * @param {number} [planID]
	 * @returns {Promise}
	 * @fulfil {object} - The users list
	 *
	 * @example
	 * const users = await client.getPlanUsers();
	 * const users = await client.getPlanUsers(123);
	 */
	getPlanUsers(planID) {
		return this._request('/subscription/users', {
			body: planID ? { plan: planID } : {},
		});
	}

	/**
	 * Get the list of all payments or payments for a subscription plan
	 *
	 * @method
	 * @param {number} [planID]
	 * @returns {Promise}
	 * @fulfil {object} - The payments list
	 *
	 * @example
	 * const payments = await client.getPlanPayments();
	 * const payments = await client.getPlanPayments(123);
	 */
	getPlanPayments(planID) {
		return this._request('/subscription/payments', {
			body: { plan: planID },
		});
	}

	/**
	 * Get the list of webhooks history
	 *
	 * @method
	 * @returns {Promise}
	 * @fulfil {object} - The webhooks history list
	 *
	 * @example
	 * const webhooksHistory = await client.getWebhooksHistory();
	 */
	getWebhooksHistory() {
		return this._request('/alert/webhooks');
	}

	/**
	 * Get the list of transations for a resource
	 *
	 * @private
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 */
	_getTransactions(type, id, page) {
		return this._request(
			`/${type}/${id}/transactions`,
			page ? { body: { page } } : undefined
		);
	}

	/**
	 * Get the list of transations for a user
	 *
	 * @method
	 * @param {number} userID
	 * @param {number} [page]
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const userTransactions = await client.getUserTransactions(123);
	 * const userTransactionsNext = await client.getUserTransactions(123, 2);
	 */
	getUserTransactions(userID, page) {
		return this._getTransactions('user', userID, page);
	}

	/**
	 * Get the list of transations for a subscription
	 *
	 * @method
	 * @param {number} subscriptionID
	 * @param {number} [page]
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const subscriptionTransactions = await client.getSubscriptionTransactions(123);
	 * const subscriptionTransactionsNext = await client.getSubscriptionTransactions(123, 2);
	 */
	getSubscriptionTransactions(subscriptionID, page) {
		return this._getTransactions('subscription', subscriptionID, page);
	}
	/**
	 * Get the list of transations for an order
	 *
	 * @method
	 * @param {number} orderID
	 * @param {number} [page]
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const orderTransactions = await client.getOrderTransactions(123);
	 * const orderTransactionsNext = await client.getOrderTransactions(123, 2);
	 */
	getOrderTransactions(orderID, page) {
		return this._getTransactions('order', orderID, page);
	}

	/**
	 * Get the list of transations for a checkout
	 *
	 * @method
	 * @param {number} checkoutID
	 * @param {number} [page]
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const checkoutTransactions = await client.getCheckoutTransactions(123);
	 * const checkoutTransactionsNext = await client.getCheckoutTransactions(123, 2);
	 */
	getCheckoutTransactions(checkoutID, page) {
		return this._getTransactions('checkout', checkoutID, page);
	}

	/**
	 * Verify a webhook alert data using signature and a public key to validate that
	 * it was indeed sent from Paddle.
	 *
	 * For more details: https://paddle.com/docs/reference-verifying-webhooks
	 *
	 * @method
	 * @param  {Object} postData The object with all the parameters sent to the webhook
	 * @return {boolean}
	 *
	 * @example
	 * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key', 'your-public-key');
	 *
	 * // inside an Express handler which uses express.bodyParser middleware
	 * const isVerified = client.verifyWebhookData(req.body);
	 */
	verifyWebhookData(postData) {
		const signature = postData.p_signature;

		const keys = Object.keys(postData)
			.filter(key => key !== 'p_signature')
			.sort();

		const sorted = {};
		keys.forEach(key => {
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
	 * Get subscription details
	 *
	 * @method
	 * @param {number} subscriptionID
	 * @returns {Promise}
	 * @fulfill {object} - Details of a single subscription
	 *
	 * @example
	 * const result = await client.getSubscriptionPlan(123);
	 */
	getSubscriptionPlan(subscriptionID) {
		return this._request('/subscription/users', {
			body: {
				subscription_id: subscriptionID,
			},
			returnFirstItem: true,
		});
	}

	/**
	 * Update (upgrade/downgrade) the plan of a subscription
	 *
	 * @method
	 * @param {number} subscriptionID
	 * @param {number} planID
	 * @param {boolean} prorate
	 * @returns {Promise}
	 * @fulfill {object} - The result of the operation
	 *
	 * @example
	 * const result = await client.updateSubscriptionPlan(123);
	 */
	updateSubscriptionPlan(subscriptionID, planID, prorate = false) {
		return this._request('/subscription/users/update', {
			body: {
				subscription_id: subscriptionID,
				plan_id: planID,
				prorate,
			},
		});
	}

	/**
	 * Update subscription details, quantity, price and or currency
	 *
	 * @method
	 * @param {number} subscriptionID
	 * @param {Object} postData { quantity, price, planID, currency, prorate, keepModifiers, billImmediately }
	 * @returns {Promise}
	 * @fulfill {object} - The result of the operation
	 *
	 * @example
	 * const result = await client.updateSubscriptionPlan(123, { quantity: 2 });
	 */
	updateSubscription(subscriptionID, postData) {
		const {
			quantity,
			price,
			planID,
			currency,
			prorate,
			keepModifiers,
			billImmediately,
		} = postData;
		const body = {
			subscription_id: subscriptionID,
		};
		if (quantity) {
			body.quantity = quantity;
		}
		if (price) {
			body.recurring_price = price;
		}
		if (planID) {
			body.plan_id = planID;
		}
		if (currency) {
			body.currency = currency;
		}
		if (keepModifiers) {
			body.keep_modifiers = keepModifiers;
		}
		if (billImmediately) {
			body.bill_immediately = billImmediately;
		}
		if (prorate) {
			body.prorate = prorate;
		}

		return this._request('/subscription/users/update', {
			body: body,
		});
	}

	/**
	 * Cancels an active subscription
	 *
	 * @method
	 * @param {number} subscriptionID
	 * @returns {Promise}
	 * @fulfil {object} - The result of the operation
	 *
	 * @example
	 * const result = await client.cancelSubscription(123);
	 */
	cancelSubscription(subscriptionID) {
		return this._request('/subscription/users_cancel', {
			body: { subscription_id: subscriptionID },
		});
	}

	/**
	 * Get the list of all users
	 *
	 * @method
	 * @param {Object} options { page, resultsPerPage, state, planId }
	 * @returns {Promise}
	 * @fulfil {object} - The users list
	 *
	 * @example
	 * const users = await client.getUsers();
	 * const users = await client.getUsers({ state: 'active' });
	 *
	 * @note
	 * If you have a large amount of active users, you will need to create paginated calls to this function.
	 */
	getUsers(options = {}) {
		const {
			page = 1,
			resultsPerPage = 200,
			state = null,
			planId = null,
		} = options;

		const body = {
			page,
			results_per_page: resultsPerPage,
		};
		if (state) {
			body.state = state;
		}
		if (planId) {
			body.plan_id = planId;
		}

		return this._request('/subscription/users', { body });
	}

	/**
	 * Generate a custom pay link
	 *
	 * @method
	 * @param {object} body
	 * @returns {Promise}
	 * @fulfil {object} - The new pay link url
	 *
	 * @example
	 * const custom = await client.generatePayLink({
	 *  "title" : "my custom checkout",
	 *  "custom_message" : "some custom message"
	 * 	"prices": [
	 *		"USD:19.99",
	 *		"EUR:15.99"
	 *	 ]
	 *	});
	 */
	generatePayLink(body) {
		return this._request('/product/generate_pay_link', {
			body,
			form: false,
			json: true,
		});
	}

	/**
	 * Get details of Checkout Order
	 *
	 * @method
	 * @param {string} ID of the Checkout order
	 * @returns {Promise}
	 * @fulfil {object} - Details of the Checkout order
	 *
	 * @example
	 * const result = await client.getOrderDetails('219233-chre53d41f940e0-58aqh94971');
	 */
	getOrderDetails(checkoutId) {
		return this._request(`/order?checkout_id=${checkoutId}`, {
			checkoutAPI: true,
		});
	}
}

module.exports = PaddleSDK;
