import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAlert } from '../../contexts/AlertContext';
import { OrganizationCreationDialog } from './OrganizationCreationDialog';
import { OrganizationMockBuilder } from '../../testUtils/organization';
import { useOrganizations } from '../../contexts/OrganizationProvider';

jest.mock('../../contexts/AlertContext');
jest.mock('../../contexts/OrganizationProvider');
describe('OrganizationCreationDialog', () => {
  const useOrganizationMock = {
    createOrganization: jest.fn(),
  };

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useOrganizations as jest.Mock).mockImplementation(
      () => useOrganizationMock
    );
  });

  it('should call create organization api endpoint on submit', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={onClose}
        closable={true}
      />
    );
    const newOrga = new OrganizationMockBuilder().buildRequestBody();
    await user.type(screen.getByLabelText(/Name/), newOrga.name);
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
    const onClose = jest.fn();
    renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={onClose}
        closable={true}
      />
    );

    await user.click(screen.getByLabelText('Close dialog'));
    await waitFor(() => expect(onClose).toHaveBeenCalledWith());
  });

  it('should not have close icon if closable is false', async () => {
    const setOpen = jest.fn();
    renderWithTheme(
      <OrganizationCreationDialog
        open={true}
        onClose={setOpen}
        closable={false}
      />
    );

    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
  });
});
