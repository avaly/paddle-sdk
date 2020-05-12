export = PaddleSDK;
declare class PaddleSDK {
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
    constructor(vendorID: string, apiKey: string, publicKey?: string, options?: {
        server?: string;
    });
    vendorID: string;
    apiKey: string;
    publicKey: string;
    server: string;
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
    private _request;
    _getDefaultBody(): {
        vendor_id: string;
        vendor_auth_code: string;
    };
    /**
     * Get the list of required headers for an API request
     *
     * @private
     * @param {object} [additionalHeaders={}] - headers object
     */
    private _getDefaultHeaders;
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
    getProducts(): Promise<any>;
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
    getProductCoupons(productID: number): Promise<any>;
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
    getProductPlans(productID: number): Promise<any>;
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
    getPlanUsers(planID: number): Promise<any>;
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
    getPlanPayments(planID: number): Promise<any>;
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
    getWebhooksHistory(): Promise<any>;
    /**
     * Get the list of transations for a resource
     *
     * @private
     * @returns {Promise}
     * @fulfil {object} - The transations list
     */
    private _getTransactions;
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
    getUserTransactions(userID: number): Promise<any>;
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
    getSubscriptionTransactions(subscriptionID: number): Promise<any>;
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
    getOrderTransactions(orderID: number): Promise<any>;
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
    getCheckoutTransactions(checkoutID: number): Promise<any>;
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
    verifyWebhookData(postData: any): boolean;
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
    updateSubscriptionPlan(subscriptionID: number, planID: number, prorate?: boolean): Promise<any>;
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
    cancelSubscription(subscriptionID: number): Promise<any>;
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
    generatePayLink(body: any): Promise<any>;
}
