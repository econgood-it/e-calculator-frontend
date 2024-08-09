import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth } from 'oidc-react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAlert } from '../../contexts/AlertContext';
import { OrganizationMockBuilder } from '../../testUtils/organization';
import renderWithTheme from '../../testUtils/rendering';
import { OrganizationCreationDialog } from './OrganizationCreationDialog';

vi.mock('../../contexts/AlertContext');

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('OrganizationCreationDialog', () => {
  const logoutMock = vi.fn();

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ signOutRedirect: logoutMock });
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
  });

  it('should call create organization api endpoint on submit', async () => {
    const onClose = vi.fn();
    const onCreateClicked = vi.fn();
    const { user } = renderWithTheme(
      <OrganizationCreationDialog
        onCreateClicked={onCreateClicked}
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
    await waitFor(() => expect(onCreateClicked).toHaveBeenCalledWith(newOrga));
    expect(onClose).toHaveBeenCalledWith();
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onCreateClicked = vi.fn();

    renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={onClose}
        onCreateClicked={onCreateClicked}
        fullScreen={false}
      />
    );

    await user.click(screen.getByLabelText('Close dialog'));
    await waitFor(() => expect(onClose).toHaveBeenCalledWith());
  });

  it('should not have close icon if closable is false', async () => {
    const setOpen = vi.fn();
    const onCreateClicked = vi.fn();

    renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={setOpen}
        onCreateClicked={onCreateClicked}
        fullScreen={true}
      />
    );

    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
  });

  it('should open user navigation menu on click', async () => {
    const setOpen = vi.fn();
    const onCreateClicked = vi.fn();

    const { user } = renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={setOpen}
        fullScreen={true}
        onCreateClicked={onCreateClicked}
      />
    );
    const openUserMenu = await screen.findByLabelText(
      'Open user navigation menu'
    );
    await user.click(openUserMenu);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    await user.click(await screen.findByText('Logout'));
    expect(logoutMock).toHaveBeenCalledWith();
  });
});
