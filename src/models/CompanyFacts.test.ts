import { describe, expect, it } from 'vitest';
import { CompanyFactsFormSchema } from './CompanyFacts.ts';

describe('CompanyFactsFormSchema', () => {
  const companyFacts = {
    totalPurchaseFromSuppliers: 1,
    totalStaffCosts: 2,
    profit: 3,
    financialCosts: 4,
    incomeFromFinancialInvestments: 5,
    additionsToFixedAssets: 6,
    turnover: 7,
    totalAssets: 8,
    financialAssetsAndCashBalance: 9,
    numberOfEmployees: 11,
    hasCanteen: true,
    averageJourneyToWorkForStaffInKm: 12,
    isB2B: true,
    supplyFractions: [],
    employeesFractions: [],
    industrySectors: [],
    mainOriginOfOtherSuppliers: {
      countryCode: 'DEU',
      costs: 23,
    },
  };
  it('should fail validation if the sum of percentages of employees is greater 100', () => {
    const result = CompanyFactsFormSchema.safeParse({
      ...companyFacts,
      employeesFractions: [
        { countryCode: 'DEU', percentage: 80 },
        { countryCode: 'BEL', percentage: 70 },
      ],
    });
    expect(result.success).toBeFalsy();
    expect(!result.success && result.error.errors[0].message).toEqual(
      'The sum of all percentage values should not be greater than 100.'
    );
  });
  it('should pass validation if the sum of percentages of employees is equal 100', () => {
    const result = CompanyFactsFormSchema.safeParse({
      ...companyFacts,
      employeesFractions: [
        { countryCode: 'DEU', percentage: 80 },
        { countryCode: 'BEL', percentage: 20 },
      ],
    });
    expect(result.success).toBeTruthy();
  });
});
