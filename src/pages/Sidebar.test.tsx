import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import Sidebar from './Sidebar';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useApi } from '../contexts/ApiContext';

jest.mock('../contexts/ApiContext');
const apiMock = {
  get: jest.fn(),
  post: jest.fn(),
};

describe('Sidebar', () => {
  const balanceSheetsJson = [{ id: 1 }, { id: 2 }];
  const initialPathForRouting = '/';
  beforeEach(() => {
    apiMock.get.mockImplementation((path: string) => {
      if (path === `/v1/balancesheets`) {
        return Promise.resolve({
          data: balanceSheetsJson,
        });
      }
    });
    apiMock.post.mockImplementation((path: string) => {
      if (path === `/v1/balancesheets`) {
        return Promise.resolve({
          data: { id: 3 },
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('renders Create balance sheet navigation item', async () => {
    await act(async () => {
      await renderWithTheme(
        <MemoryRouter initialEntries={[initialPathForRouting]}>
          <Routes>
            <Route path={initialPathForRouting} element={<Sidebar />} />
          </Routes>
        </MemoryRouter>
      );
    });
    expect(await screen.findByText('Create balance sheet')).toBeInTheDocument();
  });

  it('renders each balance sheet as a navigation item', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route path={initialPathForRouting} element={<Sidebar />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findAllByText(/Balance sheet/)).toHaveLength(2);
    expect(screen.getByText('Balance sheet 1')).toBeInTheDocument();
    expect(screen.getByText('Balance sheet 2')).toBeInTheDocument();
  });

  it('navigates to balance sheet if user click on balance sheet navigation item', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route path={initialPathForRouting} element={<Sidebar />} />
          <Route
            path={'/balancesheets/2'}
            element={<div>Navigated to Balance sheet 2</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(screen.getByText('Balance sheet 2')).toBeInTheDocument()
    );
    const balanceSheetsNavButton = screen.getByRole('link', {
      name: /Balance sheet 2/i,
    });
    await act(async () => {
      await user.click(balanceSheetsNavButton);
    });

    expect(
      screen.getByText('Navigated to Balance sheet 2')
    ).toBeInTheDocument();
  });

  it('creates and navigates to new balance sheet if user clicks on Create balance sheet', async () => {
    await act(async () => {
      await renderWithTheme(
        <MemoryRouter initialEntries={[initialPathForRouting]}>
          <Routes>
            <Route path={initialPathForRouting} element={<Sidebar />} />
            <Route
              path={'/balancesheets/3'}
              element={<div>Navigated to Balance sheet 3</div>}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(apiMock.get).toHaveBeenCalled());
    fireEvent.click(
      screen.getByRole('button', { name: /Create balance sheet/i })
    );
    expect(apiMock.post).toHaveBeenCalled();
    expect(
      await screen.findByText('Navigated to Balance sheet 3')
    ).toBeInTheDocument();
  });
});
