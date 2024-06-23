import renderWithTheme from '../../testUtils/rendering';
import { screen } from '@testing-library/react';
import { useAlert } from '../../contexts/AlertContext';
import { OrganizationMockBuilder } from '../../testUtils/organization';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { v4 as uuid4 } from 'uuid';
import { OrganizationInvitations } from './OrganizationInvitations.tsx';

vi.mock('../../contexts/AlertContext');
vi.mock('../../contexts/OrganizationProvider');

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('OrganizationMembers', () => {
  const invitations = [
    `${uuid4()}@example.com`,
    `${uuid4()}@example.com`,
    `${uuid4()}@example.com`,
  ];

  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
    (useOrganizations as Mock).mockImplementation(() => ({
      activeOrganization: {
        ...new OrganizationMockBuilder().build(),
        invitations,
      },
    }));
  });

  it('should show invitations in a list', async () => {
    renderWithTheme(<OrganizationInvitations />);
    for (const invitation of invitations) {
      expect(screen.getByText(invitation)).toBeInTheDocument();
    }
  });
});
