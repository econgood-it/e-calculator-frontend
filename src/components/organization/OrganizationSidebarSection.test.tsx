import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { OrganizationSidebarSection } from './OrganizationSidebarSection';
import userEvent from '@testing-library/user-event';
import { useAlert } from '../../contexts/AlertContext';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../../testUtils/organization';
import renderWithTheme from '../../testUtils/rendering';

jest.mock('../../contexts/OrganizationProvider');
jest.mock('../../contexts/AlertContext');

describe('OrganizationSidebarSection', () => {
  const setActiveOrganizationByIdMock = jest.fn();

  const activeOrganization = new OrganizationMockBuilder().build();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useOrganizations as jest.Mock).mockReturnValue({
      organizationItems: OrganizationItemsMocks.default(),
      activeOrganization: activeOrganization,
      setActiveOrganizationById: setActiveOrganizationByIdMock,
    });
  });

  it('renders organization 3 overview if overview is clicked', async () => {
    const initialPathForRouting = `/organization/${activeOrganization.id}/balancesheet/3`;
    const router = createMemoryRouter(
      [
        {
          path: initialPathForRouting,
          element: <OrganizationSidebarSection />,
        },
        {
          path: `/organization/${activeOrganization.id}`,
          element: <div>Organization overview</div>,
        },
      ],
      { initialEntries: [initialPathForRouting] }
    );
    const user = userEvent.setup();
    renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Overview'));
    expect(
      await screen.findByText('Organization overview')
    ).toBeInTheDocument();
  });
});
