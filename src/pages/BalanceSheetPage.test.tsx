import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import BalanceSheetPage from './BalanceSheetPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('BalanceSheetPage', () => {
  it('renders correct balance sheet', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/balancesheets/2']}>
        <Routes>
          <Route
            path="/balancesheets/:balancesheetId"
            element={<BalanceSheetPage />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText('Balance Sheet 2')).toBeInTheDocument();
  });
});
