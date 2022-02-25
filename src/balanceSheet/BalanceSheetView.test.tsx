import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import BalanceSheetView from './BalanceSheetView';
import axios from 'axios';
import { renderWithTheme } from '../testUtils/rendering';
import { ratingMock } from '../testUtils/balanceSheets';
import { user } from '../testUtils/user';
import { API_URL } from '../configuration';
import HTMLElement from 'react';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BalanceSheetView', () => {
  const balanceSheetId = 1;
  it('renders text Company Facts', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rating: ratingMock,
      },
    });
    renderWithTheme(
      <BalanceSheetView balanceSheetId={balanceSheetId} user={user} />
    );
    const el = await waitFor(() => screen.getAllByText('Company Facts'));
    expect(el).toHaveLength(2);
  });

  it('should update positive rating and send changes to the backend', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rating: ratingMock,
      },
    });
    mockedAxios.patch.mockResolvedValueOnce({ data: {} });
    renderWithTheme(
      <BalanceSheetView balanceSheetId={balanceSheetId} user={user} />
    );
    const suppliersNavItem = await waitFor(() => screen.getByText('Suppliers'));
    // Update positive rating
    fireEvent.click(suppliersNavItem);
    const star3 = within(
      screen.getByText('A1.1').parentElement as HTMLElement
    ).getByRole('radio', {
      name: '3 Stars',
    });
    expect(star3).not.toBeChecked();
    fireEvent.click(star3);
    expect(star3).toBeChecked();
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Check if changes are sent to backend
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      `${API_URL}/v1/balancesheets/${balanceSheetId}`,
      {
        ratings: [
          {
            shortName: 'A1.1',
            estimations: 3,
          },
          {
            shortName: 'A1.2',
            estimations: 0,
          },
        ],
      },
      expect.anything()
    );
  });

  it('should update negative rating and send changes to the backend', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rating: ratingMock,
      },
    });
    mockedAxios.patch.mockResolvedValueOnce({ data: {} });
    renderWithTheme(
      <BalanceSheetView balanceSheetId={balanceSheetId} user={user} />
    );
    const suppliersNavItem = await waitFor(() => screen.getByText('Suppliers'));
    // Update positive rating
    fireEvent.click(suppliersNavItem);
    const inputField = within(
      screen.getByText('A1.2').parentElement as HTMLElement
    ).getByRole('spinbutton', { name: 'negative-rating-input' });
    fireEvent.change(inputField, { target: { value: '-102' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Check if changes are sent to backend
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      `${API_URL}/v1/balancesheets/${balanceSheetId}`,
      {
        ratings: [
          {
            shortName: 'A1.1',
            estimations: 0,
          },
          {
            shortName: 'A1.2',
            estimations: -102,
          },
        ],
      },
      expect.anything()
    );
  });
});
