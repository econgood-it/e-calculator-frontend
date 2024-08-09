import renderWithTheme from '../../testUtils/rendering';
import { screen } from '@testing-library/react';
import { useAlert } from '../../contexts/AlertContext';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { v4 as uuid4 } from 'uuid';
import { OrganizationInvitations } from './OrganizationInvitations.tsx';

vi.mock('../../contexts/AlertContext');

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('OrganizationInvitations', () => {
  const invitations = [
    `${uuid4()}@example.com`,
    `${uuid4()}@example.com`,
    `${uuid4()}@example.com`,
  ];

  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
  });

  it('should show invitations in a list', async () => {
    const onInvitation = vi.fn();
    renderWithTheme(
      <OrganizationInvitations
        invitations={invitations}
        onInvitation={onInvitation}
      />
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
    const inviteButton = screen.getByRole('button', { name: /Invite/ });
    await user.click(inviteButton);
    expect(onInvitation).toHaveBeenCalledWith(email);
  });
});
