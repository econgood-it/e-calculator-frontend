import '@testing-library/jest-dom';
import { act, screen, waitFor, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { OrganizationOverviewPage } from './OrganizationOverviewPage';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { useOrganizations } from '../contexts/OrganizationProvider';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import { useAlert } from '../contexts/AlertContext';
import { z } from 'zod';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';

jest.mock('../contexts/OrganizationProvider');
jest.mock('../contexts/BalanceSheetListProvider');
jest.mock('../contexts/AlertContext');
describe('OrganizationOverviewPage', () => {
  const initialPathForRouting = '/organization/3';
  const balanceSheetItems = [{ id: 1 }, { id: 2 }];
  const setBalanceSheetItems = jest.fn();
  const createBalanceSheetMock = jest.fn();

  const updateActiveOrganizationMock = jest.fn();
  const activeOrganization = new OrganizationMockBuilder().build();

  const addSuccessAlertMock = jest.fn();

  beforeEach(() => {
    (useBalanceSheetItems as jest.Mock).mockReturnValue({
      balanceSheetItems,
      setBalanceSheetItems,
      createBalanceSheet: createBalanceSheetMock,
    });
    (useAlert as jest.Mock).mockReturnValue({
      addErrorAlert: jest.fn(),
      addSuccessAlert: addSuccessAlertMock,
    });
    (useOrganizations as jest.Mock).mockReturnValue({
      organizationItems: OrganizationItemsMocks.default(),
      activeOrganization: activeOrganization,
      setActiveOrganizationById: jest.fn(),
      updateActiveOrganization: updateActiveOrganizationMock,
    });
  });

  it('renders organization form and updates on save', async () => {
    const router = createMemoryRouter(
      [{ path: initialPathForRouting, element: <OrganizationOverviewPage /> }],
      { initialEntries: [initialPathForRouting] }
    );
    const user = userEvent.setup();
    act(() => {
      renderWithTheme(<RouterProvider router={router} />);
    });
    const newName = 'My new orga name';
    const nameField = screen.getByLabelText(/Organization name/);
    await user.clear(nameField);
    await user.type(nameField, newName);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    await waitFor(() =>
      expect(updateActiveOrganizationMock).toHaveBeenCalledWith({
        ..._.omit(activeOrganization, 'id'),
        name: newName,
      })
    );
    expect(addSuccessAlertMock).toHaveBeenCalledWith(['Updated organization']);
  });

  it('adds balance sheet if create balance sheet button is clicked', async () => {
    const router = createMemoryRouter(
      [{ path: initialPathForRouting, element: <OrganizationOverviewPage /> }],
      { initialEntries: [initialPathForRouting] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const createBalanceSheetButton = screen.getByRole('button', {
      name: 'Create balance sheet',
    });

    await user.click(createBalanceSheetButton);

    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Create balance sheet' })
      ).getByRole('button', { name: 'Save' })
    );

    await waitFor(() =>
      expect(createBalanceSheetMock).toHaveBeenCalledWith({
        type: BalanceSheetType.Full,
        version: BalanceSheetVersion.v5_0_8,
      })
    );
  });

  it('renders balance sheet items and navigates on click', async () => {
    act(() => {
      renderWithTheme(
        <MemoryRouter initialEntries={[initialPathForRouting]}>
          <Routes>
            <Route
              path={initialPathForRouting}
              element={<OrganizationOverviewPage />}
            />
            <Route
              path={`${initialPathForRouting}/balancesheet/2/overview`}
              element={<div>Page of Balance sheet 2</div>}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    const linkToBalanceSheet2 = screen.getByLabelText('Balance sheet 2');

    await userEvent.click(linkToBalanceSheet2);

    await waitFor(() =>
      expect(screen.getByText('Page of Balance sheet 2')).toBeInTheDocument()
    );
  });
});
