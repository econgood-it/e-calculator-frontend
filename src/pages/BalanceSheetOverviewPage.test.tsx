import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import BalanceSheetOverviewPage from './BalanceSheetOverviewPage';
import { useApi } from '../contexts/ApiContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../contexts/ApiContext');
const apiMock = {
  get: jest.fn(),
};

describe('BalanceSheetOverviewPage', () => {
  const balanceSheetsJson = [{ id: 1 }, { id: 2 }];
  beforeEach(() => {
    apiMock.get.mockImplementation((path: string) => {
      if (path === `v1/balancesheets`) {
        return Promise.resolve({
          data: balanceSheetsJson,
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('renders balance sheet items and navigates on click', async () => {
    act(() => {
      renderWithTheme(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path={'/'} element={<BalanceSheetOverviewPage />} />
            <Route
              path={'/balancesheets/2'}
              element={<div>Page of Balance sheet 2</div>}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(await screen.findAllByRole('link')).toHaveLength(2);
    await waitFor(() => expect(apiMock.get).toHaveBeenCalled());
    const linkToBalanceSheet2 = screen.getByRole('link', {
      name: 'Balance sheet 2',
    });

    await userEvent.click(linkToBalanceSheet2);

    await waitFor(() =>
      expect(screen.getByText('Page of Balance sheet 2')).toBeInTheDocument()
    );
  });
});
