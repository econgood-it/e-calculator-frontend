import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import BalanceSheetListPage from './BalanceSheetListPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useBalanceSheetItems } from '../contexts/BalanceSheetContext';

jest.mock('../contexts/BalanceSheetContext');

describe('BalanceSheetListPage', () => {
  const initialPathForRouting = '/balancesheets';
  const balanceSheetItems = [{ id: 1 }, { id: 2 }];
  const setBalanceSheetItems = jest.fn();

  beforeEach(() => {
    (useBalanceSheetItems as jest.Mock).mockReturnValue([
      balanceSheetItems,
      setBalanceSheetItems,
    ]);
  });

  it('renders balance sheet items and navigates on click', async () => {
    act(() => {
      renderWithTheme(
        <MemoryRouter initialEntries={[initialPathForRouting]}>
          <Routes>
            <Route
              path={initialPathForRouting}
              element={<BalanceSheetListPage />}
            />
            <Route
              path={`${initialPathForRouting}/2`}
              element={<div>Page of Balance sheet 2</div>}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(await screen.findAllByRole('link')).toHaveLength(2);
    const linkToBalanceSheet2 = screen.getByRole('link', {
      name: 'Balance sheet 2',
    });

    await userEvent.click(linkToBalanceSheet2);

    await waitFor(() =>
      expect(screen.getByText('Page of Balance sheet 2')).toBeInTheDocument()
    );
  });
});
