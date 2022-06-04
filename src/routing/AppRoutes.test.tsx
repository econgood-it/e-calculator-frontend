import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import AppRoutes from './AppRoutes';
import { useApi } from '../api/ApiContext';

jest.mock('../api/ApiContext');
const apiMock = {
  get: jest.fn(),
};

describe('AppRoutes', () => {
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

  it('renders login if user unauthenticated', () => {
    renderWithTheme(<AppRoutes />, '/');
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders balance sheets overview on root path and if user is authenticated', async () => {
    window.localStorage.setItem('user', JSON.stringify({ token: 'testToken' }));
    renderWithTheme(<AppRoutes />, '/');
    expect(await screen.findByText('hello')).toBeInTheDocument();
  });
});
