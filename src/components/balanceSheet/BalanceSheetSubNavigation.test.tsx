import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import BalanceSheetSubNavigation from './BalanceSheetSubNavigation';
import userEvent from '@testing-library/user-event';

describe('BalanceSheetSubNavigation', () => {
  const initialPathForRouting = '/balancesheets';
  const balanceSheetItem = { id: 2 };
  it('navigates to company facts when Company Facts item is clicked', async () => {
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
});
