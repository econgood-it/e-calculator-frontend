import { screen, waitFor, within } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import {
  BalanceSheetMockBuilder,
  CompanyFactsMockBuilder,
  CustomersMocks,
  EmployeesMocks,
  OwnersAndFinancialServicesMocks,
  SuppliersMocks,
} from '../testUtils/balanceSheets';
import { regionsMocks } from '../testUtils/regions';
import CompanyFactsPage, { action, loader } from './CompanyFactsPage';
import { industriesMocks } from '../testUtils/industries';
import { describe, expect, it, Mock, vi } from 'vitest';
import { setupApiMock } from '../testUtils/api.ts';
import {
  CompanyFacts,
  CompanyFactsPatchRequestBody,
} from '../models/CompanyFacts.ts';
import {
  ActionFunctionArgs,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  checkNumberFieldValidations,
  fillNumberField,
  saveForm,
  selectIndustry,
  selectRegion,
} from '../testUtils/form.tsx';
import '@testing-library/jest-dom';

function createRouter(companyFacts: CompanyFacts, action: Mock) {
  const initialPathForRouting = '/organization/3/balance-sheet/7';
  return createMemoryRouter(
    [
      {
        path: initialPathForRouting,
        element: <CompanyFactsPage />,
        loader: () => ({
          companyFacts,
          regions: regionsMocks.regions1(),
          industries: industriesMocks.industries1(),
        }),
        action: async ({ request }: ActionFunctionArgs) =>
          action(await request.json()),
      },
    ],
    { initialEntries: [initialPathForRouting] }
  );
}

describe('CompanyFactsPage', () => {
  it('renders forms', async () => {
    const balanceSheet = new BalanceSheetMockBuilder().build();

    const action = vi.fn().mockResolvedValue(null);
    const router = createRouter(balanceSheet.companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    expect(await screen.findByText('A: Suppliers')).toBeInTheDocument();
    await user.click(screen.getByText('Next'));
    expect(
      await screen.findByText(
        'B: Owners, equity- and financial service providers'
      )
    ).toBeInTheDocument();
    await user.click(screen.getByText('Next'));
    expect(await screen.findByText('C: Employees')).toBeInTheDocument();
    await user.click(screen.getByText('Next'));

    expect(
      await screen.findByText('D: Customers and other companies')
    ).toBeInTheDocument();
  });

  it('does not switch to the next form page if the current form has validation errors', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const addSupplierButton = await screen.findByRole('button', {
      name: 'Add supplier',
    });
    await user.click(addSupplierButton);
    await user.click(await screen.findByText('Next'));
    expect(
      await screen.findByText('Number should be positive and greater than zero')
    ).toBeInTheDocument();
    expect(screen.getByText('A: Suppliers')).toBeInTheDocument();
  });

  it('does not switch to the previous form page if the current form has validation errors', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Next'));
    const input = await screen.findByLabelText('Financial costs');
    await user.clear(input);
    await user.type(input, '-2');
    await user.click(await screen.findByText('Back'));
    expect(input).toHaveValue('-2');
    expect(
      await screen.findAllByText('Number should be positive')
    ).toHaveLength(2);

    expect(
      screen.getByText('B: Owners, equity- and financial service providers')
    ).toBeInTheDocument();
  });
});

