import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { BalanceSheetNavigationItem } from './BalanceSheetNavigationItem';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('BalanceSheetNavigationItem', () => {
  const initialPathForRouting = '/organization/3';

  it('navigates to balance sheet when item is clicked', async () => {
    const user = userEvent.setup();
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
            path={`${initialPathForRouting}/balancesheet/2/overview`}
            element={<div>Navigated to balance sheet 2</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.queryByText('Company facts')).not.toBeInTheDocument();
    const balanceSheetsNavButton = await screen.findByText('Balance sheet 2');

    await user.click(balanceSheetsNavButton);

    expect(
      screen.getByText('Navigated to balance sheet 2')
    ).toBeInTheDocument();
  });
});
