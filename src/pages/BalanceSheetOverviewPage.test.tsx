import renderWithTheme from '../testUtils/rendering';
import { useAlert } from '../contexts/AlertContext';
import { BalanceSheetOverviewPage } from './BalanceSheetOverviewPage';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { useApi } from '../contexts/ApiProvider';
import { MatrixMockBuilder } from '../testUtils/matrix';
import { screen, waitFor } from '@testing-library/react';
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";
vi.mock('../contexts/AlertContext');
vi.mock('../contexts/ApiProvider');
vi.mock('../contexts/ActiveBalanceSheetProvider');

describe('BalanceSheetOverviewPage', () => {
  const mockedBalanceSheet = new BalanceSheetMockBuilder().build();
  const apiMock = {
    getBalanceSheetAsMatrix: vi.fn(),
  };
  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({
      addErrorAlert: vi.fn(),
      addSuccessAlert: vi.fn(),
    });
    (useActiveBalanceSheet as Mock).mockReturnValue({
      balanceSheet: mockedBalanceSheet,
    });
    (useApi as Mock).mockImplementation(() => apiMock);
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
