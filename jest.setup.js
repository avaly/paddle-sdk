import fetchMock, { manageFetchMockGlobally } from '@fetch-mock/jest';
import { jest } from '@jest/globals';

manageFetchMockGlobally(jest);

beforeEach(() => {
  fetchMock.mockGlobal();
});

afterEach(() => {
  fetchMock.mockRestore();
});
