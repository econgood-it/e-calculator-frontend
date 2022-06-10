import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RequiresAuth from './RequiresAuth';
import { exampleUser } from '../testUtils/user';

describe('RequiresAuth', () => {
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

  it('navigates to secret page if user info valid', async () => {
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
    expect(screen.getByText('Secret Page')).toBeInTheDocument();
  });
});
