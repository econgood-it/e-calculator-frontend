
import { screen } from '@testing-library/react';
import { useOrganizations } from '../contexts/OrganizationProvider';
import renderWithTheme from '../testUtils/rendering';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from 'oidc-react';
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";


vi.mock('../contexts/OrganizationProvider');

vi.mock('../contexts/AlertContext');

vi.mock('react-router-dom');
vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('RequireAcitveOrganization', () => {
  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ signOut: vi.fn() });
  });

  it('shows loading page if active organization is undefined', async () => {
    (useOrganizations as Mock).mockReturnValue({
      organizationItems: [],
      activeOrganization: undefined,
    });
    (useAlert as Mock).mockReturnValue({
      addErrorAlert: vi.fn(),
    });

    renderWithTheme(<RequireActiveOrganization />);
    expect(
      await screen.findByRole('dialog', { name: 'Create organization' })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
  });
});
