import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import Sidebar from './Sidebar';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useApi } from '../contexts/ApiContext';

jest.mock('../contexts/ApiContext');
const apiMock = {
  get: jest.fn(),
};

describe('Sidebar', () => {
  const balanceSheetsJson = [{ id: 1 }, { id: 2 }];
  beforeEach(() => {
    apiMock.get.mockImplementation((path: string) => {
      if (path === `/v1/balancesheets`) {
        return Promise.resolve({
          data: balanceSheetsJson,
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('renders Create balance sheet navigation item', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path={'/'} element={<Sidebar />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText('Create balance sheet')).toBeInTheDocument();
  });

  it('renders each balance sheet as a navigation item', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path={'/'} element={<Sidebar />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findAllByText(/Balance sheet/)).toHaveLength(2);
    expect(screen.getByText('Balance sheet 1')).toBeInTheDocument();
    expect(screen.getByText('Balance sheet 2')).toBeInTheDocument();
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
