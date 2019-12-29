const crypto = require('crypto');
const got = require('got');

const pkg = require('./package.json');
const serialize = require('./lib/serialize');

const SERVER_URL = 'https://vendors.paddle.com/api/2.0';

class PaddleSDK {
	/**
	 * @class PaddleSDK
	 * @typicalname client
	 * @param {string} vendorID - The vendor ID for a Paddle account
	 * @param {string} apiKey - The API key for a Paddle account
	 * @param {string} [publicKey] - The public key for a Paddle account used to verify webhooks, only required for `verifyWebhookData`
	 * @param {object} [options]
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
		this.server = (options && options.server) || SERVER_URL;
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
	_request(path, { body = {}, headers = {}, form = true, json = false } = {}) {
		const url = this.server + path;
		const fullBody = Object.assign(body, this._getDefaultBody());

		const options = {
			headers: this._getDefaultHeaders(headers),
			method: 'POST',
		};
		if (form) {
			options.form = fullBody;
		}
		if (json) {
			options.json = fullBody;
		}
		// console.log('options', options);

		return got(url, options)
			.json()
			.then(body => {
				if (typeof body.success === 'boolean') {
					if (body.success) {
						return body.response || body;
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
	 * Get the current list of plans for a subscription
	 *
	 * @method
	 * @param {number} productID
	 * @returns {Promise}
	 * @fulfil {object} - The plans list
	 *
	 * @example
	 * const plans = await client.getProductPlans(123);
	 */
	getProductPlans(productID) {
		return this._request('/subscription/plans', {
			body: { product_id: productID },
		});
	}

	/**
	 * Get the current list of users for a subscription plan
	 *
	 * @method
	 * @param {number} planID
	 * @returns {Promise}
	 * @fulfil {object} - The users list
	 *
	 * @example
	 * const users = await client.getPlanUsers(123);
	 */
	getPlanUsers(planID) {
		return this._request('/subscription/users', {
			body: { plan: planID },
		});
	}

	/**
	 * Get the list of payments for a subscription plan
	 *
	 * @method
	 * @param {number} planID
	 * @returns {Promise}
	 * @fulfil {object} - The payments list
	 *
	 * @example
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
	_getTransactions(type, id) {
		return this._request(`/${type}/${id}/transactions`);
	}

	/**
	 * Get the list of transations for a user
	 *
	 * @method
	 * @param {number} userID
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const userTransactions = await client.getUserTransactions(123);
	 */
	getUserTransactions(userID) {
		return this._getTransactions('users', userID);
	}

	/**
	 * Get the list of transations for a subscription
	 *
	 * @method
	 * @param {number} subscriptionID
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const subscriptionTransactions = await client.getSubscriptionTransactions(123);
	 */
	getSubscriptionTransactions(subscriptionID) {
		return this._getTransactions('subscription', subscriptionID);
	}
	/**
	 * Get the list of transations for an order
	 *
	 * @method
	 * @param {number} orderID
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const orderTransactions = await client.getOrderTransactions(123);
	 */
	getOrderTransactions(orderID) {
		return this._getTransactions('order', orderID);
	}

	/**
	 * Get the list of transations for a checkout
	 *
	 * @method
	 * @param {number} checkoutID
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const checkoutTransactions = await client.getCheckoutTransactions(123);
	 */
	getCheckoutTransactions(checkoutID) {
		return this._getTransactions('checkout', checkoutID);
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
}

module.exports = PaddleSDK;
