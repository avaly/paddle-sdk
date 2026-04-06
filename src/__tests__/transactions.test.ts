import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';

import { PaddleSDK } from '../sdk.ts';
import {
  DEFAULT_ERROR,
  EXPECTED_BODY,
  VENDOR_API_KEY,
  VENDOR_ID,
  SERVER,
} from '../../utils/constants.ts';
import fetchMock from 'fetch-mock';
import { expectFormPostBody } from '../../utils/assertions.ts';

describe('transactions methods', () => {
  let instance: PaddleSDK;

  // https://developer.paddle.com/api-reference/b3A6MzA3NDQ3MjQ-list-transactions#request-parameters
  const RESPONSE = {
    success: true,
    response: [
      {
        order_id: '1042907-384786',
        checkout_id: '4795118-chre895f5cfaf61-4d7dafa9df',
        amount: '5.00',
        currency: 'USD',
        status: 'completed',
        created_at: '2017-01-22 00:38:43',
        passthrough: null,
        product_id: 12345,
        is_subscription: true,
        is_one_off: false,
        subscription: {
          subscription_id: 123456,
          status: 'active',
        },
        user: {
          user_id: 29777,
          email: 'example@paddle.com',
          marketing_consent: true,
        },
        receipt_url:
          'https://my.paddle.com/receipt/1042907-384786/4795118-chre895f5cfaf61-4d7dafa9df',
      },
      {
        order_id: '1042907-384785',
        checkout_id: '4795118-chre895f5cfaf61-4d7dafa9df',
        amount: '5.00',
        currency: 'USD',
        status: 'refunded',
        created_at: '2016-12-07 12:25:09',
        passthrough: null,
        product_id: 12345,
        is_subscription: true,
        is_one_off: true,
        subscription: {
          subscription_id: 123456,
          status: 'active',
        },
        user: {
          user_id: 29777,
          email: 'example@paddle.com',
          marketing_consent: true,
        },
        receipt_url:
          'https://my.paddle.com/receipt/1042907-384785/4795118-chre895f5cfaf61-4d7dafa9df',
      },
    ],
  };

  beforeEach(() => {
    fetchMock.mockGlobal();
    instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
      server: SERVER,
    });
  });

  afterEach(() => {
    fetchMock.hardReset();
  });

  describe('getUserTransactions', () => {
    const PATH = `${SERVER}/user/123/transactions`;

    test('resolves on successful request', async () => {
      fetchMock.post(PATH, { status: 200, body: RESPONSE });

      const response = await instance.getUserTransactions(123);

      assert.deepStrictEqual(response, RESPONSE.response);
      expectFormPostBody(PATH, EXPECTED_BODY);
    });

    test('resolves on paged request', async () => {
      const expectedBody = Object.assign({ page: 2 }, EXPECTED_BODY);
      fetchMock.post(PATH, { status: 200, body: RESPONSE });

      const response = await instance.getUserTransactions(123, 2);

      assert.deepStrictEqual(response, RESPONSE.response);
      expectFormPostBody(PATH, expectedBody);
    });

    test('rejects on error response', async () => {
      fetchMock.post(PATH, {
        status: 400,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(
        instance.getUserTransactions(123),
        /Request failed with status code 400/,
      );

      expectFormPostBody(PATH, EXPECTED_BODY);
    });

    test('rejects on 200 response with error', async () => {
      fetchMock.post(PATH, {
        status: 200,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(
        instance.getUserTransactions(123),
        /Request https:\/\/test\.paddle\.com\/user\/123\/transactions returned an error!/,
      );

      expectFormPostBody(PATH, EXPECTED_BODY);
    });

    test('200 error response includes error information', async () => {
      fetchMock.post(PATH, {
        status: 200,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(instance.getUserTransactions(123), {
        paddleCode: DEFAULT_ERROR.error.code,
        paddleMessage: DEFAULT_ERROR.error.message,
      });

      expectFormPostBody(PATH, EXPECTED_BODY);
    });
  });

  describe('getSubscriptionTransactions', () => {
    const PATH = `${SERVER}/subscription/123/transactions`;

    test('resolves on successful request', async () => {
      fetchMock.post(PATH, { status: 200, body: RESPONSE });

      const response = await instance.getSubscriptionTransactions(123);

      assert.deepStrictEqual(response, RESPONSE.response);
      expectFormPostBody(PATH, EXPECTED_BODY);
    });
  });

  describe('getOrderTransactions', () => {
    const PATH = `${SERVER}/order/123/transactions`;

    test('resolves on successful request', async () => {
      fetchMock.post(PATH, { status: 200, body: RESPONSE });

      const response = await instance.getOrderTransactions(123);

      assert.deepStrictEqual(response, RESPONSE.response);
      expectFormPostBody(PATH, EXPECTED_BODY);
    });
  });

  describe('getCheckoutTransactions', () => {
    const PATH = `${SERVER}/checkout/123/transactions`;

    test('resolves on successful request', async () => {
      fetchMock.post(PATH, { status: 200, body: RESPONSE });

      const response = await instance.getCheckoutTransactions('123');

      assert.deepStrictEqual(response, RESPONSE.response);
      expectFormPostBody(PATH, EXPECTED_BODY);
    });
  });

  describe('getProductTransactions', () => {
    const PATH = `${SERVER}/product/123/transactions`;

    test('resolves on successful request', async () => {
      fetchMock.post(PATH, { status: 200, body: RESPONSE });

      const response = await instance.getProductTransactions(123);

      assert.deepStrictEqual(response, RESPONSE.response);
      expectFormPostBody(PATH, EXPECTED_BODY);
    });
  });
});
