import { CompanyFactsSchema } from './CompanyFacts';

describe('CompanyFacts', () => {
  it('should parse json as company facts', () => {
    const json = {
      totalPurchaseFromSuppliers: 90,
      supplyFractions: [{ countryCode: 'DEU', costs: 3, industryCode: 'A' }],
      mainOriginOfOtherSuppliers: {
        costs: 88,
        countryCode: 'DEU',
      },
      profit: 190,
      financialCosts: 90,
      incomeFromFinancialInvestments: 10,
      totalAssets: 1,
      additionsToFixedAssets: 2,
      financialAssetsAndCashBalance: 23,
      numberOfEmployees: 30,
      totalStaffCosts: 17,
      averageJourneyToWorkForStaffInKm: 13,
      hasCanteen: false,
    };
    const companyFacts = CompanyFactsSchema.parse(json);
    expect(companyFacts).toMatchObject(json);
  });
});
