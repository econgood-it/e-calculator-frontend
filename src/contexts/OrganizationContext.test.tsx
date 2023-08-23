import '@testing-library/jest-dom';
import { OrganizationProvider, useOrganizations } from './OrganizationContext';
import { renderHookWithTheme } from '../testUtils/rendering';
import { useApi } from './ApiContext';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import { act, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';
import { AlertProvider } from './AlertContext';

jest.mock('./ApiContext');
describe('useOrganizations', () => {
  const apiMock = {
    getOrganizations: jest.fn(),
    getOrganization: jest.fn(),
    createOrganization: jest.fn(),
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  function Wrapper({ children }: { children: ReactElement }) {
    return (
      <AlertProvider>
        <OrganizationProvider>{children}</OrganizationProvider>
      </AlertProvider>
    );
  }

  it('should return organizations', async function () {
    apiMock.getOrganizations.mockResolvedValue(
      OrganizationItemsMocks.default()
    );
    const organization = new OrganizationMockBuilder().build();
    apiMock.getOrganization.mockResolvedValue(organization);
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = await act(() => {
      return renderHookWithTheme(() => useOrganizations(), {
        wrapper: Wrapper,
      });
    });

    expect(apiMock.getOrganizations).toHaveBeenCalledWith();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.organizationItems).toEqual(
      OrganizationItemsMocks.default()
    );
  });

  it('should return empty list if organization items empty', async function () {
    apiMock.getOrganizations.mockResolvedValue([]);
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = await act(() => {
      return renderHookWithTheme(() => useOrganizations(), {
        wrapper: Wrapper,
      });
    });
    await waitFor(() =>
      expect(apiMock.getOrganizations).toHaveBeenCalledWith()
    );
    expect(result.current.organizationItems).toEqual([]);
  });

  it('should create organization', async function () {
    const orgaBuilder = new OrganizationMockBuilder();

    apiMock.createOrganization.mockResolvedValue(orgaBuilder.build());
    const initialOrgaItems = [{ id: 10 }];
    apiMock.getOrganizations.mockResolvedValue(initialOrgaItems);
    apiMock.getOrganization.mockResolvedValue(orgaBuilder.build());
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = await act(() => {
      return renderHookWithTheme(() => useOrganizations(), {
        wrapper: Wrapper,
      });
    });
    await act(async () => {
      await result.current.createOrganization(orgaBuilder.buildRequestBody());
    });

    await waitFor(() =>
      expect(apiMock.createOrganization).toHaveBeenCalledWith(
        orgaBuilder.buildRequestBody()
      )
    );

    await waitFor(() =>
      expect(result.current.organizationItems).toEqual([
        ...initialOrgaItems,
        {
          id: orgaBuilder.buildResponseBody().id,
        },
      ])
    );

    await waitFor(() =>
      expect(result.current.activeOrganization?.id).toEqual(
        orgaBuilder.buildResponseBody().id
      )
    );
  });

  it('should switch active organization', async function () {
    const storageKey = 'activeOrganizationId';
    const spyGetItem = jest.spyOn(window.localStorage, 'getItem');
    const spySetItem = jest.spyOn(window.localStorage, 'setItem');
    const spyRemoveItem = jest.spyOn(window.localStorage, 'removeItem');
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(new OrganizationMockBuilder().withId(3).build().id)
    );
    apiMock.getOrganizations.mockResolvedValue(
      OrganizationItemsMocks.default()
    );
    apiMock.getOrganization.mockImplementation((id) =>
      id === 3
        ? new OrganizationMockBuilder().withId(3).build()
        : new OrganizationMockBuilder().build()
    );
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = await act(async () => {
      return renderHookWithTheme(() => useOrganizations(), {
        wrapper: Wrapper,
      });
    });
    await waitFor(() =>
      expect(apiMock.getOrganizations).toHaveBeenCalledWith()
    );

    expect(spyGetItem).toHaveBeenCalledWith(storageKey);
    await waitFor(() =>
      expect(apiMock.getOrganization).toHaveBeenCalledWith(3)
    );

    expect(result.current.activeOrganization).toEqual(
      new OrganizationMockBuilder().withId(3).build()
    );
    const idToSelect = OrganizationItemsMocks.default()[1].id;
    await act(async () => {
      await result.current.setActiveOrganizationById(idToSelect);
    });

    await waitFor(() =>
      expect(apiMock.getOrganization).toHaveBeenCalledWith(idToSelect)
    );
    expect(spySetItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(new OrganizationMockBuilder().build().id)
    );

    await waitFor(() =>
      expect(result.current.activeOrganization?.id).toEqual(idToSelect)
    );
    await act(async () => {
      await result.current.setActiveOrganizationById(undefined);
    });
    expect(spyRemoveItem).toHaveBeenCalledWith(storageKey);

    await waitFor(() =>
      expect(apiMock.getOrganization).not.toHaveBeenLastCalledWith(undefined)
    );

    await waitFor(() =>
      expect(result.current.activeOrganization).toBeUndefined()
    );
  });
});
