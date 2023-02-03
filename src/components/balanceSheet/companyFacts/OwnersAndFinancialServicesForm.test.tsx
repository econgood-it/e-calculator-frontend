import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';

import { OwnersAndFinancialServicesMocks } from '../../../testUtils/balanceSheets';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { useAlert } from '../../../contexts/AlertContext';
import { OwnersAndFinancialServicesForm } from './OwnersAndFinancialServicesForm';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import Element from 'react';

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

  async function checkCurrencyFieldValidations(
    input: Element,
    user: UserEvent
  ) {
    await user.clear(input);
    await user.type(input, 'a7');
    expect(input).toHaveValue('a7');
    expect(screen.getByText('Number expected')).toBeInTheDocument();
    //
    await user.clear(input);
    await user.type(input, '-7');
    expect(input).toHaveValue('-7');
    await waitFor(() =>
      expect(screen.getByText('Number should be positive')).toBeInTheDocument()
    );
  }

  async function shouldModifyFieldSaveResults(
    fieldLabel: string,
    fieldKey: string
  ) {
    const user = userEvent.setup();
    const formData =
      OwnersAndFinancialServicesMocks.ownersAndFinancialServices1();
    renderWithTheme(<OwnersAndFinancialServicesForm formData={formData} />);
    const input = screen.getByLabelText(fieldLabel);

    expect(input).toHaveValue((formData as any)[fieldKey].toString());
    await checkCurrencyFieldValidations(input, user);
    const modifiedValue = 7;
    await user.clear(input);
    await user.type(input, modifiedValue.toString());
    expect(input).toHaveValue(modifiedValue.toString());

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(updateCompanyFacts).toHaveBeenCalledWith({
      ...formData,
      [fieldKey]: modifiedValue,
    });
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
      'incomeFromFinancialInvestments'
    );
  });

  it('should modify income from total assets field and save changes', async () => {
    await shouldModifyFieldSaveResults('Total assets', 'totalAssets');
  });

  it('should modify additions to fixed assets field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Additions to fixed assets',
      'additionsToFixedAssets'
    );
  });

  it('should modify financial assets and cash balance field and save changes', async () => {
    await shouldModifyFieldSaveResults(
      'Financial assets and cash balance',
      'financialAssetsAndCashBalance'
    );
  });
});
