import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../testUtils/rendering';
import BalanceSheetOverviewPage from './BalanceSheetOverviewPage';
import { useApi } from '../api/ApiContext';

jest.mock('../api/ApiContext');
const apiMock = {
  get: jest.fn(),
};

describe('BalanceSheetOverviewPage', () => {
  const balanceSheetsJson = [{ id: 1 }, { id: 2 }];
  beforeEach(() => {
    apiMock.get.mockImplementation((path: string) => {
      if (path === `v1/balancesheets`) {
        return Promise.resolve({
          data: balanceSheetsJson,
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('renders balance sheet items', async () => {
    renderWithTheme(<BalanceSheetOverviewPage />);
    expect(await screen.findAllByRole('link')).toHaveLength(2);
  });
});
