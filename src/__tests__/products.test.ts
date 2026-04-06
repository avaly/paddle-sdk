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

const PATH = `${SERVER}/product/get_products`;

describe('products methods', () => {
  let instance: PaddleSDK;

  beforeEach(() => {
    fetchMock.mockGlobal();
    instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
      server: SERVER,
    });
  });

  afterEach(() => {
    fetchMock.hardReset();
  });

  describe('getProducts', () => {
    test('resolves on successful request', async () => {
      // https://paddle.com/docs/api-list-products
      const body = {
        success: true,
        response: {
          total: 2,
          count: 2,
          products: [
            {
              id: 489171,
              name: 'A Product',
              description: 'A description of the product.',
              base_price: 58,
              sale_price: null,
              screenshots: [],
              icon: 'https://paddle-static.s3.amazonaws.com/email/2013-04-10/og.png',
            },
            {
              id: 489278,
              name: 'Another Product',
              description: null,
              base_price: 39.99,
              sale_price: null,
              screenshots: [],
              icon: 'https://paddle.s3.amazonaws.com/user/91/489278geekbench.png',
            },
          ],
        },
      };

      fetchMock.post(PATH, { status: 200, body });

      const response = await instance.getProducts();

      assert.deepStrictEqual(response, body.response);
      expectFormPostBody(PATH, EXPECTED_BODY);
    });

    test('rejects on error response', async () => {
      fetchMock.post(PATH, {
        status: 400,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(instance.getProducts(), /Request failed with status code 400/);

      expectFormPostBody(PATH, EXPECTED_BODY);
    });

    test('rejects on 200 response with error', async () => {
      fetchMock.post(PATH, {
        status: 200,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(
        instance.getProducts(),
        /Request https:\/\/test\.paddle\.com\/product\/get_products returned an error!/,
      );

      expectFormPostBody(PATH, EXPECTED_BODY);
    });

    test('200 error response includes error information', async () => {
      fetchMock.post(PATH, {
        status: 200,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(instance.getProducts(), {
        paddleCode: DEFAULT_ERROR.error.code,
        paddleMessage: DEFAULT_ERROR.error.message,
      });

      expectFormPostBody(PATH, EXPECTED_BODY);
    });
  });
});
