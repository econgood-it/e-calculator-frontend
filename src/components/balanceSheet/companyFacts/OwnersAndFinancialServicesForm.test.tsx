import '@testing-library/jest-dom';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { useAlert } from '../../../contexts/AlertContext';
import { OwnersAndFinancialServicesForm } from './OwnersAndFinancialServicesForm';
import { OwnersAndFinancialServicesMocks } from '../../../testUtils/balanceSheets';
import { expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved } from '../../../testUtils/form';

jest.mock('../../../contexts/ActiveBalanceSheetProvider');
jest.mock('../../../contexts/AlertContext');

describe('OwnersAndFinancialServicesForm', () => {
  const updateCompanyFacts = jest.fn();

  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      updateCompanyFacts: updateCompanyFacts,
    });
  });

  async function shouldModifyFieldSaveResults(
    fieldLabel: string,
    fieldKey: string,
    isPositveNumber: boolean = true
  ) {
    const formData =
      OwnersAndFinancialServicesMocks.ownersAndFinancialServices1();
    const form = <OwnersAndFinancialServicesForm formData={formData} />;
    await expectPositiveNumberFieldToBeValidatedAndModifiedAndSaved(
      isPositveNumber,
      fieldLabel,
      fieldKey,
      updateCompanyFacts,
      formData as any,
      form
    );
  }

  it('should modify profit field and save changes', async () => {
    await shouldModifyFieldSaveResults('Profit', 'profit');
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
      'financialAssetsAndCashBalance'
    );
  });
});
