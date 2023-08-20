import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAlert } from '../../contexts/AlertContext';
import { useApi } from '../../contexts/ApiContext';
import { OrganizationCreationDialog } from './OrganizationCreationDialog';
import { OrganizationMockBuilder } from '../../testUtils/organization';
import { useOrganizations } from '../../contexts/OrganizationContext';

jest.mock('../../contexts/AlertContext');
jest.mock('../../contexts/OrganizationContext');
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
    const setOpen = jest.fn();
    renderWithTheme(
      <OrganizationCreationDialog open={true} setOpen={setOpen} />
    );
    const newOrga = new OrganizationMockBuilder().buildRequestBody();
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
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    const setOpen = jest.fn();
    renderWithTheme(
      <OrganizationCreationDialog open={true} setOpen={setOpen} />
    );

    await user.click(screen.getByLabelText('Close dialog'));
    await waitFor(() => expect(setOpen).toHaveBeenCalledWith(false));
  });
});
