import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import BalanceSheetView from './BalanceSheetView';
import axios from 'axios';
import { renderWithTheme } from '../testUtils/rendering';
import { ratingMock } from '../testUtils/balanceSheets';
import { user } from '../testUtils/user';

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

  it('renders suppliers ratings', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rating: ratingMock,
      },
    });
    renderWithTheme(<BalanceSheetView balanceSheetId={1} user={user} />);
    const suppliersNavItem = await waitFor(() => screen.getByText('Suppliers'));
    fireEvent.click(suppliersNavItem);
    expect(screen.getByText('A1.1')).toBeInTheDocument();
  });
});
