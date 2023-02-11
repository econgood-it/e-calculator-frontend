import { BalanceSheet } from '../dataTransferObjects/BalanceSheet';
import { RatingType } from '../dataTransferObjects/Rating';
import { CompanyFacts } from '../dataTransferObjects/CompanyFacts';

export const OwnersAndFinancialServicesMocks = {
  ownersAndFinancialServices1: () => ({
    profit: 90,
    financialCosts: 120,
    incomeFromFinancialInvestments: 10,
    totalAssets: 1,
    additionsToFixedAssets: 2,
    financialAssetsAndCashBalance: 23,
  }),
};

export const EmployeesMocks = {
  employees1: () => ({
    numberOfEmployees: 30,
    totalStaffCosts: 17,
    averageJourneyToWorkForStaffInKm: 13,
    hasCanteen: false,
    employeesFractions: [{ countryCode: 'AFG', percentage: 0.5 }],
  }),
};

export const SuppliersMocks = {
  suppliers1: () => ({
    totalPurchaseFromSuppliers: 900,
    supplyFractions: [
      {
        countryCode: 'EGY',
        industryCode: 'A',
        costs: 388,
      },
      {
        countryCode: 'AFG',
        industryCode: 'A',
        costs: 54,
      },
    ],
    mainOriginOfOtherSuppliers: { costs: 388 + 54, countryCode: 'BEL' },
  }),
};

export const CompanyFactsMocks = {
  companyFacts1: (): CompanyFacts => ({
    ...SuppliersMocks.suppliers1(),
    ...OwnersAndFinancialServicesMocks.ownersAndFinancialServices1(),
    ...EmployeesMocks.employees1(),
  }),
};

export const BalanceSheetMocks = {
  balanceSheet1: (): BalanceSheet => ({
    id: 3,
    companyFacts: CompanyFactsMocks.companyFacts1(),
    ratings: [
      {
        shortName: 'A1',
        name: 'Menschenwürde in der Zulieferkette',
        estimations: 0,
        type: RatingType.topic,
      },
      {
        shortName: 'A1.1',
        name: 'Arbeitsbedingungen und gesellschaftliche Auswirkungen in der Zulieferkette',
        estimations: 0,
        isPositive: true,
        type: RatingType.aspect,
      },
      {
        shortName: 'A1.2',
        name: 'Negativ-Aspekt: Verletzung der Menschenwürde in der Zulieferkette',
        estimations: 0,
        isPositive: false,
        type: RatingType.aspect,
      },
      {
        shortName: 'B1.1',
        name: 'Financial independence through equity financing',
        estimations: 0,
        isPositive: false,
        type: RatingType.aspect,
      },
    ],
  }),
};
