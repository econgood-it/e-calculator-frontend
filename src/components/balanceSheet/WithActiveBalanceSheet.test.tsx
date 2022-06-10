import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../testUtils/rendering';
import WithActiveBalanceSheet from './WithActiveBalanceSheet';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('WithActiveBalanceSheet', () => {
  it('renders correct balance sheet and setActiveBalanceSheet', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/balancesheets/2']}>
        <Routes>
          <Route
            path="/balancesheets/:balanceSheetId"
            element={<WithActiveBalanceSheet />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText('Balance Sheet 2')).toBeInTheDocument();
  });
});
