import '@testing-library/jest-dom';

import { CustomersMocks } from '../../../testUtils/balanceSheets';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { useAlert } from '../../../contexts/AlertContext';
import { expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved } from '../../../testUtils/form';
import { CustomersForm } from './CustomersForm';

jest.mock('../../../contexts/ActiveBalanceSheetProvider');
jest.mock('../../../contexts/AlertContext');

describe('CustomersForm', () => {
  const updateCompanyFacts = jest.fn();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      updateCompanyFacts: updateCompanyFacts,
    });
  });

  it('should modify turnover field and save changes', async () => {
    const formData = CustomersMocks.customers1();
    const form = <CustomersForm formData={formData} />;
    await expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved(
      'Turnover',
      'turnover',
      updateCompanyFacts,
      formData as any,
      form
    );
  });
});
