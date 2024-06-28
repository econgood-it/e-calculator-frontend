import { act, screen, waitFor, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { OrganizationOverviewPage } from './OrganizationOverviewPage';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { useOrganizations } from '../contexts/OrganizationProvider';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import { useAlert } from '../contexts/AlertContext';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';

vi.mock('../contexts/OrganizationProvider');
vi.mock('../contexts/BalanceSheetListProvider');
vi.mock('../contexts/AlertContext');
describe('OrganizationOverviewPage', () => {
  const initialPathForRouting = '/organization/3';
  const balanceSheetItems = [{ id: 1 }, { id: 2 }];
  const setBalanceSheetItems = vi.fn();
  const createBalanceSheetMock = vi.fn();

  const updateActiveOrganizationMock = vi.fn();
  const organizationMockBuilder = new OrganizationMockBuilder();

  const addSuccessAlertMock = vi.fn();

  beforeEach(() => {
    (useBalanceSheetItems as Mock).mockReturnValue({
      balanceSheetItems,
      setBalanceSheetItems,
      createBalanceSheet: createBalanceSheetMock,
    });
    (useAlert as Mock).mockReturnValue({
      addErrorAlert: vi.fn(),
      addSuccessAlert: addSuccessAlertMock,
    });
    (useOrganizations as Mock).mockReturnValue({
      organizationItems: OrganizationItemsMocks.default(),
      activeOrganization: organizationMockBuilder.build(),
      setActiveOrganizationById: vi.fn(),
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
        ...organizationMockBuilder.buildRequestBody(),
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
    const router = createMemoryRouter(
      [
        {
          path: initialPathForRouting,
          element: <OrganizationOverviewPage />,
          loader: () => organizationMockBuilder.build(),
        },
        {
          path: `${initialPathForRouting}/balancesheet/2/overview`,
          element: <div>Page of Balance sheet 2</div>,
        },
      ],
      { initialEntries: [initialPathForRouting] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const linkToBalanceSheet2 = await screen.findByLabelText('Balance sheet 2');

    await user.click(linkToBalanceSheet2);

    await waitFor(() =>
      expect(screen.getByText('Page of Balance sheet 2')).toBeInTheDocument()
    );
  });
});
