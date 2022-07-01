import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import BalanceSheetSubNavigation from './BalanceSheetSubNavigation';
import userEvent from '@testing-library/user-event';
import { useApi } from '../../contexts/ApiContext';
import { useBalanceSheetItems } from '../../contexts/BalanceSheetContext';
jest.mock('../../contexts/ApiContext');
jest.mock('../../contexts/BalanceSheetContext');

describe('BalanceSheetSubNavigation', () => {
  const balanceSheetItem = { id: 2 };

  const balanceSheetItems = [{ id: 1 }, { id: 2 }];
  const setBalanceSheetItems = jest.fn();

  const apiMock = {
    delete: jest.fn(),
  };
  beforeEach(() => {
    apiMock.delete.mockImplementation((path: string) => {
      if (path === `/v1/balancesheets`) {
        return Promise.resolve();
      }
    });
    (useBalanceSheetItems as jest.Mock).mockReturnValue([
      balanceSheetItems,
      setBalanceSheetItems,
    ]);
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('navigates to company facts when Company Facts item is clicked', async () => {
    const initialPathForRouting = '/balancesheets';
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
            path={`${initialPathForRouting}/${balanceSheetItem.id}/companyfacts`}
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

    expect(apiMock.delete).toHaveBeenCalled();

    expect(
      screen.getByText('Navigated to balancesheets list page')
    ).toBeInTheDocument();
  });
});
