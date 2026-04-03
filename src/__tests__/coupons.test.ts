import { PaddleSDK } from '../sdk.js';
import {
  DEFAULT_ERROR,
  EXPECTED_BODY,
  VENDOR_API_KEY,
  VENDOR_ID,
  SERVER,
} from '../../utils/constants.js';
import fetchMock from '@fetch-mock/jest';
import { expectFormPostBody } from '../../utils/fetchMock.js';

const PATH = `${SERVER}/product/list_coupons`;

describe('coupons methods', () => {
  let instance: PaddleSDK;

  beforeEach(() => {
    instance = new PaddleSDK(VENDOR_ID, VENDOR_API_KEY, '', {
      server: SERVER,
    });
  });

  describe('getProductCoupons', () => {
    const productID = 12345;
    const expectedBody = Object.assign(
      {
        product_id: productID,
      },
      EXPECTED_BODY,
    );

    test('resolves on successful request', async () => {
      // https://paddle.com/docs/api-list-coupons
      const body = {
        success: true,
        response: [
          {
            id: 4227,
            coupon: '56604810a6990',
            description: '56604810a6dcd',
            discount_type: 'percentage',
            discount_amount: 0.5,
            discount_currency: 'USD',
            allowed_uses: 3,
            times_used: 2,
            expires: '2020-12-03 00:00:00',
            product_id: '16970',
          },
        ],
      };

      fetchMock.post(PATH, { status: 200, body });

      const response = await instance.getProductCoupons(productID);

      expect(response).toEqual(body.response);
      expect(fetchMock).toBeDone();
      expect(fetchMock).toHavePosted(PATH);
      expectFormPostBody(PATH, expectedBody);
    });

    test('rejects on error request', async () => {
      fetchMock.post(PATH, {
        status: 400,
        body: DEFAULT_ERROR,
      });

      await expect(instance.getProductCoupons(productID)).rejects.toThrow(
        'Request failed with status code 400',
      );

      expect(fetchMock).toBeDone();
      expect(fetchMock).toHavePosted(PATH);
      expectFormPostBody(PATH, expectedBody);
    });
  });
});
