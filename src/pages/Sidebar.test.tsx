import { screen, waitFor } from '@testing-library/react';
import { useAuth } from 'oidc-react';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAlert } from '../contexts/AlertContext';
import { useOrganizations } from '../contexts/OrganizationProvider';
import { setupApiMock } from '../testUtils/api';
import { BalanceSheetItemsMockBuilder } from '../testUtils/balanceSheets';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import renderWithTheme from '../testUtils/rendering';
import Sidebar, { action, loader } from './Sidebar';

vi.mock('../contexts/OrganizationProvider');
vi.mock('../contexts/AlertContext');

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('Sidebar', () => {
  const initialPathForRouting = '/organization/3';
  const balanceSheetItems = new BalanceSheetItemsMockBuilder().build();

  const setActiveOrganizationByIdMock = vi.fn();
  const logoutMock = vi.fn();

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({
      signOutRedirect: logoutMock,
    });
    (useAlert as Mock).mockReturnValue({
      addErrorAlert: vi.fn(),
    });
    (useOrganizations as Mock).mockReturnValue({
      setActiveOrganizationById: setActiveOrganizationByIdMock,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders each balance sheet as a navigation item', async () => {
    const path = '/organization/3';
    const router = createMemoryRouter(
      [
        {
          path,
          element: <Sidebar />,
          loader: () => ({
            activeOrganizationId: 3,
            organizationItems: [{ id: 3 }],
            balanceSheetItems: [{ id: 1 }, { id: 2 }],
          }),
        },
      ],
      { initialEntries: [path] }
    );

    renderWithTheme(<RouterProvider router={router} />);
    expect(await screen.findAllByText(/Balance sheet \d/)).toHaveLength(2);
    balanceSheetItems.forEach(async (b) => {
      await waitFor(async () =>
        expect(
          await screen.findByText(`Balance sheet ${b.id}`)
        ).toBeInTheDocument()
      );
    });
  });

  it('navigates to balance sheet if user click on balance sheet navigation item', async () => {
    const path = '/organization/3';
    const router = createMemoryRouter(
      [
        {
          path,
          element: <Sidebar />,
          loader: () => ({
            activeOrganizationId: 3,
            organizationItems: [{ id: 3 }],
            balanceSheetItems: [{ id: 1 }, { id: 3 }],
          }),
          children: [
            {
              path: 'balancesheet/3/overview',
              element: <div>Navigated to Balance sheet 3</div>,
            },
          ],
        },
      ],
      { initialEntries: [path] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const balanceSheetsNavButton = await screen.findByRole('link', {
      name: /Balance sheet 3/i,
    });

    await user.click(balanceSheetsNavButton);

    expect(
      await screen.findByText('Navigated to Balance sheet 3')
    ).toBeInTheDocument();
  });

  it('creates organization and navigates to it clicked', async () => {
    const router = createMemoryRouter(
      [
        {
          path,
          element: <Sidebar />,
          loader: () => ({
            activeOrganizationId: 3,
            organizationItems: [{ id: 3 }],
            balanceSheetItems: [{ id: 1 }, { id: 3 }],
          }),
        },
      ],
      { initialEntries: [path] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(
      screen.getByRole('button', { name: 'Create organization' })
    );
    expect(
      await screen.findByRole('dialog', { name: 'Create organization' })
    ).toBeInTheDocument();
  });

  it('active organization changed if user selects organization from dropdown', async () => {
    const orgaItemToSelect = OrganizationItemsMocks.default()[1];

    const { user } = renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route path={initialPathForRouting} element={<Sidebar />} />
          <Route
            path={`organization/${orgaItemToSelect.id}`}
            element={
              <div>{`Navigated to Organization with id ${orgaItemToSelect.id}`}</div>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(
      await screen.findByText(OrganizationItemsMocks.default()[0].name)
    );

    const options = await screen.findAllByRole('option');

    expect(options.map((o) => o.textContent)).toEqual([
      ...OrganizationItemsMocks.default().map((i) => i.name),
    ]);

    await user.click(
      options.find((o) => o.textContent === orgaItemToSelect.name)!
    );
    await waitFor(() =>
      expect(setActiveOrganizationByIdMock).toHaveBeenCalledWith(
        orgaItemToSelect.id
      )
    );
    expect(
      await screen.findByText(
        `Navigated to Organization with id ${orgaItemToSelect.id}`
      )
    ).toBeInTheDocument();
  });

  it('should logout user if logout button is clicked', async () => {
    const orgaItemToSelect = OrganizationItemsMocks.default()[1];
    const initialPath = `/organization/${orgaItemToSelect.id}`;
    const router = createMemoryRouter(
      [
        {
          path: initialPath,
          element: <Sidebar />,
        },
      ],
      { initialEntries: [initialPath] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(screen.getByLabelText('Open user navigation menu'));
    await user.click(await screen.getByText('Logout'));
    expect(logoutMock).toHaveBeenCalledWith();
  });

  it('should redirect to profile', async () => {
    const orgaItemToSelect = OrganizationItemsMocks.default()[1];
    const initialPath = `/organization/${orgaItemToSelect.id}`;
    const router = createMemoryRouter(
      [
        {
          path: initialPath,
          element: <Sidebar />,
          children: [{ path: 'profile', element: <div>Profile Page</div> }],
        },
      ],
      { initialEntries: [initialPath] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(screen.getByLabelText('Open user navigation menu'));
    await user.click(await screen.getByText('Profile'));
    expect(await screen.findByText('Profile Page')).toBeInTheDocument();
  });
});

const mockApi = setupApiMock();

vi.mock('../api/api.client.ts', async () => {
  const originalModule = await vi.importActual('../api/api.client.ts');
  return {
    ...originalModule,
    createApiClient: () => mockApi,
  };
});

describe('loader', () => {
  it('loads organization and balance sheet items', async () => {
    const organizations = [
      { id: 2, name: 'My new orga name' },
      { id: 9, name: 'Other orga' },
    ];
    mockApi.getOrganizations.mockResolvedValue(organizations);
    const balanceSheets = [{ id: 4 }, { id: 9 }];
    mockApi.getBalanceSheets.mockResolvedValue(balanceSheets);
    const result = await loader(
      {
        params: { orgaId: '3' },
        request: new Request(new URL('http://localhost')),
      },
      { userData: { access_token: 'token' } }
    );
    expect(result).toEqual({
      organizationItems: organizations,
      balanceSheetItems: balanceSheets,
      activeOrganizationId: 3,
    });
    expect(mockApi.getOrganizations).toHaveBeenCalledWith();
    expect(mockApi.getBalanceSheets).toHaveBeenCalledWith(3);
  });
});

describe('actions', () => {
  it('create organization', async () => {
    const organization = new OrganizationMockBuilder().withId(3);
    mockApi.createOrganization.mockResolvedValue(organization.build());

    const request = new Request(new URL('http://localhost'), {
      method: 'post',
      body: JSON.stringify({
        organization: { ...organization.buildRequestBody() },
        intent: 'createOrganization',
      }),
    });

    const result = await action(
      { params: { orgaId: '1' }, request },
      { userData: { access_token: 'token' } }
    );
    expect(result!.status).toEqual(302);

    expect(result!.headers.get('Location')).toEqual(
      `/organization/${organization.build().id}/overview`
    );
    expect(mockApi.createOrganization).toHaveBeenCalledWith(
      organization.buildRequestBody()
    );
  });
});
