import { AllTheProviders, renderHookWithTheme } from '../testUtils/rendering';
import '@testing-library/jest-dom';
import { useApi } from './ApiContext';
import {
  BalanceSheetListProvider,
  useBalanceSheetItems,
} from './BalanceSheetListContext';
import { waitFor } from '@testing-library/react';
import { AlertProvider } from './AlertContext';
import { ReactElement } from 'react';

jest.mock('../contexts/ApiContext');
describe('useBalanceSheetItems', () => {
  const apiMock = {
    getBalanceSheets: jest.fn(),
  };

  function Wrapper({ children }: { children: ReactElement }) {
    return (
      <AlertProvider>
        <BalanceSheetListProvider>{children}</BalanceSheetListProvider>
      </AlertProvider>
    );
  }

  it('should return balance sheet items from api', async () => {
    const mockedBalanceSheetItems = [{ id: 1 }, { id: 3 }];
    apiMock.getBalanceSheets.mockResolvedValue(mockedBalanceSheetItems);
    (useApi as jest.Mock).mockImplementation(() => apiMock);

    const { result } = renderHookWithTheme(() => useBalanceSheetItems(), {
      wrapper: Wrapper,
    });
    await waitFor(() =>
      expect(apiMock.getBalanceSheets).toHaveBeenCalledWith()
    );
    await waitFor(() =>
      expect(result.current[0]).toEqual(mockedBalanceSheetItems)
    );
  });
});
