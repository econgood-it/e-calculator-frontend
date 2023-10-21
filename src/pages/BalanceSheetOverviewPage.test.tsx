import '@testing-library/jest-dom';
import renderWithTheme from '../testUtils/rendering';
import { useAlert } from '../contexts/AlertContext';
import { BalanceSheetOverviewPage } from './BalanceSheetOverviewPage';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { useApi } from '../contexts/ApiProvider';
import { MatrixMockBuilder } from '../testUtils/matrix';
import { screen, waitFor } from '@testing-library/react';

jest.mock('../contexts/AlertContext');
jest.mock('../contexts/ApiProvider');
jest.mock('../contexts/ActiveBalanceSheetProvider');

describe('BalanceSheetOverviewPage', () => {
  const mockedBalanceSheet = new BalanceSheetMockBuilder().build();
  const apiMock = {
    getBalanceSheetAsMatrix: jest.fn(),
  };
  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({
      addErrorAlert: jest.fn(),
      addSuccessAlert: jest.fn(),
    });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      balanceSheet: mockedBalanceSheet,
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
  });

  it('renders', async () => {
    const mockedMatrix = new MatrixMockBuilder().build();
    apiMock.getBalanceSheetAsMatrix.mockReturnValue(mockedMatrix);
    renderWithTheme(<BalanceSheetOverviewPage />);
    await waitFor(() =>
      expect(apiMock.getBalanceSheetAsMatrix).toHaveBeenCalledWith(
        mockedBalanceSheet.id
      )
    );
    for (const rating of mockedMatrix.ratings) {
      expect(await screen.findByText(rating.shortName)).toBeInTheDocument();
    }
  });
});
