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

const PATH = `${SERVER}/subscription/users`;

describe('users methods', () => {
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

  describe('getUsers', () => {
    const expectedBody = {
      ...EXPECTED_BODY,
      page: 1,
      results_per_page: 200,
    };

    test('resolves on successful request', async () => {
      // https://developer.paddle.com/api-reference/e33e0a714a05d-list-users
      const body = {
        success: true,
        response: [
          {
            subscription_id: 502198,
            plan_id: 496199,
            user_id: 285846,
            user_email: 'name@example.com',
            marketing_consent: true,
            update_url:
              'https://subscription-management.paddle.com/subscription/87654321/hash/eyJpdiI6IlU0Nk5cL1JZeHQyTXd.../update',
            cancel_url:
              'https://subscription-management.paddle.com/subscription/87654321/hash/eyJpdiI6IlU0Nk5cL1JZeHQyTXd.../cancel',
            state: 'active',
            signup_date: '2015-10-06 09:44:23',
            last_payment: {
              amount: 5,
              currency: 'USD',
              date: '2015-10-06',
            },
            payment_information: {
              payment_method: 'card',
              card_type: 'visa',
              last_four_digits: '1111',
              expiry_date: '02/2020',
            },
            quantity: 3,
            next_payment: {
              amount: 10,
              currency: 'USD',
              date: '2015-11-06',
            },
          },
        ],
      };

      fetchMock.post(PATH, { status: 200, body });

      const response = await instance.getUsers();

      assert.deepStrictEqual(response, body.response);
      expectFormPostBody(PATH, expectedBody);
    });

    test('rejects on error response', async () => {
      fetchMock.post(PATH, {
        status: 400,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(instance.getUsers(), /Request failed with status code 400/);

      expectFormPostBody(PATH, expectedBody);
    });

    test('rejects on 200 response with error', async () => {
      fetchMock.post(PATH, {
        status: 200,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(
        instance.getUsers(),
        /Request https:\/\/test\.paddle\.com\/subscription\/users returned an error!/,
      );

      expectFormPostBody(PATH, expectedBody);
    });

    test('200 error response includes error information', async () => {
      fetchMock.post(PATH, {
        status: 200,
        body: DEFAULT_ERROR,
      });

      await assert.rejects(instance.getUsers(), {
        paddleCode: DEFAULT_ERROR.error.code,
        paddleMessage: DEFAULT_ERROR.error.message,
      });

      expectFormPostBody(PATH, expectedBody);
    });
  });
});
