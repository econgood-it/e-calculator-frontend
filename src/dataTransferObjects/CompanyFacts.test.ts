import { CompanyFactsSchema } from './CompanyFacts';
import { CompanyFactsMocks } from '../testUtils/balanceSheets';

describe('CompanyFacts', () => {
  it('should parse json as company facts', () => {
    const json = CompanyFactsMocks.companyFacts1();
    const companyFacts = CompanyFactsSchema.parse(json);
    expect(companyFacts).toMatchObject(json);
  });
});
