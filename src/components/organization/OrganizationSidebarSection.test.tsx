import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAlert } from '../../contexts/AlertContext';
import { OrganizationItemsMocks } from '../../testUtils/organization';
import renderWithTheme from '../../testUtils/rendering';
import { OrganizationSidebarSection } from './OrganizationSidebarSection';

vi.mock('../../contexts/AlertContext');

describe('OrganizationSidebarSection', () => {
  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
  });

  it('renders organization 3 overview if overview is clicked', async () => {
    const initialPathForRouting = `/organization/3/balancesheet/7/overview`;
    const onCreateClicked = vi.fn();

    const router = createMemoryRouter(
      [
        {
          path: initialPathForRouting,
          element: (
            <OrganizationSidebarSection
              onCreateClicked={onCreateClicked}
              activeOrganizationId={3}
              organizationItems={OrganizationItemsMocks.default()}
            />
          ),
        },
        {
          path: `/organization/3/overview`,
          element: <div>Organization overview</div>,
        },
      ],
      { initialEntries: [initialPathForRouting] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Overview'));
    expect(
      await screen.findByText('Organization overview')
    ).toBeInTheDocument();
  });
});
