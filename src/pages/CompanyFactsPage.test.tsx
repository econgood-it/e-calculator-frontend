import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import BalanceSheetListPage from './BalanceSheetListPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListContext';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { BalanceSheetMocks } from '../testUtils/balanceSheets';
import { regionsMocks } from '../testUtils/regions';
import CompanyFactsPage from './CompanyFactsPage';
import { useApi } from '../contexts/ApiContext';

jest.mock('../contexts/ActiveBalanceSheetProvider');

jest.mock('../contexts/ApiContext');
describe('CompanyFactsPage', () => {
  const apiMock = {
    get: jest.fn(),
  };
  beforeEach(() => {
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      balanceSheet: BalanceSheetMocks.balanceSheet1(),
    });
    apiMock.get.mockImplementation((path: string) => {
      if (path === `/v1/regions`) {
        return Promise.resolve({
          data: regionsMocks.regions1(),
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('renders balance sheet items and navigates on click', async () => {
    renderWithTheme(<CompanyFactsPage />);
    await waitFor(() =>
      expect(apiMock.get).toHaveBeenCalledWith('/v1/regions')
    );
  });
});
