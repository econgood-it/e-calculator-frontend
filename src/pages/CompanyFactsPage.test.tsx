import { screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { regionsMocks } from '../testUtils/regions';
import CompanyFactsPage, { action, loader } from './CompanyFactsPage';
import { industriesMocks } from '../testUtils/industries';
import { describe, expect, it, vi } from 'vitest';
import { setupApiMock } from '../testUtils/api.ts';
import { CompanyFactsPatchRequestBody } from '../models/CompanyFacts.ts';
import {
  ActionFunctionArgs,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';

describe('CompanyFactsPage', () => {
  it('renders forms', async () => {
    const balanceSheet = new BalanceSheetMockBuilder().build();

    const action = vi.fn().mockResolvedValue(null);
    const initialPathForRouting = '/organization/3/balance-sheet/7';
    const router = createMemoryRouter(
      [
        {
          path: initialPathForRouting,
          element: <CompanyFactsPage />,
          loader: () => ({
            companyFacts: balanceSheet.companyFacts,
            regions: regionsMocks.regions1(),
            industries: industriesMocks.industries1(),
          }),
          action: async ({ request }: ActionFunctionArgs) =>
            action(await request.json()),
        },
      ],
      { initialEntries: [initialPathForRouting] }
    );
    renderWithTheme(<RouterProvider router={router} />);
    expect(await screen.findByText('Suppliers')).toBeInTheDocument();
    expect(
      await screen.findByText('Owners, equity- and financial service providers')
    ).toBeInTheDocument();
    expect(await screen.findByText('Employees')).toBeInTheDocument();

    expect(await screen.findByText('Customers')).toBeInTheDocument();
  });

  it('updates company facts and calls action', async () => {
    const balanceSheet = new BalanceSheetMockBuilder().build();

    const action = vi.fn().mockResolvedValue(null);
    const initialPathForRouting = '/organization/3/balance-sheet/7';
    const router = createMemoryRouter(
      [
        {
          path: initialPathForRouting,
          element: <CompanyFactsPage />,
          loader: () => ({
            companyFacts: balanceSheet.companyFacts,
            regions: regionsMocks.regions1(),
            industries: industriesMocks.industries1(),
          }),
          action: async ({ request }: ActionFunctionArgs) =>
            action(await request.json()),
        },
      ],
      { initialEntries: [initialPathForRouting] }
    );

    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const input = await screen.findByLabelText('Turnover');
    const newTurnoverValue = 9393939;
    await user.clear(input);
    await user.type(input, newTurnoverValue.toString());

    const saveButton = screen.getAllByRole('button', { name: 'Save' })[3];
    await user.click(saveButton);

    await waitFor(() =>
      expect(action).toHaveBeenCalledWith({
        companyFacts: {
          turnover: newTurnoverValue,
          industrySectors: balanceSheet.companyFacts.industrySectors,
          isB2B: balanceSheet.companyFacts.isB2B,
        },
        intent: 'updateCompanyFacts',
      })
    );
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
  it('should load company facts, regions and industries', async () => {
    const balanceSheet = new BalanceSheetMockBuilder().build();
    mockApi.getBalanceSheet.mockResolvedValue(balanceSheet);
    mockApi.getRegions.mockResolvedValue(regionsMocks.regions1());
    mockApi.getIndustries.mockResolvedValue(industriesMocks.industries1());

    const result = await loader(
      {
        params: { orgaId: '3', balanceSheetId: '7' },
        request: new Request(new URL('http://localhost')),
      },
      { userData: { access_token: 'token' } }
    );

    expect(mockApi.getBalanceSheet).toHaveBeenCalledWith(7);
    expect(result!.companyFacts).toEqual(balanceSheet.companyFacts);
    expect(result!.regions).toEqual(regionsMocks.regions1());
    expect(result!.industries).toEqual(industriesMocks.industries1());
  });
});

describe('action', () => {
  it('should update company facts', async () => {
    const balanceSheet = new BalanceSheetMockBuilder().build();
    const companyFactsUpdate: CompanyFactsPatchRequestBody = {
      totalPurchaseFromSuppliers: 1000,
      supplyFractions: [
        {
          countryCode: 'DEU',
          industryCode: 'A',
          costs: 800,
        },
      ],
      mainOriginOfOtherSuppliers: 'Main origin',
      financialCosts: 1000,
      profit: 1000,
      incomeFromFinancialInvestments: 1000,
      totalAssets: 1000,
      additionsToFixedAssets: 1000,
      financialAssetsAndCashBalance: 1000,
      numberOfEmployees: 1000,
    };
    const updatedBalanceSheet = {
      ...balanceSheet,
      companyFacts: { ...balanceSheet.companyFacts, ...companyFactsUpdate },
    };
    mockApi.updateBalanceSheet.mockResolvedValue(updatedBalanceSheet);

    const request = new Request(new URL('http://localhost'), {
      method: 'post',
      body: JSON.stringify({
        companyFacts: companyFactsUpdate,
        intent: 'updateCompanyFacts',
      }),
    });

    await action(
      { params: { orgaId: '3', balanceSheetId: '7' }, request },
      { userData: { access_token: 'token' } }
    );

    expect(mockApi.updateBalanceSheet).toHaveBeenCalledWith(7, {
      companyFacts: companyFactsUpdate,
    });
  });
});
