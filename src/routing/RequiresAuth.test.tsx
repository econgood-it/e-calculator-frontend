import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { UserMocks } from '../testUtils/user';
import { useUser } from '../contexts/UserProvider';
import { RequiresAuth } from './RequiresAuth';

jest.mock('../contexts/UserProvider');

describe('RequiresAuth', () => {
  it('navigates to login if user is not defined', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: undefined });
    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/login'} element={<div>Login</div>} />
          <Route path={'/secret'} element={<RequiresAuth />}>
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('navigates to login if user token empty', async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        ...UserMocks.default(),
        token: '',
      },
    });
    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/login'} element={<div>Login</div>} />
          <Route path={'/secret'} element={<RequiresAuth />}>
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  // TODO: Fix this test + update id in url params after creating organization
  it('navigates to secret page if user info valid', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: UserMocks.default() });

    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/login'} element={<div>Login</div>} />
          <Route path={'/secret'} element={<RequiresAuth />}>
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Page')).toBeInTheDocument();
  });
});
