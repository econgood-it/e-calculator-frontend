import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { useOrganizations } from '../contexts/OrganizationProvider';
import renderWithTheme from '../testUtils/rendering';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from 'oidc-react';

jest.mock('../contexts/OrganizationProvider');

jest.mock('../contexts/AlertContext');

jest.mock('react-router-dom');
jest.mock('oidc-react', () => ({
  useAuth: jest.fn(),
}));

describe('RequireAcitveOrganization', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ signOut: jest.fn() });
  });

  it('shows loading page if active organization is undefined', async () => {
    (useOrganizations as jest.Mock).mockReturnValue({
      organizationItems: [],
      activeOrganization: undefined,
    });
    (useAlert as jest.Mock).mockReturnValue({
      addErrorAlert: jest.fn(),
    });

    renderWithTheme(<RequireActiveOrganization />);
    expect(
      await screen.findByRole('dialog', { name: 'Create organization' })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
  });
});
