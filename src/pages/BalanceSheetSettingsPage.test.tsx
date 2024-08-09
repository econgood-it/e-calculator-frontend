import { screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import renderWithTheme from '../testUtils/rendering';
import { action, BalanceSheetSettingsPage } from './BalanceSheetSettingsPage';
import { setupApiMock } from '../testUtils/api.ts';

describe('BalanceSheetSettingsPage', () => {
  it('deletes balance sheet and calls action', async () => {
    const initialPath = `/organization/${3}/balancesheet/2/settings`;
    const action = vi.fn().mockResolvedValue(null);
    const router = createMemoryRouter(
      [
        {
          path: initialPath,
          element: <BalanceSheetSettingsPage />,
          action: async ({ request }) => action(await request.json()),
        },
      ],
      { initialEntries: [initialPath] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(
      screen.getByRole('button', { name: 'Delete this balance sheet' })
    );
    const dialog = await screen.findByRole('dialog', {
      name: 'Delete this balance sheet',
    });
    await user.click(within(dialog).getByRole('button', { name: 'Ok' }));

    expect(action).toHaveBeenCalledWith({
      intent: 'deleteBalanceSheet',
    });
  });
});

const mockApi = setupApiMock();

vi.mock('../api/api.client.ts', async () => {
  const originalModule = await vi.importActual('../api/api.client.ts');
  return {
    ...originalModule,
    createApiClient: () => mockApi,
  };
});

describe('actions', () => {
  it('deletes balance sheet navigates organization overview', async () => {
    mockApi.deleteBalanceSheet.mockResolvedValue({ status: 204 });

    const request = new Request(new URL('http://localhost'), {
      method: 'post',
      body: JSON.stringify({
        intent: 'deleteBalanceSheet',
      }),
    });

    const result = await action(
      { params: { orgaId: '1', balanceSheetId: '3' }, request },
      { userData: { access_token: 'token' } }
    );
    expect(result!.status).toEqual(302);

    expect(result!.headers.get('Location')).toEqual(`/organization/1/overview`);
    expect(mockApi.deleteBalanceSheet).toHaveBeenCalledWith(3);
  });
});
