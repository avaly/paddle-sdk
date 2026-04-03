import fetchMock from '@fetch-mock/jest';

function normalizeExpectedBody(body: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(body).map(([key, value]) => [key, String(value)]));
}

function expectUserAgent(headers: Headers) {
  expect(headers.get('user-agent')).toMatch(/paddle-sdk\/\d+/);
}

export function expectFormPostBody(path: string, expectedBody: Record<string, unknown>) {
  const call = fetchMock.callHistory.lastCall(path, { method: 'POST' });
  const headers = new Headers(call?.options.headers);

  expectUserAgent(headers);
  expect(headers.get('content-type')).toBe('application/x-www-form-urlencoded');
  expect(Object.fromEntries(new URLSearchParams(String(call?.options.body)).entries())).toEqual(
    normalizeExpectedBody(expectedBody),
  );
}

export function expectGetHeaders(path: string) {
  const call = fetchMock.callHistory.lastCall(path, { method: 'GET' });
  const headers = new Headers(call?.options.headers);

  expectUserAgent(headers);
  expect(call?.options.body).toBeUndefined();
}
