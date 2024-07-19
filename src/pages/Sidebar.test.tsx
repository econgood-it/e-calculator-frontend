import { act, screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import Sidebar from './Sidebar';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { BalanceSheetItemsMockBuilder } from '../testUtils/balanceSheets';
import { useOrganizations } from '../contexts/OrganizationProvider';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from 'oidc-react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../contexts/BalanceSheetListProvider');
vi.mock('../contexts/OrganizationProvider');
vi.mock('../contexts/AlertContext');

vi.mock('oidc-react', () => ({
  useAuth: vi.fn(),
}));

describe('Sidebar', () => {
  const initialPathForRouting = '/organization/3';
  const balanceSheetItems = new BalanceSheetItemsMockBuilder().build();

  const balanceSheetListMock = {
    balanceSheetItems,
    setBalanceSheetItems: vi.fn(),
    createBalanceSheet: vi.fn(),
  };
  const setActiveOrganizationByIdMock = vi.fn();
  const logoutMock = vi.fn();

  beforeEach(() => {
    (useBalanceSheetItems as Mock).mockImplementation(
      () => balanceSheetListMock
    );
    (useAuth as Mock).mockReturnValue({
      signOutRedirect: logoutMock,
    });
    (useAlert as Mock).mockReturnValue({
      addErrorAlert: vi.fn(),
    });
    (useOrganizations as Mock).mockReturnValue({
      organizationItems: OrganizationItemsMocks.default(),
      activeOrganization: new OrganizationMockBuilder()
        .withId(OrganizationItemsMocks.default()[0].id)
        .build(),
      setActiveOrganizationById: setActiveOrganizationByIdMock,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders Balance sheets subheader and Create balance sheet navigation item', async () => {
    act(() => {
      renderWithTheme(
        <MemoryRouter initialEntries={[initialPathForRouting]}>
          <Routes>
            <Route path={initialPathForRouting} element={<Sidebar />} />
          </Routes>
        </MemoryRouter>
      );
    });
    expect(await screen.findByText('Balance sheets')).toBeInTheDocument();
    expect(await screen.findByText('Create balance sheet')).toBeInTheDocument();
  });

  it('renders each balance sheet as a navigation item', async () => {
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route path={initialPathForRouting} element={<Sidebar />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findAllByText(/Balance sheet \d/)).toHaveLength(2);
    balanceSheetItems.forEach((b) => {
      expect(screen.getByText(`Balance sheet ${b.id}`)).toBeInTheDocument();
    });
  });

  it('navigates to balance sheet if user click on balance sheet navigation item', async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route path={initialPathForRouting} element={<Sidebar />} />
          <Route
            path={`/${initialPathForRouting}/balancesheet/3/overview`}
            element={<div>Navigated to Balance sheet 3</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    const balanceSheetsNavButton = await screen.findByRole('link', {
      name: /Balance sheet 3/i,
    });

    await user.click(balanceSheetsNavButton);

    expect(
      await screen.findByText('Navigated to Balance sheet 3')
    ).toBeInTheDocument();
  });

  it('creates organization and navigates to it clicked', async () => {
    const user = userEvent.setup();

    act(() => {
      renderWithTheme(
        <MemoryRouter initialEntries={[initialPathForRouting]}>
          <Routes>
            <Route path={initialPathForRouting} element={<Sidebar />} />
          </Routes>
        </MemoryRouter>
      );
    });

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
        },
        { path: 'profile', element: <div>Profile</div> },
      ],
      { initialEntries: [initialPath] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(screen.getByLabelText('Open user navigation menu'));
    await user.click(await screen.getByText('Profile'));
    expect(await screen.findByText('Profile')).toBeInTheDocument();
  });
});
