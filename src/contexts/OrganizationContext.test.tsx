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
import { useAlert } from './AlertContext';
import { UserMocks } from '../testUtils/user';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('./ApiContext');
jest.mock('./AlertContext');
describe('useOrganizations', () => {
  const apiMock = {
    getOrganizations: jest.fn(),
    getOrganization: jest.fn(),
    createOrganization: jest.fn(),
  };

  beforeEach(() => {
    window.localStorage.clear();
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const storageKey = 'activeOrganizationId';

  const orgaIdFromUrl = 3;

  const user = UserMocks.default();

  function Wrapper({ children }: { children: ReactElement }) {
    return <OrganizationProvider user={user}>{children}</OrganizationProvider>;
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

  function WrapperWithRouter({ children }: { children: ReactElement }) {
    return (
      <MemoryRouter initialEntries={[`/organization/${orgaIdFromUrl}`]}>
        <Routes>
          <Route
            element={
              <OrganizationProvider user={user}>
                {children}
              </OrganizationProvider>
            }
          >
            <Route
              path={'/organization/:orgaId'}
              element={<div>Organization 3</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  }

  it('should prefer organization from url over local storage', async function () {
    const spySetItem = jest.spyOn(window.localStorage, 'setItem');
    const orgaIdInLocalStorage = 7;
    window.localStorage.setItem(
      user.user.toString(),
      JSON.stringify({
        [storageKey]: orgaIdInLocalStorage,
      })
    );
    apiMock.getOrganizations.mockResolvedValue(
      OrganizationItemsMocks.default()
    );
    apiMock.getOrganization.mockImplementation((id) =>
      id === orgaIdFromUrl
        ? new OrganizationMockBuilder().withId(orgaIdFromUrl).build()
        : new OrganizationMockBuilder().withId(orgaIdInLocalStorage).build()
    );
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = await act(async () => {
      return renderHookWithTheme(() => useOrganizations(), {
        wrapper: WrapperWithRouter,
      });
    });

    await waitFor(() =>
      expect(spySetItem).toHaveBeenCalledWith(
        user.user.toString(),
        JSON.stringify({ [storageKey]: orgaIdFromUrl })
      )
    );
    await waitFor(() =>
      expect(apiMock.getOrganization).toHaveBeenCalledWith(orgaIdFromUrl)
    );

    await waitFor(() =>
      expect(result.current.activeOrganization).toEqual(
        new OrganizationMockBuilder().withId(orgaIdFromUrl).build()
      )
    );
  });

  it('should fallback to first organization as active organization', async function () {
    const firstOrgaId = OrganizationItemsMocks.default()[0].id;
    apiMock.getOrganizations.mockResolvedValue(
      OrganizationItemsMocks.default()
    );
    apiMock.getOrganization.mockImplementation((id) =>
      id === firstOrgaId
        ? new OrganizationMockBuilder().withId(firstOrgaId).build()
        : undefined
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
    await waitFor(() =>
      expect(apiMock.getOrganization).toHaveBeenCalledWith(firstOrgaId)
    );

    await waitFor(() =>
      expect(result.current.activeOrganization).toEqual(
        new OrganizationMockBuilder().withId(firstOrgaId).build()
      )
    );
  });

  it('should switch active organization', async function () {
    const spyGetItem = jest.spyOn(window.localStorage, 'getItem');
    const spySetItem = jest.spyOn(window.localStorage, 'setItem');

    window.localStorage.setItem(
      user.user.toString(),
      JSON.stringify({
        [storageKey]: new OrganizationMockBuilder().withId(3).build().id,
      })
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

    expect(spyGetItem).toHaveBeenCalledWith(user.user.toString());
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
      user.user.toString(),
      JSON.stringify({ [storageKey]: new OrganizationMockBuilder().build().id })
    );

    await waitFor(() =>
      expect(result.current.activeOrganization?.id).toEqual(idToSelect)
    );
  });
});
