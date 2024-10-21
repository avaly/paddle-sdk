export interface Product {
	base_price: number;
	currency: string;
	description?: string;
	icon: string;
	id: number;
	name: string;
	sale_price: null;
	screenshots: object[];
}

export interface PaddleResponseError {
	code: number;
	message: string;
}

export type PaddleResponseWrap<TResponse> =
	| {
			success: true;
			response: TResponse;
	  }
	| {
			success: false;
			error: PaddleResponseError;
	  };

export interface GetProductsResponse {
	count: number;
	products: Array<Product>;
	total: number;
}

export interface GetProductCouponsBody {
	product_id: number;
}

export interface ProductCoupon {
	allowed_uses: number;
	coupon: string;
	description: string;
	discount_amount: number;
	discount_currency: string;
	discount_type: string;
	expires: string;
	is_recurring: boolean;
	times_used: number;
}

export type GetProductCouponsResponse = Array<ProductCoupon>;

export interface GetSubscriptionPlansBody {
	plan?: number;
}

export interface SubscriptionPlan {
	billing_period: number;
	billing_type: string;
	id: number;
	initial_price: Record<string, string>;
	name: string;
	recurring_price: Record<string, string>;
	trial_days: number;
}

export type GetSubscriptionPlansResponse = Array<SubscriptionPlan>;

export interface Payment {
	amount: number;
	currency: string;
	date: string;
}

export type SubscriptionUserState =
	| 'active'
	| 'past_due'
	| 'trialing'
	| 'paused'
	| 'deleted';

export interface GetSubscriptionUsersBody {
	page?: number;
	plan_id?: string;
	results_per_page?: number;
	state?: SubscriptionUserState;
	subscription_id?: number;
}

export interface SubscriptionUser {
	subscription_id: number;
	plan_id: number;
	user_id: number;
	user_email: string;
	marketing_consent: boolean;
	update_url: string;
	cancel_url: string;
	state: SubscriptionUserState;
	signup_date: string;
	last_payment: Payment;
	payment_information: {
		payment_method: string;
		card_type: string;
		last_four_digits: string;
		expiry_date: string;
	};
	quantity: number;
	next_payment: Payment;
	paused_at?: string;
	paused_from?: string;
	paused_reason?: string;
}

export type GetSubscriptionUsersResponse = Array<SubscriptionUser>;

export interface GetSubscriptionPaymentsBody {
	plan?: number;
	subscription_id?: number;
	is_paid?: number;
	from?: string;
	to?: string;
	isOneOffCharge?: number;
}

export interface SubscriptionPayment {
	id: number;
	subscription_id: number;
	amount: number;
	currency: string;
	payout_date: string;
	is_paid: number;
	receipt_url: string;
	is_one_off_charge: boolean;
}

export type GetSubscriptionPaymentsResponse = Array<SubscriptionPayment>;

export interface GetWebhookHistoryResponse {
	current_page: number;
	total_pages: number;
	alerts_per_page: number;
	total_alerts: number;
	query_head: string;
	data: Array<{
		id: number;
		alert_id: number;
		alert_name: string;
		status: string;
		created_at: string;
		updated_at: string;
		attempts: number;
		fields: object;
	}>;
	query_tail: string;
}

export interface Transaction {
	order_id: string;
	checkout_id: string;
	amount: string;
	currency: string;
	status: string;
	created_at: string;
	passthrough: string;
	product_id: number;
	is_subscription: boolean;
	is_one_off: boolean;
	subscription: object;
	user: object;
	receipt_url: string;
}

export type GetTransactionsResponse = Array<Transaction>;

export interface UpdateSubscriptionUserBody {
	bill_immediately?: boolean;
	currency?: string;
	keep_modifiers?: boolean;
	passthrough?: string;
	plan_id?: number;
	prorate?: boolean;
	recurring_price?: number;
	subscription_id: number;
}

export interface UpdateSubscriptionUserResponse {
	subscription_id: number;
	user_id: number;
	plan_id: number;
	next_payment: Payment;
}

export interface GetSubscriptionModifiersBody {
	plan_id?: string;
	subscription_id?: string;
}

export interface SubscriptionModifier {
	modifier_id: number;
	subscription_id: number;
	amount: number;
	currency: number;
	is_recurring: boolean;
	description: string;
}

export type GetSubscriptionModifiersResponse = Array<SubscriptionModifier>;

export interface CreateSubscriptionModifierBody {
	modifier_amount: number;
	modifier_description?: string;
	modifier_recurring?: boolean;
	subscription_id: number;
}

export interface DeleteSubscriptionModifierBody {
	modifier_id: number;
}

export interface CreateSubscriptionModifierResponse {
	subscription_id: number;
	modifier_id: number;
}

export interface CreateOneOffChargeBody {
	amount: number;
	charge_name: string;
}

export interface CreateOneOffChargeResponse {
	subscription_id: number;
	invoice_id: number;
	amount: string;
	currency: string;
	payment_date: string;
	receipt_url: string;
	order_id: string;
	status: 'success' | 'pending';
}

export interface RescheduleSubscriptionPaymentBody {
	date: string;
	payment_id: number;
}

export interface GeneratePaylinkBody {
	custom_message?: string;
	customer_country?: string;
	customer_email?: string;
	customer_postcode?: string;
	discountable?: number;
	expires?: string;
	image_url?: string;
	is_recoverable?: number;
	marketing_consent?: number;
	passthrough?: string;
	prices?: Array<string>;
	product_id?: number;
	quantity_variable?: number;
	quantity?: number;
	recurring_prices?: Array<string>;
	return_url?: string;
	title?: string;
	trial_days?: number;
	vat_company_name?: string;
	vat_number?: string;
	webhook_url?: string;
}

export interface GeneratePaylinkResponse {
	url: string;
}

export interface GetPricesResponse {
	customer_country: string;
	products: {
		product_id: number;
		product_title: string;
		currency: string;
		vendor_set_prices_included_tax: boolean;
		price: {
			gross: number;
			net: number;
			tax: number;
		};
		list_price: {
			gross: number;
			net: number;
			tax: number;
		};
		applied_coupon: {
			code: string;
			discount: number;
		};
	}[];
}
