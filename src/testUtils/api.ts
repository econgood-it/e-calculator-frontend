import { ApiClient } from '../api/api.client.ts';
import { Mock, vi } from 'vitest';

export function setupApiMock() {
  const methodNames = Object.getOwnPropertyNames(ApiClient.prototype).filter(
    (name) => name !== 'constructor'
  );
  type MockedApiClient = {
    [key in keyof ApiClient]: Mock;
  };
  return methodNames.reduce((acc, methodName) => {
    return {
      ...acc,
      [methodName]: vi.fn().mockImplementation(() => {
        throw new Error('Mock not implemented');
      }),
    };
  }, {}) as MockedApiClient;
}
