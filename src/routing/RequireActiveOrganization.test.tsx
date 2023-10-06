import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { useOrganizations } from '../contexts/OrganizationProvider';
import renderWithTheme from '../testUtils/rendering';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { useAlert } from '../contexts/AlertContext';
import { useUser } from '../contexts/UserProvider';

jest.mock('../contexts/OrganizationProvider');
jest.mock('../contexts/UserProvider');
jest.mock('../contexts/AlertContext');

jest.mock('react-router-dom');

describe('RequireAcitveOrganization', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ logout: jest.fn() });
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
