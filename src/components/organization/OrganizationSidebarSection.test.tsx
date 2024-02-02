import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { OrganizationSidebarSection } from './OrganizationSidebarSection';
import userEvent from '@testing-library/user-event';
import { useAlert } from '../../contexts/AlertContext';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../../testUtils/organization';
import renderWithTheme from '../../testUtils/rendering';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../../contexts/OrganizationProvider');
vi.mock('../../contexts/AlertContext');

describe('OrganizationSidebarSection', () => {
  const setActiveOrganizationByIdMock = vi.fn();

  const activeOrganization = new OrganizationMockBuilder().build();

  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
    (useOrganizations as Mock).mockReturnValue({
      organizationItems: OrganizationItemsMocks.default(),
      activeOrganization: activeOrganization,
      setActiveOrganizationById: setActiveOrganizationByIdMock,
    });
  });

  it('renders organization 3 overview if overview is clicked', async () => {
    const initialPathForRouting = `/organization/${activeOrganization.id}/balancesheet/3`;
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route
            path={initialPathForRouting}
            element={<OrganizationSidebarSection />}
          />
          <Route
            path={`/organization/${activeOrganization.id}`}
            element={<div>Organization overview</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    await user.click(await screen.findByText('Overview'));
    expect(
      await screen.findByText('Organization overview')
    ).toBeInTheDocument();
  });
});
