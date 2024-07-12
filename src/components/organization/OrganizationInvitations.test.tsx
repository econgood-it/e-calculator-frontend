import renderWithTheme from '../../testUtils/rendering';
import { screen } from '@testing-library/react';
import { useAlert } from '../../contexts/AlertContext';
import { OrganizationMockBuilder } from '../../testUtils/organization';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { v4 as uuid4 } from 'uuid';
import { OrganizationInvitations } from './OrganizationInvitations.tsx';
import { useApi } from '../../contexts/ApiProvider.tsx';

vi.mock('../../contexts/ApiProvider');
vi.mock('../../contexts/AlertContext');
vi.mock('../../contexts/OrganizationProvider');

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('OrganizationInvitations', () => {
  const invitations = [
    `${uuid4()}@example.com`,
    `${uuid4()}@example.com`,
    `${uuid4()}@example.com`,
  ];

  const activeOrganization = {
    ...new OrganizationMockBuilder().build(),
    invitations,
  };
  const apiMock = {
    inviteUserToOrganization: vi.fn(),
    updateActiveOrganization: vi.fn(),
  };

  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
    (useOrganizations as Mock).mockImplementation(() => ({
      activeOrganization,
    }));
    (useApi as Mock).mockReturnValue(apiMock);
  });

  it('should show invitations in a list', async () => {
    renderWithTheme(
      <OrganizationInvitations invitations={invitations} onInvitation={vi.fn} />
    );
    for (const invitation of invitations) {
      expect(screen.getByText(invitation)).toBeInTheDocument();
    }
  });

  it('should invite user via email', async () => {
    const onInvitation = vi.fn();
    const { user } = renderWithTheme(
      <OrganizationInvitations
        invitations={invitations}
        onInvitation={onInvitation}
      />
    );
    const emailField = screen.getByLabelText(/Email/);
    const email = 'user@example.com';
    await user.type(emailField, email);
    expect(emailField).toHaveValue(email);
    const inviteButton = screen.getByRole('button', { name: /Save/ });
    await user.click(inviteButton);
    expect(onInvitation).toHaveBeenCalledWith(email);
  });
});
