import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import BalanceSheetView from './BalanceSheetView';
import axios from 'axios';
import { renderWithTheme } from '../testUtils/rendering';
import { ratingMock } from '../testUtils/balanceSheets';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BalanceSheetView', () => {
  it('renders', async () => {
    const user = {
      token: 'fjdlksajrklejwlqjfkljkl',
      expires: '2022-02-18T14:24:37+01:00',
      user: 3,
    };
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rating: ratingMock,
      },
    });
    renderWithTheme(<BalanceSheetView balanceSheetId={1} user={user} />);
    const el = await waitFor(() => screen.getAllByText('Company Facts'));
    expect(el).toHaveLength(2);
  });
});
