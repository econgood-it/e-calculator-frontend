import { screen } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import { RequiresAuth } from './RequiresAuth';
import { useAuth } from 'oidc-react';
import { UserMocks } from '../testUtils/user';
import { describe, expect, it, Mock, vi } from 'vitest';
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization.tsx';

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('RequiresAuth', () => {
  it('shows loading if authorization is loading', async () => {
    (useAuth as Mock).mockReturnValue({ isLoading: true });
    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/secret'} element={<RequiresAuth />}>
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('shows loading if userData is undefined', async () => {
    (useAuth as Mock).mockReturnValue({
      userData: undefined,
    });
    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/secret'} element={<RequiresAuth />}>
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('navigates to secret page if user info valid', async () => {
    (useAuth as Mock).mockReturnValue({
      isLoading: false,
      userData: UserMocks.default(),
    });

    renderWithTheme(
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path={'/secret'} element={<RequiresAuth />}>
            <Route index element={<div>Secret Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Page')).toBeInTheDocument();
  });
});
