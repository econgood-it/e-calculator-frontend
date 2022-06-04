import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import BalanceSheetPage from './BalanceSheetPage';
import { Route, Routes } from 'react-router-dom';

describe('BalanceSheetPage', () => {
  it('renders correct balance sheet', async () => {
    renderWithTheme(
      <Routes>
        <Route
          path="balancesheets/:balancesheetId"
          element={<BalanceSheetPage />}
        />
      </Routes>,
      'balancesheets/2'
    );
    expect(await screen.findByText('Balance Sheet 2')).toBeInTheDocument();
  });
});
