import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import BalanceSheetSubNavigation from './BalanceSheetSubNavigation';
import userEvent from '@testing-library/user-event';
import { useApi } from '../../contexts/ApiContext';
import { useBalanceSheetItems } from '../../contexts/BalanceSheetListContext';
jest.mock('../../contexts/ApiContext');
jest.mock('../../contexts/BalanceSheetListContext');

describe('BalanceSheetSubNavigation', () => {
  const balanceSheetItem = { id: 2 };

  const balanceSheetItems = [{ id: 1 }, { id: 2 }];
  const setBalanceSheetItems = jest.fn();

  const apiMock = {
    deleteBalanceSheet: jest.fn(),
  };
  beforeEach(() => {
    apiMock.deleteBalanceSheet.mockImplementation();
    (useBalanceSheetItems as jest.Mock).mockReturnValue([
      balanceSheetItems,
      setBalanceSheetItems,
    ]);
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('navigates to company facts when Company Facts item is clicked', async () => {
    const initialPathForRouting = '/initial-path';
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route
            path={initialPathForRouting}
            element={
              <BalanceSheetSubNavigation balanceSheetItem={balanceSheetItem} />
            }
          />
          <Route
            path={`/balancesheets/${balanceSheetItem.id}/companyfacts`}
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
    const initialPathForRouting = '/initial-path';
    const user = userEvent.setup();
    const stakeholders = [
      'Suppliers',
      'Financial service providers',
      'Employees',
      'Customers and other companies',
      'Social environment',
    ];

    const ComponentWithRouting = () => (
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route
            path={initialPathForRouting}
            element={
              <BalanceSheetSubNavigation balanceSheetItem={balanceSheetItem} />
            }
          />
          <Route
            path={`/balancesheets/${balanceSheetItem.id}/ratings/suppliers`}
            element={<div>{stakeholders[0]}</div>}
          />
          <Route
            path={`/balancesheets/${balanceSheetItem.id}/ratings/finance`}
            element={<div>{stakeholders[1]}</div>}
          />
          <Route
            path={`/balancesheets/${balanceSheetItem.id}/ratings/employees`}
            element={<div>{stakeholders[2]}</div>}
          />
          <Route
            path={`/balancesheets/${balanceSheetItem.id}/ratings/customers`}
            element={<div>{stakeholders[3]}</div>}
          />
          <Route
            path={`/balancesheets/${balanceSheetItem.id}/ratings/society`}
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

  it('deletes balance sheet and navigates balancesheets list page when user clicks on Delete', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={['/balancesheets/2']}>
        <Routes>
          <Route
            path={'/balancesheets/2'}
            element={
              <BalanceSheetSubNavigation balanceSheetItem={balanceSheetItem} />
            }
          />
          <Route
            path={`/balancesheets`}
            element={<div>Navigated to balancesheets list page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    const deleteButton = await screen.findByText('Delete');

    await user.click(deleteButton);

    expect(apiMock.deleteBalanceSheet).toHaveBeenCalledWith(
      balanceSheetItem.id
    );

    expect(
      screen.getByText('Navigated to balancesheets list page')
    ).toBeInTheDocument();
  });
});