describe('SuppliersForm', () => {
  it('should set default value and validate all modifications for the field total purchase from suppliers', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const router = createRouter(companyFactsMockBuilder.build(), action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const input = await screen.findByLabelText(
      'Total purchases from suppliers'
    );
    expect(input).toHaveValue(
      companyFactsMockBuilder.build().totalPurchaseFromSuppliers.toString()
    );

    await user.clear(input);
    expect(input).toHaveValue('');
    expect(screen.getByText('Number expected')).not.toBeNull();

    await user.clear(input);
    await user.type(input, '-7');
    expect(input).toHaveValue('-7');
    await waitFor(() =>
      expect(screen.getByText('Number should be positive')).toBeInTheDocument()
    );

    await user.clear(input);
    await user.type(input, '8');
    expect(input).toHaveValue('8');
  });

  it('saves changes on total purchase from suppliers field', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...SuppliersMocks.suppliers1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const input = await screen.findByLabelText(
      'Total purchases from suppliers'
    );
    expect(input).toHaveValue('900');
    await user.clear(input);
    await user.type(input, '800');
    expect(input).toHaveValue('800');
    await saveForm(user);
    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        totalPurchaseFromSuppliers: 800,
        mainOriginOfOtherSuppliers:
          SuppliersMocks.suppliers1().mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });

  it('renders supply fractions', async () => {
    const companyFacts = new CompanyFactsMockBuilder().build();
    const action = vi.fn().mockResolvedValue(null);
    const router = createRouter(companyFacts, action);
    renderWithTheme(<RouterProvider router={router} />);

    for (const index in companyFacts.supplyFractions) {
      expect(
        await screen.findByLabelText(`supplyFractions.${index}.costs`)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(`supplyFractions.${index}.countryCode`)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(`supplyFractions.${index}.industryCode`)
      ).toBeInTheDocument();
    }
  });

  it('saves changes of the supply fractions costs', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...SuppliersMocks.suppliers1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    const newCosts = 20;
    for (const index in companyFacts.supplyFractions) {
      await fillNumberField(user, `supplyFractions.${index}.costs`, newCosts);
    }

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        totalPurchaseFromSuppliers: companyFacts.totalPurchaseFromSuppliers,
        supplyFractions: companyFactsMockBuilder
          .build()
          .supplyFractions.map((s) => ({ ...s, costs: newCosts })),
        mainOriginOfOtherSuppliers:
          companyFactsMockBuilder.build().mainOriginOfOtherSuppliers
            .countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });

  it('adding supply fraction without region selected leads to form error', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...new CompanyFactsMockBuilder().build(),
      ...SuppliersMocks.suppliers1(),
      supplyFractions: [],
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const addSupplierButton = await screen.findByRole('button', {
      name: 'Add supplier',
    });
    await user.click(addSupplierButton);
    await saveForm(user);

    expect(action).not.toHaveBeenCalled();
  });

  it('saves changes of main origin region', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...new CompanyFactsMockBuilder().build(),
      ...SuppliersMocks.suppliers1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const selectedRegion = regionsMocks.regions1()[3];
    await selectRegion(
      user,
      'mainOriginOfOtherSuppliers.countryCode',
      selectedRegion
    );
    await saveForm(user);

    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        mainOriginOfOtherSuppliers: selectedRegion.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });

  it('removes supply fraction and saves changes', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...new CompanyFactsMockBuilder().build(),
      ...SuppliersMocks.suppliers1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    const removeSupplierButton = await screen.findByRole('button', {
      name: `Remove supplyFractions with 0`,
    });
    await user.click(removeSupplierButton);
    await saveForm(user);
    const expectedSupplyFractions = [...companyFacts.supplyFractions.slice(1)];
    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        totalPurchaseFromSuppliers: 900,
        supplyFractions: expectedSupplyFractions,
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });

  it('main origin of other suppliers field is readonly', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...new CompanyFactsMockBuilder().build(),
      ...SuppliersMocks.suppliers1(),
    };
    const router = createRouter(companyFacts, action);
    renderWithTheme(<RouterProvider router={router} />);
    const mainOriginOfOtherSuppliersFieldBeforeUpdate =
      await screen.findByLabelText(`mainOriginOfOtherSuppliers.costs`);

    expect(
      within(mainOriginOfOtherSuppliersFieldBeforeUpdate).getByRole('textbox')
    ).toHaveAttribute('readonly');
  });

  it('main origin of other suppliers updates if costs of supply fraction change', async () => {
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...new CompanyFactsMockBuilder().build(),
      ...SuppliersMocks.suppliers1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    const mainOriginOfOtherSuppliersFieldBeforeUpdate =
      await screen.findByLabelText(`mainOriginOfOtherSuppliers.costs`);

    await waitFor(() =>
      expect(
        within(mainOriginOfOtherSuppliersFieldBeforeUpdate).getByRole('textbox')
      ).toHaveValue((900 - 388 - 54).toString())
    );

    const newCosts = 20;
    for (const index in companyFacts.supplyFractions) {
      await fillNumberField(user, `supplyFractions.${index}.costs`, newCosts);
    }
    const mainOriginOfOtherSuppliersField = screen.getByLabelText(
      `mainOriginOfOtherSuppliers.costs`
    );

    expect(
      within(mainOriginOfOtherSuppliersField).getByRole('textbox')
    ).toHaveValue(
      (900 - newCosts * companyFacts.supplyFractions.length).toString()
    );
  });
});

