import assert from 'node:assert/strict';

import fetchMock from 'fetch-mock';

type HttpMethod = 'GET' | 'POST';

function expectRequest(path: string, method: HttpMethod) {
  const call = fetchMock.callHistory.lastCall(path, { method });

  assert.ok(call, `Expected a ${method} request to ${path}`);

  return call;
}

function normalizeExpectedBody(body: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(body).map(([key, value]) => [key, String(value)]));
}

function expectUserAgent(headers: Headers) {
  assert.match(headers.get('user-agent') ?? '', /paddle-sdk\/\d+/);
}

export function expectGot(path: string) {
  expectRequest(path, 'GET');
}

export function expectPosted(path: string) {
  expectRequest(path, 'POST');
}

export function expectFormPostBody(path: string, expectedBody: Record<string, unknown>) {
  const call = expectRequest(path, 'POST');
  const headers = new Headers(call.options.headers);

  expectUserAgent(headers);
  assert.strictEqual(headers.get('content-type'), 'application/x-www-form-urlencoded');
  assert.deepStrictEqual(
    Object.fromEntries(new URLSearchParams(String(call.options.body)).entries()),
    normalizeExpectedBody(expectedBody),
  );
}

export function expectGetHeaders(path: string) {
  const call = expectRequest(path, 'GET');
  const headers = new Headers(call.options.headers);

  expectUserAgent(headers);
  assert.strictEqual(call.options.body, undefined);
}
