import renderWithTheme from '../testUtils/rendering';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { screen, waitFor, within } from '@testing-library/react';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { BalanceSheetSettingsPage } from './BalanceSheetSettingsPage';
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";


vi.mock('../contexts/BalanceSheetListProvider');
vi.mock('../contexts/ActiveBalanceSheetProvider');
describe('BalanceSheetSettingsPage', () => {
  const deleteBalanceSheetMock = vi.fn();
  const mockedBalanceSheet = new BalanceSheetMockBuilder().build();
  beforeEach(() => {
    (useBalanceSheetItems as Mock).mockReturnValue({
      deleteBalanceSheet: deleteBalanceSheetMock,
    });
    (useActiveBalanceSheet as Mock).mockReturnValue({
      balanceSheet: mockedBalanceSheet,
    });
  });
  const pathToOrganization = `/organization/${3}`;
  it('deletes balance sheet and navigates to organization page', async () => {
    const initialPath = `${pathToOrganization}/balancesheet/2/settings`;
    const router = createMemoryRouter(
      [
        { path: initialPath, element: <BalanceSheetSettingsPage /> },
        {
          path: pathToOrganization,
          element: <div>Navigated to organization page</div>,
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

    await waitFor(() =>
      expect(deleteBalanceSheetMock).toHaveBeenCalledWith(mockedBalanceSheet.id)
    );
  });
});
