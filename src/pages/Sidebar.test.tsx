import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import Sidebar from './Sidebar';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('Sidebar', () => {
  it('navigates to balancesheets if user clicks on Balance sheets', async () => {
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
});
