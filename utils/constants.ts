// https://paddle.com/docs/api-errors
export const DEFAULT_ERROR = {
	success: false,
	error: {
		code: 123,
		message: 'Error message.',
	},
};

export const VENDOR_ID = 'test-vendor-id';

export const VENDOR_API_KEY = 'test-vendor-api-key';

export const EXPECTED_BODY = {
	vendor_id: VENDOR_ID,
	vendor_auth_code: VENDOR_API_KEY,
};
