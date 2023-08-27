import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { useOrganizations } from '../contexts/OrganizationContext';
import renderWithTheme from '../testUtils/rendering';
import { RequireActiveOrganization } from './RequireActiveOrganization';
import { useAlert } from '../contexts/AlertContext';

jest.mock('../contexts/OrganizationContext');
jest.mock('../contexts/AlertContext');
describe('RequireAcitveOrganization', () => {
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
