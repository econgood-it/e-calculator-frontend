import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { screen, waitFor } from '@testing-library/react';
import { OrganizationForm } from './OrganizationForm';
import { OrganizationMocks } from '../../testUtils/organization';
import userEvent from '@testing-library/user-event';
import { useAlert } from '../../contexts/AlertContext';

jest.mock('../../contexts/AlertContext');

describe('OrganizationForm', () => {
  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
  });

  it('should render given organization info', async () => {
    const organization = OrganizationMocks.default();
    const onSave = jest.fn();
    renderWithTheme(
      <OrganizationForm organization={organization} onSave={onSave} />
    );
    expect(screen.getByText('Your organization')).toBeInTheDocument();
    expect(screen.getByLabelText(/City/)).toHaveValue(
      organization.address.city
    );
  });

  it('should update organization on submit', async () => {
    const organization = OrganizationMocks.default();
    const user = userEvent.setup();
    const onSave = jest.fn();
    renderWithTheme(
      <OrganizationForm organization={organization} onSave={onSave} />
    );
    expect(screen.getByText('Your organization')).toBeInTheDocument();
    const cityField = screen.getByLabelText(/City/);
    await user.clear(cityField);
    const newCity = 'The new city';
    await user.type(cityField, newCity);
    expect(cityField).toHaveValue(newCity);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        address: { city: newCity },
      })
    );
  });

  it('should show error message if organization fields invalid', async () => {
    const organization = OrganizationMocks.default();
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
  });
});
