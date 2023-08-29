import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { useOrganizations } from '../contexts/OrganizationProvider';
import { OrganizationMockBuilder } from '../testUtils/organization';
import { RedirectToActiveOrganization } from './RedirectToActiveOrganization';

jest.mock('../contexts/OrganizationProvider');
describe('RedirectToActiveOrganization', () => {
  it('shows loading page if active organization is undefined', () => {
    (useOrganizations as jest.Mock).mockReturnValue({
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
    (useOrganizations as jest.Mock).mockReturnValue({
      activeOrganization: new OrganizationMockBuilder()
        .withId(activeOrganizationId)
        .build(),
    });
    const router = createMemoryRouter(
      [
        {
          path: `/initial`,
          element: <RedirectToActiveOrganization />,
        },
        {
          path: `/organization/${activeOrganizationId}`,
          element: <div>Active organization</div>,
        },
      ],
      { initialEntries: ['/initial'] }
    );

    renderWithTheme(<RouterProvider router={router} />);
    expect(screen.getByText('Active organization')).toBeInTheDocument();
  });
});
