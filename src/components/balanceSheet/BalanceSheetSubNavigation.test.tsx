import renderWithTheme from '../../testUtils/rendering';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import { screen } from '@testing-library/react';
import BalanceSheetSubNavigation from './BalanceSheetSubNavigation';
import userEvent from '@testing-library/user-event';
import { useBalanceSheetItems } from '../../contexts/BalanceSheetListProvider';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import { OrganizationMockBuilder } from '../../testUtils/organization';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../../contexts/BalanceSheetListProvider');
vi.mock('../../contexts/OrganizationProvider');

describe('BalanceSheetSubNavigation', () => {
  const balanceSheetItem = { id: 2 };

  const balanceSheetItems = [{ id: 1 }, { id: 2 }];
  const setBalanceSheetItems = vi.fn();

  const organizationIdFromUrl = 3;
  const pathToOrganization = `/organization/${3}`;

  beforeEach(() => {
    (useBalanceSheetItems as Mock).mockReturnValue({
      balanceSheetItems,
      setBalanceSheetItems,
    });
    (useOrganizations as Mock).mockReturnValue({
      activeOrganization: new OrganizationMockBuilder()
        .withId(organizationIdFromUrl)
        .build(),
    });
  });

  it('navigates to overview page overview item is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={[pathToOrganization]}>
        <Routes>
          <Route
            path={pathToOrganization}
            element={
              <BalanceSheetSubNavigation balanceSheetItem={balanceSheetItem} />
            }
          />
          <Route
            path={`${pathToOrganization}/balancesheet/${balanceSheetItem.id}/overview`}
            element={<div>Navigated to overview page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    const overviewButton = await screen.findByText('Overview');

    await user.click(overviewButton);

    expect(screen.getByText('Navigated to overview page')).toBeInTheDocument();
  });

  it('navigates to company facts when Company Facts item is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={[pathToOrganization]}>
        <Routes>
          <Route
            path={pathToOrganization}
            element={
              <BalanceSheetSubNavigation balanceSheetItem={balanceSheetItem} />
            }
          />
          <Route
            path={`${pathToOrganization}/balancesheet/${balanceSheetItem.id}/companyfacts`}
            element={<div>Navigated to company facts of balance sheet 2</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    const companyFactsButton = await screen.findByText('Company Facts');

    await user.click(companyFactsButton);

    expect(
      screen.getByText('Navigated to company facts of balance sheet 2')
    ).toBeInTheDocument();
  });

  it('navigates to ratings page of clicked stakeholder', async () => {
    const user = userEvent.setup();
    const stakeholders = [
      'Suppliers',
      'Financial service providers',
      'Employees',
      'Customers and other companies',
      'Social environment',
    ];

    const ComponentWithRouting = () => (
      <MemoryRouter initialEntries={[pathToOrganization]}>
        <Routes>
          <Route
            path={pathToOrganization}
            element={
              <BalanceSheetSubNavigation balanceSheetItem={balanceSheetItem} />
            }
          />
          <Route
            path={`${pathToOrganization}/balancesheet/${balanceSheetItem.id}/ratings/suppliers`}
            element={<div>{stakeholders[0]}</div>}
          />
          <Route
            path={`${pathToOrganization}/balancesheet/${balanceSheetItem.id}/ratings/finance`}
            element={<div>{stakeholders[1]}</div>}
          />
          <Route
            path={`${pathToOrganization}/balancesheet/${balanceSheetItem.id}/ratings/employees`}
            element={<div>{stakeholders[2]}</div>}
          />
          <Route
            path={`${pathToOrganization}/balancesheet/${balanceSheetItem.id}/ratings/customers`}
            element={<div>{stakeholders[3]}</div>}
          />
          <Route
            path={`${pathToOrganization}/balancesheet/${balanceSheetItem.id}/ratings/society`}
            element={<div>{stakeholders[4]}</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    for (const stakeholder of stakeholders) {
      renderWithTheme(<ComponentWithRouting />);
      const ratingButton = await screen.findByText(stakeholder);
      await user.click(ratingButton);
      expect(screen.getByText(stakeholder)).toBeInTheDocument();
    }
  });

  it('navigates to settings page when user clicks on Settings', async () => {
    const user = userEvent.setup();
    const initialPath = pathToOrganization;
    const router = createMemoryRouter(
      [
        {
          path: initialPath,
          element: (
            <BalanceSheetSubNavigation balanceSheetItem={balanceSheetItem} />
          ),
        },
        {
          path: `${initialPath}/balancesheet/2/settings`,
          element: <div>Navigated to settings page</div>,
        },
      ],
      { initialEntries: [initialPath] }
    );
    renderWithTheme(<RouterProvider router={router} />);

    const settingsButton = await screen.findByText('Settings');

    await user.click(settingsButton);

    expect(screen.getByText('Navigated to settings page')).toBeInTheDocument();
  });
});
