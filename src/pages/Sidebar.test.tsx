import '@testing-library/jest-dom';
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
import { useUser } from '../contexts/UserProvider';

jest.mock('../contexts/BalanceSheetListProvider');
jest.mock('../contexts/OrganizationProvider');
jest.mock('../contexts/UserProvider');
jest.mock('../contexts/AlertContext');

describe('Sidebar', () => {
  const initialPathForRouting = '/organization/3';
  const balanceSheetItems = new BalanceSheetItemsMockBuilder().build();

  const balanceSheetListMock = {
    balanceSheetItems,
    setBalanceSheetItems: jest.fn(),
    createBalanceSheet: jest.fn(),
  };
  const setActiveOrganizationByIdMock = jest.fn();
  const logoutMock = jest.fn();

  beforeEach(() => {
    (useBalanceSheetItems as jest.Mock).mockImplementation(
      () => balanceSheetListMock
    );
    (useUser as jest.Mock).mockReturnValue({
      logout: logoutMock,
    });
    (useAlert as jest.Mock).mockReturnValue({
      addErrorAlert: jest.fn(),
    });
    (useOrganizations as jest.Mock).mockReturnValue({
      organizationItems: OrganizationItemsMocks.default(),
      activeOrganization: new OrganizationMockBuilder()
        .withId(OrganizationItemsMocks.default()[0].id)
        .build(),
      setActiveOrganizationById: setActiveOrganizationByIdMock,
    });
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
    const user = userEvent.setup();
    const orgaItemToSelect = OrganizationItemsMocks.default()[1];
    act(() => {
      renderWithTheme(
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
    });

    await user.click(
      screen.getByRole('button', {
        name: OrganizationItemsMocks.default()[0].name,
      })
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
        {
          path: '/',
          element: <div>User logout</div>,
        },
      ],
      { initialEntries: [initialPath] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.click(screen.getByLabelText('logout'));
    expect(logoutMock).toHaveBeenCalledWith();

    expect(await screen.findByText('User logout')).toBeInTheDocument();
  });
});
