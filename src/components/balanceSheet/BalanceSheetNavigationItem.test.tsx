import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../testUtils/rendering';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { BalanceSheetNavigationItem } from './BalanceSheetNavigationItem';

describe('BalanceSheetNavigationItem', () => {
  const initialPathForRouting = '/';

  it('renders navigates to balance sheet when item is clicked', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route
            path={initialPathForRouting}
            element={
              <BalanceSheetNavigationItem balanceSheetItem={{ id: 2 }} />
            }
          />
          <Route
            path={'/balancesheets/2'}
            element={<div>Navigated to balance sheet 2</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.queryByText('Company facts')).not.toBeInTheDocument();
    const balanceSheetsNavButton = await screen.findByText('Balance sheet 2');
    await userEvent.click(balanceSheetsNavButton);
    expect(
      screen.getByText('Navigated to balance sheet 2')
    ).toBeInTheDocument();
  });
});
