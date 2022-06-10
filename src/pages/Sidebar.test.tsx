import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import Sidebar from './Sidebar';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('Sidebar', () => {
  it('navigates to balancesheets', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path={'/'} element={<Sidebar />} />
          <Route
            path={'/balancesheets'}
            element={<div>Navigated to Balance Sheets</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    const balanceSheetsNavButton = screen.getByText('Balance sheets');
    await userEvent.click(balanceSheetsNavButton);
    expect(screen.getByText('Navigated to Balance Sheets')).toBeInTheDocument();
  });

  it('navigates to company facts of active balance sheet', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/balancesheets/2']}>
        <Routes>
          <Route
            path={'/balancesheets/:balanceSheetId'}
            element={<Sidebar />}
          />
          <Route
            path={'/balancesheets/2/company-facts'}
            element={<div>Navigated to Company Facts</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    const balanceSheetsNavButton = screen.getByText('Company Facts');
    await userEvent.click(balanceSheetsNavButton);
    expect(screen.getByText('Navigated to Company Facts')).toBeInTheDocument();
  });
});