describe('OwnersAndFinancialServicesForm', () => {
  async function shouldModifyFieldSaveResults(
    fieldLabel: string,
    fieldKey: keyof CompanyFacts,
    isPositveNumber: boolean = true
  ) {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...OwnersAndFinancialServicesMocks.ownersAndFinancialServices1(),
    };
    const router = createRouter(companyFacts, action);

    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.click(await screen.findByText('Next'));
    const input = await screen.findByLabelText(fieldLabel);

    await checkNumberFieldValidations(isPositveNumber, input, user);
    const modifiedValue = 7;
    await user.clear(input);
    await user.type(input, modifiedValue.toString());
    expect(input).toHaveValue(modifiedValue.toString());

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
        [fieldKey]: modifiedValue,
      },
      intent: 'updateCompanyFacts',
    });
  }

  it('should modify EBIT (Earnings Before Interest and Taxes) field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'EBIT (Earnings Before Interest and Taxes)',
      'profit',
      false
    );
  });

  it('should modify financial costs field and save changes', async () => {
    await shouldModifyFieldSaveResults('Financial costs', 'financialCosts');
  });

  it('should modify income from financial investments field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Income from financial investments',
      'incomeFromFinancialInvestments',
      false
    );
  });

  it('should modify income from total assets field and save changes', async () => {
    await shouldModifyFieldSaveResults('Total assets', 'totalAssets');
  });

  it('should modify additions to fixed assets field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Additions to fixed assets',
      'additionsToFixedAssets',
      false
    );
  });

  it('should modify financial assets and cash balance field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Financial assets and cash balance',
      'financialAssetsAndCashBalance',
      false
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

describe('EmployeesForm', () => {
  async function shouldModifyFieldSaveResults(
    fieldLabel: string,
    fieldKey: string,
    isPositiveNumber: boolean = true
  ) {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...EmployeesMocks.employees1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.dblClick(await screen.findByText('Next'));
    const input = await screen.findByLabelText(fieldLabel);

    await checkNumberFieldValidations(isPositiveNumber, input, user);
    const modifiedValue = 7;
    await user.clear(input);
    await user.type(input, modifiedValue.toString());
    expect(input).toHaveValue(modifiedValue.toString());

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        [fieldKey]: modifiedValue,
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  }

  it('should modify number of employees field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Number of employees (full time equivalents)',
      'numberOfEmployees'
    );
  });

  it('should modify total staff costs field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Staff costs (gross without employer contribution)',
      'totalStaffCosts'
    );
  });

  it('should modify average journey to work field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Average journey to work for staff (in km)',
      'averageJourneyToWorkForStaffInKm'
    );
  });

  it('should check has canteen switch on and recognize modification', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...EmployeesMocks.employees1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.dblClick(await screen.findByText('Next'));
    const switchField = screen.getByRole('checkbox', {
      name: 'Is there a canteen for the majority of staff?',
    });
    expect((switchField as HTMLInputElement).checked).toBeFalsy();
    await user.click(switchField);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        hasCanteen: true,
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });

  it('adding employees fraction without region selected leads to form error', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...EmployeesMocks.employees1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.dblClick(await screen.findByText('Next'));
    const addEmployeesOriginButton = screen.getByRole('button', {
      name: 'Add employees origin',
    });
    await user.click(addEmployeesOriginButton);
    await saveForm(user);

    expect(action).not.toHaveBeenCalled();
  });

  it('adding employees fractions where the sum of percentage > 100 leads to form error', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      employeesFractions: [
        { countryCode: 'AFG', percentage: 80 },
        { countryCode: 'BEL', percentage: 20 },
      ],
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.dblClick(await screen.findByText('Next'));
    await fillNumberField(user, `employeesFractions.${1}.percentage`, 30);
    await saveForm(user);
    expect(action).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        'The sum of all percentage values should not be greater than 100.'
      )
    ).toBeInTheDocument();
  });

  it('adds employees fraction and modify and save its fields', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...EmployeesMocks.employees1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.dblClick(await screen.findByText('Next'));
    const addEmployeesOriginButton = screen.getByRole('button', {
      name: 'Add employees origin',
    });
    await user.click(addEmployeesOriginButton);
    const indexOfAddedEmployeesFraction =
      EmployeesMocks.employees1().employeesFractions.length;
    const selectedRegion = regionsMocks.regions1()[3];
    await selectRegion(
      user,
      `employeesFractions.${indexOfAddedEmployeesFraction}.countryCode`,
      selectedRegion
    );
    const percentage = 40;
    await fillNumberField(
      user,
      `employeesFractions.${indexOfAddedEmployeesFraction}.percentage`,
      percentage
    );
    await saveForm(user);

    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        employeesFractions: [
          ...companyFacts.employeesFractions,
          { countryCode: selectedRegion.countryCode, percentage: 40 },
        ],
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });

  it('removes employees fraction and saves changes', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...EmployeesMocks.employees1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.dblClick(await screen.findByText('Next'));
    const removeEmployeesFractionButton = screen.getByRole('button', {
      name: `Remove employeesFractions with 0`,
    });
    await user.click(removeEmployeesFractionButton);
    await saveForm(user);

    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        employeesFractions: [],
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });
});

