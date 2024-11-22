import { screen } from '@testing-library/react';
import { useAuth } from 'oidc-react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { setupApiMock } from '../testUtils/api';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import renderWithTheme from '../testUtils/rendering';
import Sidebar, { action, loader } from './Sidebar';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets.ts';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { UserMocks } from '../testUtils/user.ts';

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('Sidebar', () => {
  const logoutMock = vi.fn();

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({
      signOutRedirect: logoutMock,
      isLoading: false,
      userData: UserMocks.default(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders each balance sheet as a navigation item', async () => {
    const path = '/organization/3/overview';
    const balanceSheetItems = [{ id: 1 }, { id: 2 }];
    const router = createMemoryRouter(
      [
        {
          path,
          element: <Sidebar />,
          loader: () => ({
            activeOrganizationId: 3,
            organizationItems: [{ id: 3 }],
            balanceSheetItems,
          }),
        },
      ],
      { initialEntries: [path] }
    );

    renderWithTheme(<RouterProvider router={router} />);
    expect(await screen.findAllByText(/Balance sheet \d/)).toHaveLength(2);
    for (const b of balanceSheetItems) {
      expect(
        await screen.getByText(`Balance sheet ${b.id}`)
      ).toBeInTheDocument();
    }
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

  it('creates balance sheet and calls action', async () => {
    const path = '/organization/3';
    const action = vi.fn().mockResolvedValue(null);
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
          action: async ({ request }) => action(await request.json()),
        },
      ],
      { initialEntries: [path] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(
      await screen.findByRole('button', {
        name: 'Create balance sheet',
      })
    );
    await user.click(await screen.findByRole('button', { name: 'Save' }));
    expect(action).toHaveBeenCalledWith({
      balanceSheet: {
        type: BalanceSheetType.Full,
        version: BalanceSheetVersion.v5_1_0,
      },
      intent: 'createBalanceSheet',
    });
  });

  it('creates organization and calls action', async () => {
    const path = `/organization/3/overview`;
    const action = vi.fn().mockResolvedValue(null);
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
          action: async ({ request }) => action(await request.json()),
        },
      ],
      { initialEntries: [path] }
    );
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(
      await screen.findByRole('button', { name: 'Create organization' })
    );
    const newOrga = new OrganizationMockBuilder().buildRequestBody();

    await user.type(screen.getByLabelText(/Organization name/), newOrga.name);
    await user.type(screen.getByLabelText(/City/), newOrga.address.city);
    await user.type(screen.getByLabelText(/Zip/), newOrga.address.zip);
    await user.type(screen.getByLabelText(/Street/), newOrga.address.street);
    await user.type(
      screen.getByLabelText(/House number/),
      newOrga.address.houseNumber
    );
    await user.click(screen.getByText('Save'));
    expect(action).toHaveBeenCalledWith({
      organization: newOrga,
      intent: 'createOrganization',
    });
  });

  it('active organization changed if user selects organization from dropdown', async () => {
    const orgaItemToSelect = OrganizationItemsMocks.default()[1];
    const activeOrganizationId = OrganizationItemsMocks.default()[0].id;
    const path = `/organization/${activeOrganizationId}/overview`;
    const action = vi.fn().mockResolvedValue(null);
    const router = createMemoryRouter(
      [
        {
          path,
          element: <Sidebar />,
          loader: () => ({
            activeOrganizationId,
            organizationItems: OrganizationItemsMocks.default(),
            balanceSheetItems: [{ id: 1 }, { id: 3 }],
          }),
          action: async ({ request }) => action(await request.json()),
        },
        {
          path: `/organization/${orgaItemToSelect.id}/overview`,
          element: (
            <div>{`Navigated to Organization with id ${orgaItemToSelect.id}`}</div>
          ),
        },
      ],
      { initialEntries: [path] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

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
  it('create organization and navigates to it', async () => {
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

  it('create balance sheet and navigates to it', async () => {
    const balanceSheetMockBuilder = new BalanceSheetMockBuilder().withId(3);
    mockApi.createBalanceSheet.mockResolvedValue(
      balanceSheetMockBuilder.build()
    );

    const request = new Request(new URL('http://localhost/'), {
      method: 'post',
      body: JSON.stringify({
        balanceSheet: { ...balanceSheetMockBuilder.buildRequestBody() },
        intent: 'createBalanceSheet',
      }),
    });

    const result = await action(
      { params: { orgaId: '1' }, request },
      { userData: { access_token: 'token' } }
    );
    expect(result!.status).toEqual(302);

    expect(result!.headers.get('Location')).toEqual(
      `/organization/1/balancesheet/${balanceSheetMockBuilder.build().id}/overview`
    );
    expect(mockApi.createBalanceSheet).toHaveBeenCalledWith(
      balanceSheetMockBuilder.buildRequestBody(),
      1
    );
  });
});
