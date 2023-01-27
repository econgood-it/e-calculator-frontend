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
    };
    const companyFacts = CompanyFactsSchema.parse(json);
    expect(companyFacts).toMatchObject(json);
  });
});
