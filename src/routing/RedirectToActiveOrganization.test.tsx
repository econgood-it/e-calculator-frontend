import { screen } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import { useOrganizations } from '../contexts/OrganizationProvider';
import { OrganizationMockBuilder } from '../testUtils/organization';
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization';
import { describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../contexts/OrganizationProvider');
describe('RedirectToActiveOrganization', () => {
  it('shows loading page if active organization is undefined', () => {
    (useOrganizations as Mock).mockReturnValue({
      activeOrganization: undefined,
    });
    const router = createMemoryRouter(
      [
        {
          path: `/initial`,
          element: <RedirectToActiveOrganization />,
        },
      ],
      { initialEntries: ['/initial'] }
    );

    renderWithTheme(<RouterProvider router={router} />);
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('redirects to active organization', async () => {
    const activeOrganizationId = 3;
    (useOrganizations as Mock).mockReturnValue({
      activeOrganization: new OrganizationMockBuilder()
        .withId(activeOrganizationId)
        .build(),
    });

    renderWithTheme(
      <MemoryRouter initialEntries={['/initial']}>
        <Routes>
          <Route path={'/initial'} element={<RedirectToActiveOrganization />} />
          <Route
            path={`/organization/${activeOrganizationId}`}
            element={<div>Active organization</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Active organization')).toBeInTheDocument();
  });
});
