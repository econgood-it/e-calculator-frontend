import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import BalanceSheetView from './BalanceSheetView';
import axios from 'axios';
import { renderWithTheme } from '../testUtils/rendering';
import { ratingMock } from '../testUtils/balanceSheets';
import { user } from '../testUtils/user';
import { API_URL } from '../configuration';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BalanceSheetView', () => {
  it('renders text Company Facts', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rating: ratingMock,
      },
    });
    renderWithTheme(<BalanceSheetView balanceSheetId={1} user={user} />);
    const el = await waitFor(() => screen.getAllByText('Company Facts'));
    expect(el).toHaveLength(2);
  });

  it('calls patch endpoint on save', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rating: ratingMock,
      },
    });
    mockedAxios.patch.mockResolvedValueOnce({ data: {} });

    const balanceSheetId = 1;
    renderWithTheme(
      <BalanceSheetView balanceSheetId={balanceSheetId} user={user} />
    );
    const suppliersNavItem = await waitFor(() => screen.getByText('Suppliers'));
    fireEvent.click(suppliersNavItem);
    expect(screen.getByText('A1.1')).toBeInTheDocument();
    const star3 = screen.getByRole('radio', { name: '3 Stars' });
    // screen.debug(screen.getByLabelText('positive-rating-input'));
    expect(star3).not.toBeChecked();
    fireEvent.click(star3);
    expect(star3).toBeChecked();
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    // TODO: Update topics when changing the ui
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
      }
    );
  });
});
