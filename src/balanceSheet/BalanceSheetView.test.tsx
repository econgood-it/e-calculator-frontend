import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import BalanceSheetView from './BalanceSheetView';
import axios from 'axios';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import { themeOptions } from '../App';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const theme = createTheme(themeOptions);

describe('BalanceSheetView', () => {
  it('renders', async () => {
    const user = {
      token: 'fjdlksajrklejwlqjfkljkl',
      expires: '2022-02-18T14:24:37+01:00',
      user: 3,
    };
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rating: {
          topics: [
            {
              shortName: 'A1',
              name: 'Menschenwürde in der Zulieferkette',
              estimations: 0,
              aspects: [
                {
                  shortName: 'A1.1',
                  name: 'Arbeitsbedingungen und gesellschaftliche Auswirkungen in der Zulieferkette',
                  estimations: 0,
                  isPositive: true,
                },
                {
                  shortName: 'A1.2',
                  name: 'Negativ-Aspekt: Verletzung der Menschenwürde in der Zulieferkette',
                  estimations: 0,
                  isPositive: false,
                },
              ],
            },
          ],
        },
      },
    });
    render(
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <BalanceSheetView balanceSheetId={1} user={user} />
        </ThemeProvider>
      </MuiThemeProvider>
    );
    // screen.debug();
    const el = await waitFor(() => screen.getAllByText('Company Facts'));
    expect(el).toHaveLength(2);
  });
});
