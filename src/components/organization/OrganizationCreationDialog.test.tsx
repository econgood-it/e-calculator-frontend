
import renderWithTheme from '../../testUtils/rendering';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAlert } from '../../contexts/AlertContext';
import { OrganizationCreationDialog } from './OrganizationCreationDialog';
import { OrganizationMockBuilder } from '../../testUtils/organization';
import { useOrganizations } from '../../contexts/OrganizationProvider';
import { useAuth } from 'oidc-react';
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";

vi.mock('../../contexts/AlertContext');
vi.mock('../../contexts/OrganizationProvider');

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('OrganizationCreationDialog', () => {
  const useOrganizationMock = {
    createOrganization: vi.fn(),
  };

  const logoutMock = vi.fn();

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ signOutRedirect: logoutMock });
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
    (useOrganizations as Mock).mockImplementation(
      () => useOrganizationMock
    );
  });

  it('should call create organization api endpoint on submit', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={onClose}
        fullScreen={false}
      />
    );
    const newOrga = new OrganizationMockBuilder().buildRequestBody();
    await user.type(screen.getByLabelText(/Organization name/), newOrga.name);
    await user.type(screen.getByLabelText(/City/), newOrga.address.city);
    await user.type(screen.getByLabelText(/Zip/), newOrga.address.zip);
    await user.type(screen.getByLabelText(/Street/), newOrga.address.street);
    await user.type(
      screen.getByLabelText(/House number/),
      newOrga.address.houseNumber
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    await waitFor(() =>
      expect(useOrganizationMock.createOrganization).toHaveBeenCalledWith(
        newOrga
      )
    );
    expect(onClose).toHaveBeenCalledWith();
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={onClose}
        fullScreen={false}
      />
    );

    await user.click(screen.getByLabelText('Close dialog'));
    await waitFor(() => expect(onClose).toHaveBeenCalledWith());
  });

  it('should not have close icon if closable is false', async () => {
    const setOpen = vi.fn();
    renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={setOpen}
        fullScreen={true}
      />
    );

    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
  });

  it('should call logout when logout is clicked', async () => {
    const setOpen = vi.fn();
    const { user } = renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={setOpen}
        fullScreen={true}
      />
    );
    await user.click(screen.getByLabelText('logout'));

    expect(logoutMock).toHaveBeenCalledWith();
  });
});
