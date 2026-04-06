import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { PaddleSDK } from '../sdk.ts';

describe('attributes', () => {
  test('default', () => {
    const instance = new PaddleSDK('foo', 'bar');

    assert.strictEqual(instance.vendorID, 'foo');
    assert.strictEqual(instance.apiKey, 'bar');
    assert.strictEqual(instance.publicKey, 'MISSING');
    assert.strictEqual(instance.serverURL(), 'https://vendors.paddle.com/api/2.0');
  });

  test('with public key', () => {
    const instance = new PaddleSDK('foo', 'bar', 'ham');

    assert.strictEqual(instance.vendorID, 'foo');
    assert.strictEqual(instance.apiKey, 'bar');
    assert.strictEqual(instance.publicKey, 'ham');
    assert.strictEqual(instance.serverURL(), 'https://vendors.paddle.com/api/2.0');
  });

  test('with sandbox server URL', () => {
    const instance = new PaddleSDK('foo', 'bar', 'ham', { sandbox: true });

    assert.strictEqual(instance.vendorID, 'foo');
    assert.strictEqual(instance.apiKey, 'bar');
    assert.strictEqual(instance.publicKey, 'ham');
    assert.strictEqual(instance.serverURL(), 'https://sandbox-vendors.paddle.com/api/2.0');
  });

  test('with checkout API server URL v1', () => {
    const instance = new PaddleSDK('foo', 'bar', 'ham');

    assert.strictEqual(instance.vendorID, 'foo');
    assert.strictEqual(instance.apiKey, 'bar');
    assert.strictEqual(instance.publicKey, 'ham');
    assert.strictEqual(instance.serverURL('v1'), 'https://checkout.paddle.com/api/1.0');
  });

  test('with checkout API sandbox server URL v1', () => {
    const instance = new PaddleSDK('foo', 'bar', 'ham', { sandbox: true });

    assert.strictEqual(instance.vendorID, 'foo');
    assert.strictEqual(instance.apiKey, 'bar');
    assert.strictEqual(instance.publicKey, 'ham');
    assert.strictEqual(instance.serverURL('v1'), 'https://sandbox-checkout.paddle.com/api/1.0');
  });

  test('with checkout API server URL v2', () => {
    const instance = new PaddleSDK('foo', 'bar', 'ham');

    assert.strictEqual(instance.vendorID, 'foo');
    assert.strictEqual(instance.apiKey, 'bar');
    assert.strictEqual(instance.publicKey, 'ham');
    assert.strictEqual(instance.serverURL('v2'), 'https://checkout.paddle.com/api/2.0');
  });

  test('with checkout API sandbox server URL v2', () => {
    const instance = new PaddleSDK('foo', 'bar', 'ham', { sandbox: true });

    assert.strictEqual(instance.vendorID, 'foo');
    assert.strictEqual(instance.apiKey, 'bar');
    assert.strictEqual(instance.publicKey, 'ham');
    assert.strictEqual(instance.serverURL('v2'), 'https://sandbox-checkout.paddle.com/api/2.0');
  });

  test('with custom server URL', () => {
    const instance = new PaddleSDK('foo', 'bar', 'ham', {
      server: 'https://custom.paddle.net',
    });

    assert.strictEqual(instance.vendorID, 'foo');
    assert.strictEqual(instance.apiKey, 'bar');
    assert.strictEqual(instance.publicKey, 'ham');
    assert.strictEqual(instance.serverURL(), 'https://custom.paddle.net');
  });
});
