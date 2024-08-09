import { describe, expect, it, vi } from 'vitest';

import { setupApiMock } from '../testUtils/api.ts';
import { loader } from './RedirectToActiveOrganization.tsx';

const mockApi = setupApiMock();

vi.mock('../api/api.client.ts', async () => {
  const originalModule = await vi.importActual('../api/api.client.ts');
  return {
    ...originalModule,
    createApiClient: () => mockApi,
  };
});

describe('loaders', () => {
  it('redirects to first organization', async () => {
    mockApi.getOrganizations.mockResolvedValue([
      { id: 7, name: 'organization 1' },
      { id: 2, name: 'organization 2' },
      { id: 3, name: 'organization 3' },
    ]);

    const request = new Request(new URL('http://localhost/'));

    const result = await loader(
      { params: {}, request },
      { userData: { access_token: 'token' } }
    );
    expect(result!.status).toEqual(302);

    expect(result!.headers.get('Location')).toEqual(`organization/7/overview`);
    expect(mockApi.getOrganizations).toHaveBeenCalledWith();
  });

  it('redirects to organization creation page if organizations is empty', async () => {
    mockApi.getOrganizations.mockResolvedValue([]);
    const request = new Request(new URL('http://localhost/'));

    const result = await loader(
      { params: {}, request },
      { userData: { access_token: 'token' } }
    );
    expect(result!.status).toEqual(302);
    expect(result!.headers.get('Location')).toEqual(`organization`);
    expect(mockApi.getOrganizations).toHaveBeenCalledWith();
  });
});
