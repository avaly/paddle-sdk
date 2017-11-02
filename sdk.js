const got = require('got');
const pkg = require('./package.json');

const SERVER_URL = 'https://vendors.paddle.com/api/2.0';

class PaddleSDK {
	/**
	 * @class PaddleSDK
	 * @typicalname client
	 * @param {string} vendorID - The vendor ID for a Paddle account
	 * @param {string} apiKey - The API Key for a Paddle account
	 * @param {object} [options]
	 * @param {string} [options.server=vendors.paddle.com/api/2.0] - The server URL prefix for all requests
	 *
	 * @example
	 * const client = new PaddleSDK('your-unique-api-key-here');
	 */
	constructor(vendorID, apiKey, options) {
		this.vendorID = vendorID || 'MISSING';
		this.apiKey = apiKey || 'MISSING';
		this.server = (options && options.server) || SERVER_URL;
	}

	/**
	 * Execute a HTTP request
	 *
	 * @private
	 * @param {string} url - url to do request
	 * @param {object} body - body parameters / object
	 * @param {object} [headers] - header parameters
	 */
	_request(path, body = {}, headers = this._getDefaultHeaders()) {
		const url = this.server + path;

		const options = {
			body: Object.assign(body, this._getDefaultBody()),
			form: true,
			headers,
			json: true,
			method: 'POST',
		};

		return got(url, options).then(response => {
			const { body } = response;

			let result = body;
			if (result.success && result.response) {
				result = result.response;
			}

			return result;
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
		return this._request('/product/list_coupons', { product_id: productID });
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
		return this._request('/subscription/plans', { product_id: productID });
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
		return this._request('/subscription/users', { plan: planID });
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
		return this._request('/subscription/payments', { plan: planID });
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
}

module.exports = PaddleSDK;
