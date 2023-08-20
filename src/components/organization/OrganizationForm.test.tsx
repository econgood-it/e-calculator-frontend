import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { screen, waitFor } from '@testing-library/react';
import { OrganizationForm } from './OrganizationForm';
import { OrganizationMockBuilder } from '../../testUtils/organization';
import userEvent from '@testing-library/user-event';
import { useAlert } from '../../contexts/AlertContext';

jest.mock('../../contexts/AlertContext');

describe('OrganizationForm', () => {
  const addErrorAlert = jest.fn();
  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: addErrorAlert });
  });

  it('should render given organization info', async () => {
    const organization = new OrganizationMockBuilder().buildRequestBody();
    const onSave = jest.fn();
    renderWithTheme(
      <OrganizationForm organization={organization} onSave={onSave} />
    );
    expect(screen.getByLabelText(/City/)).toHaveValue(
      organization.address.city
    );
  });

  it('should update organization on submit', async () => {
    const organization = new OrganizationMockBuilder().buildRequestBody();
    const user = userEvent.setup();
    const onSave = jest.fn();
    renderWithTheme(
      <OrganizationForm organization={organization} onSave={onSave} />
    );

    const cityField = screen.getByLabelText(/City/);
    await user.clear(cityField);
    const newCity = 'The new city';
    await user.type(cityField, newCity);
    expect(cityField).toHaveValue(newCity);

    const streetField = screen.getByLabelText(/Street/);
    await user.clear(streetField);
    const newStreet = 'The new street';
    await user.type(streetField, newStreet);
    expect(streetField).toHaveValue(newStreet);

    const houseNumberField = screen.getByLabelText(/House number/);
    await user.clear(houseNumberField);
    const newHouseNumber = 'The new house number';
    await user.type(houseNumberField, newHouseNumber);
    expect(houseNumberField).toHaveValue(newHouseNumber);

    const zipField = screen.getByLabelText(/Zip/);
    await user.clear(zipField);
    const newZip = 'The new zip';
    await user.type(zipField, newZip);
    expect(zipField).toHaveValue(newZip);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        address: {
          city: newCity,
          street: newStreet,
          houseNumber: newHouseNumber,
          zip: newZip,
        },
      })
    );
  });

  it('should show error message if organization fields invalid', async () => {
    const organization = new OrganizationMockBuilder().buildRequestBody();
    const user = userEvent.setup();
    const onSave = jest.fn();
    renderWithTheme(
      <OrganizationForm organization={organization} onSave={onSave} />
    );
    const cityField = screen.getByLabelText(/City/);
    await user.clear(cityField);
    await waitFor(() =>
      expect(screen.getByText('Must not be blank')).toBeInTheDocument()
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    await waitFor(() => expect(onSave).not.toHaveBeenCalled());
    await waitFor(() =>
      expect(addErrorAlert).toHaveBeenCalledWith(['Form data is invalid'])
    );
  });
});
