import { renderHookWithTheme } from '../testUtils/rendering';
import { useApi } from './ApiProvider';
import {
  BalanceSheetListProvider,
  useBalanceSheetItems,
} from './BalanceSheetListProvider';
import { act, waitFor } from '@testing-library/react';
import { AlertProvider } from './AlertContext';
import { ReactElement } from 'react';
import { useOrganizations } from './OrganizationProvider';
import { OrganizationMockBuilder } from '../testUtils/organization';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../contexts/ApiProvider');
vi.mock('../contexts/OrganizationProvider');

const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
describe('useBalanceSheetItems', () => {
  const apiMock = {
    getBalanceSheets: vi.fn(),
    createBalanceSheet: vi.fn(),
    deleteBalanceSheet: vi.fn(),
  };

  function Wrapper({ children }: { children: ReactElement }) {
    return (
      <AlertProvider>
        <BalanceSheetListProvider>{children}</BalanceSheetListProvider>
      </AlertProvider>
    );
  }

  it('should return empty list of balance sheet items if active organization is undefined', async () => {
    (useOrganizations as Mock).mockReturnValue({
      activeOrganization: undefined,
    });
    (useApi as Mock).mockImplementation(() => apiMock);

    const { result } = renderHookWithTheme(() => useBalanceSheetItems(), {
      wrapper: Wrapper,
    });
    await waitFor(() =>
      expect(apiMock.getBalanceSheets).not.toHaveBeenCalledWith(undefined)
    );
    await waitFor(() => expect(result.current.balanceSheetItems).toEqual([]));
  });

  it('should return balance sheet items of active organization from api', async () => {
    (useOrganizations as Mock).mockReturnValue({
      activeOrganization: new OrganizationMockBuilder().build(),
    });
    const mockedBalanceSheetItems = [{ id: 1 }, { id: 8 }];
    apiMock.getBalanceSheets.mockResolvedValue(mockedBalanceSheetItems);
    (useApi as Mock).mockImplementation(() => apiMock);

    const { result } = renderHookWithTheme(() => useBalanceSheetItems(), {
      wrapper: Wrapper,
    });
    await waitFor(() =>
      expect(apiMock.getBalanceSheets).toHaveBeenCalledWith(
        new OrganizationMockBuilder().build().id
      )
    );
    await waitFor(() =>
      expect(result.current.balanceSheetItems).toEqual(mockedBalanceSheetItems)
    );
  });

  it('should create balance sheet', async () => {
    const activeOrganization = new OrganizationMockBuilder().build();
    (useOrganizations as Mock).mockReturnValue({
      activeOrganization,
    });
    const balanceSheetMockBuilder = new BalanceSheetMockBuilder().withId(999);
    apiMock.createBalanceSheet.mockResolvedValue(
      balanceSheetMockBuilder.build()
    );
    const mockedBalanceSheetItems = [{ id: 1 }, { id: 8 }];
    apiMock.getBalanceSheets.mockResolvedValue(mockedBalanceSheetItems);
    (useApi as Mock).mockImplementation(() => apiMock);

    const { result } = renderHookWithTheme(() => useBalanceSheetItems(), {
      wrapper: Wrapper,
    });
    await waitFor(() =>
      expect(result.current.balanceSheetItems).toEqual(mockedBalanceSheetItems)
    );
    await act(async () => {
      await result.current.createBalanceSheet(
        balanceSheetMockBuilder.buildRequestBody()
      );
    });
    await waitFor(() =>
      expect(apiMock.createBalanceSheet).toHaveBeenCalledWith(
        balanceSheetMockBuilder.buildRequestBody(),
        activeOrganization.id
      )
    );
    await waitFor(() =>
      expect(result.current.balanceSheetItems).toEqual([
        ...mockedBalanceSheetItems,
        { id: balanceSheetMockBuilder.build().id },
      ])
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/organization/${activeOrganization.id}/balancesheet/${
        balanceSheetMockBuilder.build().id
      }/overview`
    );
  });

  it('should delete balance sheet', async () => {
    const activeOrganization = new OrganizationMockBuilder().build();
    (useOrganizations as Mock).mockReturnValue({
      activeOrganization,
    });
    const balanceSheetToDelete = 8;
    const mockedBalanceSheetItems = [{ id: 1 }, { id: balanceSheetToDelete }];
    apiMock.getBalanceSheets.mockResolvedValue(mockedBalanceSheetItems);
    (useApi as Mock).mockImplementation(() => apiMock);
    const { result } = renderHookWithTheme(() => useBalanceSheetItems(), {
      wrapper: Wrapper,
    });
    await waitFor(() =>
      expect(result.current.balanceSheetItems).toEqual(mockedBalanceSheetItems)
    );
    await act(async () => {
      await result.current.deleteBalanceSheet(balanceSheetToDelete);
    });
    await waitFor(() =>
      expect(apiMock.deleteBalanceSheet).toHaveBeenCalledWith(
        balanceSheetToDelete
      )
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/organization/${activeOrganization.id}`
    );
  });
});