describe('CustomersForm', () => {
  it('should modify turnover field and save changes', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...CustomersMocks.customers1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);

    await user.tripleClick(await screen.findByText('Next'));
    const input = await screen.findByLabelText('Turnover');

    await checkNumberFieldValidations(true, input, user);
    const modifiedValue = 7;
    await user.clear(input);
    await user.type(input, modifiedValue.toString());
    expect(input).toHaveValue(modifiedValue.toString());
    const saveButton = await screen.findByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        turnover: modifiedValue,
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });

  it('switches are your customers mainly other companies on and recognize modification', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...CustomersMocks.customers1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.tripleClick(await screen.findByText('Next'));
    const switchField = screen.getByRole('checkbox', {
      name: 'Are your customers mainly other companies?',
    });
    expect((switchField as HTMLInputElement).checked).toBeFalsy();
    await user.click(switchField);
    await saveForm(user);
    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        isB2B: true,
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  });

  it('adds industry sector and modify and save its fields', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      ...CustomersMocks.customers1(),
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.tripleClick(await screen.findByText('Next'));
    const addIndustrySectorButton = screen.getByRole('button', {
      name: 'Add industry sector',
    });
    await user.click(addIndustrySectorButton);
    const indexOfAddedIndustrySector =
      CustomersMocks.customers1().industrySectors.length;
    const selectedIndustry = industriesMocks.industries1()[2];
    await selectIndustry(
      user,
      `industrySectors.${indexOfAddedIndustrySector}.industryCode`,
      selectedIndustry
    );
    const amountOfTotalTurnover = 20;
    await fillNumberField(
      user,
      `industrySectors.${indexOfAddedIndustrySector}.amountOfTotalTurnover`,
      amountOfTotalTurnover
    );
    await saveForm(user);

    expect(action).toHaveBeenCalledWith({
      companyFacts: {
        ...companyFacts,
        industrySectors: [
          ...companyFacts.industrySectors,
          {
            description: '',
            industryCode: selectedIndustry.industryCode,
            amountOfTotalTurnover: amountOfTotalTurnover,
          },
        ],
        mainOriginOfOtherSuppliers:
          companyFacts.mainOriginOfOtherSuppliers.countryCode,
      },
      intent: 'updateCompanyFacts',
    });
  }, 10000);

  it('adding industry sectors where the sum of percentage > 100 leads to form error', async () => {
    const companyFactsMockBuilder = new CompanyFactsMockBuilder();
    const action = vi.fn().mockResolvedValue(null);
    const companyFacts = {
      ...companyFactsMockBuilder.build(),
      industrySectors: [
        { industryCode: 'A', description: 'desc', amountOfTotalTurnover: 80 },
        { industryCode: 'A', description: 'desc', amountOfTotalTurnover: 20 },
      ],
    };
    const router = createRouter(companyFacts, action);
    const { user } = renderWithTheme(<RouterProvider router={router} />);
    await user.tripleClick(await screen.findByText('Next'));
    await fillNumberField(
      user,
      `industrySectors.${1}.amountOfTotalTurnover`,
      30
    );
    await saveForm(user);
    expect(action).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        'The sum of all percentage values should not be greater than 100.'
      )
    ).toBeInTheDocument();
  });
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
