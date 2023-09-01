import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import Sidebar from './Sidebar';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useApi } from '../contexts/ApiProvider';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { BalanceSheetMocks } from '../testUtils/balanceSheets';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { useOrganizations } from '../contexts/OrganizationProvider';
import {
  OrganizationItemsMocks,
  OrganizationMockBuilder,
} from '../testUtils/organization';
import { useAlert } from '../contexts/AlertContext';

jest.mock('../contexts/ApiProvider');
jest.mock('../contexts/BalanceSheetListProvider');
jest.mock('../contexts/OrganizationProvider');
jest.mock('../contexts/AlertContext');

describe('Sidebar', () => {
  const initialPathForRouting = '/organization/3';
  const balanceSheetItems = [{ id: 1 }, { id: 2 }];
  const setBalanceSheetItems = jest.fn();
  const apiMock = {
    get: jest.fn(),
    createBalanceSheet: jest.fn(),
  };
  const setActiveOrganizationByIdMock = jest.fn();

  beforeEach(() => {
    (useBalanceSheetItems as jest.Mock).mockReturnValue([
      balanceSheetItems,
      setBalanceSheetItems,
    ]);
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
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
    expect(screen.getByText('Balance sheet 1')).toBeInTheDocument();
    expect(screen.getByText('Balance sheet 2')).toBeInTheDocument();
  });

  it('navigates to balance sheet if user click on balance sheet navigation item', async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route path={initialPathForRouting} element={<Sidebar />} />
          <Route
            path={`/${initialPathForRouting}/balancesheet/2`}
            element={<div>Navigated to Balance sheet 2</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    const balanceSheetsNavButton = await screen.findByRole('link', {
      name: /Balance sheet 2/i,
    });

    await user.click(balanceSheetsNavButton);

    expect(
      await screen.findByText('Navigated to Balance sheet 2')
    ).toBeInTheDocument();
  });

  it('creates new balance sheet belonging to organization and navigates to it', async () => {
    const user = userEvent.setup();

    const balanceSheet = BalanceSheetMocks.balanceSheet1();
    (useOrganizations as jest.Mock).mockReturnValue({
      organizationItems: OrganizationItemsMocks.default(),
      activeOrganization: new OrganizationMockBuilder().build(),
      setActiveOrganizationById: setActiveOrganizationByIdMock,
    });
    apiMock.createBalanceSheet.mockResolvedValue({ ...balanceSheet, id: 3 });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    act(() => {
      renderWithTheme(
        <MemoryRouter initialEntries={[initialPathForRouting]}>
          <Routes>
            <Route path={initialPathForRouting} element={<Sidebar />} />
            <Route
              path={`${initialPathForRouting}/balancesheet/3`}
              element={<div>Navigated to Balance sheet 3</div>}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    await user.click(
      screen.getByRole('button', { name: /Create balance sheet/i })
    );

    expect(apiMock.createBalanceSheet).toHaveBeenCalledWith(
      {
        type: BalanceSheetType.Full,
        version: BalanceSheetVersion.v5_0_8,
      },
      new OrganizationMockBuilder().build().id
    );
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
});
