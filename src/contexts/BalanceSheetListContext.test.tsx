import { renderHookWithTheme } from '../testUtils/rendering';
import '@testing-library/jest-dom';
import { useApi } from './ApiContext';
import {
  BalanceSheetListProvider,
  useBalanceSheetItems,
} from './BalanceSheetListContext';
import { waitFor } from '@testing-library/react';
import { AlertProvider } from './AlertContext';
import { ReactElement } from 'react';
import { useOrganizations } from './OrganizationContext';
import { OrganizationMockBuilder } from '../testUtils/organization';

jest.mock('../contexts/ApiContext');
jest.mock('../contexts/OrganizationContext');
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
    (useOrganizations as jest.Mock).mockReturnValue({
      activeOrganization: undefined,
    });
    const mockedBalanceSheetItems = [{ id: 1 }, { id: 3 }];
    apiMock.getBalanceSheets.mockResolvedValue(mockedBalanceSheetItems);
    (useApi as jest.Mock).mockImplementation(() => apiMock);

    const { result } = renderHookWithTheme(() => useBalanceSheetItems(), {
      wrapper: Wrapper,
    });
    await waitFor(() =>
      expect(apiMock.getBalanceSheets).toHaveBeenCalledWith(undefined)
    );
    await waitFor(() =>
      expect(result.current[0]).toEqual(mockedBalanceSheetItems)
    );
  });

  it('should return balance sheet items of active organization from api', async () => {
    (useOrganizations as jest.Mock).mockReturnValue({
      activeOrganization: new OrganizationMockBuilder().build(),
    });
    const mockedBalanceSheetItems = [{ id: 1 }, { id: 8 }];
    apiMock.getBalanceSheets.mockResolvedValue(mockedBalanceSheetItems);
    (useApi as jest.Mock).mockImplementation(() => apiMock);

    const { result } = renderHookWithTheme(() => useBalanceSheetItems(), {
      wrapper: Wrapper,
    });
    await waitFor(() =>
      expect(apiMock.getBalanceSheets).toHaveBeenCalledWith(
        new OrganizationMockBuilder().build().id
      )
    );
    await waitFor(() =>
      expect(result.current[0]).toEqual(mockedBalanceSheetItems)
    );
  });
});
