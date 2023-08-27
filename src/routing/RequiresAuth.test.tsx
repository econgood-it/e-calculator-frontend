import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RequiresAuth from './RequiresAuth';
import { exampleUser } from '../testUtils/user';
import { useOrganizations } from '../contexts/OrganizationContext';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import { useApi } from '../contexts/ApiContext';

jest.mock('../contexts/ApiContext');

describe('RequiresAuth', () => {
  const apiMock = {
    getOrganizations: jest.fn(),
    getOrganization: jest.fn(),
  };
  beforeEach(() => {
    apiMock.getOrganizations.mockResolvedValue(
      OrganizationItemsMocks.default()
    );
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });
  it('navigates to login if user is not defined', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/login'} element={<div>Login</div>} />
          <Route path={'/secret'} element={<RequiresAuth user={undefined} />}>
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('navigates to login if user token empty', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/login'} element={<div>Login</div>} />
          <Route
            path={'/secret'}
            element={<RequiresAuth user={{ ...exampleUser, token: '' }} />}
          >
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it.skip('navigates to secret page if user info valid', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/login'} element={<div>Login</div>} />
          <Route
            path={'/secret'}
            element={<RequiresAuth user={{ ...exampleUser }} />}
          >
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(apiMock.getOrganizations).toHaveBeenCalledWith()
    );
    expect(screen.getByText('Secret Page')).toBeInTheDocument();
  });
});
