const PaddleSDK = require('../sdk');

describe('attributes', () => {
	test('default', () => {
		const instance = new PaddleSDK('foo', 'bar');

		expect(instance.vendorID).toBe('foo');
		expect(instance.apiKey).toBe('bar');
		expect(instance.publicKey).toBe('MISSING');
		expect(instance._serverURL()).toBe('https://vendors.paddle.com/api/2.0');
	});

	test('with public key', () => {
		const instance = new PaddleSDK('foo', 'bar', 'ham');

		expect(instance.vendorID).toBe('foo');
		expect(instance.apiKey).toBe('bar');
		expect(instance.publicKey).toBe('ham');
		expect(instance._serverURL()).toBe('https://vendors.paddle.com/api/2.0');
	});

	test('with sandbox server URL', () => {
		const instance = new PaddleSDK('foo', 'bar', 'ham', { sandbox: true });

		expect(instance.vendorID).toBe('foo');
		expect(instance.apiKey).toBe('bar');
		expect(instance.publicKey).toBe('ham');
		expect(instance._serverURL()).toBe(
			'https://sandbox-vendors.paddle.com/api/2.0'
		);
	});

	test('with checkout API server URL', () => {
		const instance = new PaddleSDK('foo', 'bar', 'ham');

		expect(instance.vendorID).toBe('foo');
		expect(instance.apiKey).toBe('bar');
		expect(instance.publicKey).toBe('ham');
		expect(instance._serverURL(true)).toBe(
			'https://checkout.paddle.com/api/1.0'
		);
	});

	test('with checkout API sandbox server URL', () => {
		const instance = new PaddleSDK('foo', 'bar', 'ham', { sandbox: true });

		expect(instance.vendorID).toBe('foo');
		expect(instance.apiKey).toBe('bar');
		expect(instance.publicKey).toBe('ham');
		expect(instance._serverURL(true)).toBe(
			'https://sandbox-checkout.paddle.com/api/1.0'
		);
	});

	test('with custom server URL', () => {
		const instance = new PaddleSDK('foo', 'bar', 'ham', {
			server: 'https://custom.paddle.net',
		});

		expect(instance.vendorID).toBe('foo');
		expect(instance.apiKey).toBe('bar');
		expect(instance.publicKey).toBe('ham');
		expect(instance._serverURL()).toBe('https://custom.paddle.net');
	});
});
