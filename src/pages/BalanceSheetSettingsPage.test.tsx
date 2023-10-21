import userEvent from '@testing-library/user-event/index';
import renderWithTheme from '../testUtils/rendering';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import BalanceSheetSubNavigation from '../components/balanceSheet/BalanceSheetSubNavigation';
import { screen, waitFor } from '@testing-library/react';
import { useAlert } from '../contexts/AlertContext';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { useApi } from '../contexts/ApiProvider';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { useOrganizations } from '../contexts/OrganizationProvider';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { BalanceSheetSettingsPage } from './BalanceSheetSettingsPage';

jest.mock('../contexts/BalanceSheetListProvider');
jest.mock('../contexts/ActiveBalanceSheetProvider');
describe('BalanceSheetSettingsPage', () => {
  const deleteBalanceSheetMock = jest.fn();
  const mockedBalanceSheet = new BalanceSheetMockBuilder().build();
  beforeEach(() => {
    (useBalanceSheetItems as jest.Mock).mockReturnValue({
      deleteBalanceSheet: deleteBalanceSheetMock,
    });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
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
    await user.click(screen.getByText('Delete this balance sheet'));
    await waitFor(() =>
      expect(deleteBalanceSheetMock).toHaveBeenCalledWith(mockedBalanceSheet.id)
    );
  });
});
