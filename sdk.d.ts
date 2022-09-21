export = PaddleSDK;
declare class PaddleSDK {
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
    constructor(vendorID: string, apiKey: string, publicKey?: string, options?: {
        sandbox?: boolean;
        server?: string;
    });
    vendorID: string;
    apiKey: string;
    publicKey: string;
    options: {
        sandbox?: boolean;
        server?: string;
    };
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
     * Get the used server URL. Some of the requests go to Checkout server, while most will go to Vendor server.
     */
    _serverURL(checkoutAPI?: boolean): string;
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
    getProductPlans(productID?: number): Promise<any>;
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
    getProductPlan(planId?: number): Promise<any>;
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
    getPlanUsers(planID?: number): Promise<any>;
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
    getPlanPayments(planID?: number): Promise<any>;
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
     * @param {number} [page]
     * @returns {Promise}
     * @fulfil {object} - The transations list
     *
     * @example
     * const userTransactions = await client.getUserTransactions(123);
     * const userTransactionsNext = await client.getUserTransactions(123, 2);
     */
    getUserTransactions(userID: number, page?: number): Promise<any>;
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
    getSubscriptionTransactions(subscriptionID: number, page?: number): Promise<any>;
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
    getOrderTransactions(orderID: number, page?: number): Promise<any>;
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
    getCheckoutTransactions(checkoutID: number, page?: number): Promise<any>;
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
    getSubscriptionPlan(subscriptionID: number): Promise<any>;
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
    updateSubscription(subscriptionID: number, postData: any): Promise<any>;
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
    getUsers(options?: any): Promise<any>;
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
    getOrderDetails(checkoutId: any): Promise<any>;
}
